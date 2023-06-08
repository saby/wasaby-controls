/**
 * @kaizen_zone 34bb392b-5861-4357-97e8-962564c09e75
 */
import * as ParallelDeferred from 'Core/ParallelDeferred';
import { constants } from 'Env/Env';
import { Logger } from 'UI/Utils';

interface IPendingOptions {
    notifyHandler: TNotifier;
}

export interface IPendingConfig {
    root?: string;
    showLoadingIndicator?: boolean;
    onPendingFail?: Function;
    validate?: Function;
    validateCompatible?: Function;
}

interface IPending {
    def: Promise<void>;
    validate?: Function;
    onPendingFail?: Function;
    showLoadingIndicator?: boolean;
    validateCompatible?: Function;
    loadingIndicatorId?: boolean;
}

interface IRootPendingStorage {
    [key: string]: IPendingStorage;
}

interface IPendingStorage {
    [key: number]: IPending;
}

interface IParallelDef {
    [key: string]: ParallelDeferred;
}

type TNotifier = (eventType: string, args: []) => void;

class PendingClass {
    private _pendingsCounter: number = 0;
    private _pendings: IRootPendingStorage = {};
    private _parallelDef: IParallelDef = {};
    private _beforeUnloadHandler: (event: Event) => void;
    private _validateStatus: object = {};

    private readonly _notify: TNotifier;

    constructor(options: IPendingOptions) {
        if (constants.isBrowserPlatform) {
            this._beforeUnloadHandler = (event: Event): void => {
                // We shouldn't close the tab if there are any pendings
                if (this.hasPendings()) {
                    event.preventDefault();
                    event.returnValue = '';
                } else {
                    window.removeEventListener(
                        'beforeunload',
                        this._beforeUnloadHandler
                    );
                }
            };
            window.addEventListener('beforeunload', this._beforeUnloadHandler);
        }
        this._notify = options.notifyHandler;
    }

    registerPending(def: Promise<void>, config: IPendingConfig = {}): void {
        if (!this._validatePromise(def)) {
            Logger.error(
                'Controls/Pending',
                'При регистрации пендинга произошла ошибка: В параметр' +
                    'события registerPending первым аргументом передан не promise.'
            );
        }

        const root = config.root || null;
        if (!this._pendings[root]) {
            this._pendings[root] = {};
        }
        this._pendings[root][this._pendingsCounter] = {
            // its Promise what signalling about pending finish
            def,

            validate: config.validate,

            validateCompatible: config.validateCompatible,

            // its function what helps pending to finish when query goes from finishPendingOperations
            onPendingFail: config.onPendingFail,

            // show indicator when pending is registered
            showLoadingIndicator: config.showLoadingIndicator,
        };
        if (config.showLoadingIndicator && !def.isReady()) {
            // show indicator if Promise still not finished on moment of registration
            const pending = this._pendings[root][this._pendingsCounter];
            const indicatorConfig = { id: pending.loadingIndicatorId };
            pending.loadingIndicatorId = this._notify('showIndicator', [
                indicatorConfig,
            ]);
        }
        // Замыкаем переменную _pendingsCounter
        const promiseHandler = (() => {
            const pendingCounter = this._pendingsCounter;
            return (res) => {
                this.unregisterPending(root, pendingCounter);
                return res;
            };
        })();
        // Дублируем функцию в then и catch потому, что при использовании catch и finally finishPendingOperations
        // срабатывает раньше, чем происходит unregister пендинга.
        def.then(promiseHandler).catch(promiseHandler);

        this._pendingsCounter++;
    }

    private _validatePromise(promise: Promise): boolean {
        return (
            promise &&
            (promise instanceof Promise ||
                promise._moduleName === 'Core/Deferred')
        );
    }

    hideIndicators(root: string): void {
        let pending;
        if (this._pendings) {
            pending = this._pendings[root];
            Object.keys(pending).forEach((key) => {
                const indicatorId = pending[key].loadingIndicatorId;
                if (indicatorId) {
                    this._notify('hideIndicator', [indicatorId]);
                }
            });
        }
    }

    unregisterPending(root: string, id: number): void {
        // Может произойти ситуация, когда промис пендинга зарезолвился, мы начали удаление пендинга из this._pendings и
        // код упал с ошибкой (например в прикладном обработчике на pendingFinished). Тогда у промиса стрельнет catch,
        // который мы так же обработаем и попадем в этот метод второй раз. Ставлю защиту
        const rootPending = this._pendings && this._pendings[root];
        if (rootPending) {
            this.hideIndicators(root);
            if (this._pendings) {
                delete rootPending[id];
                // Если корень пуст - удалим корень.
                if (Object.keys(rootPending).length === 0) {
                    delete this._pendings[root];
                }
                // notify if no more pendings
                if (!this.hasRegisteredPendings(root)) {
                    this._notify('pendingsFinished', []);
                }
                this._validateStatus = {};
            }
        }
    }

    finishPendingOperations(
        forceFinishValue: boolean | undefined,
        root: string = null,
        options?: unknown
    ): Promise<unknown> {
        let pendingResolver;
        let pendingReject;
        const resultPromise = new Promise((resolve, reject) => {
            pendingResolver = resolve;
            pendingReject = reject;
        });
        // Используем ParallelDeferred т.к. нем нужен метод cancel, который отсутствует у Promise.
        const parallelDef = new ParallelDeferred();
        const pendingResults = [];

        const pendingRoot = this._pendings[root] || {};
        Object.keys(pendingRoot).forEach((key) => {
            const pending = pendingRoot[key];
            let isValid = true;
            if (pending.validate) {
                if (typeof this._validateStatus[key] === 'undefined') {
                    isValid = pending.validate(options);
                } else {
                    isValid = this._validateStatus[key];
                }
            } else if (pending.validateCompatible) {
                // todo compatible
                isValid = pending.validateCompatible();
            }
            if (isValid) {
                if (pending.onPendingFail) {
                    pending.onPendingFail(
                        forceFinishValue,
                        pending.def,
                        options
                    );
                }

                // pending is waiting its promise finish
                parallelDef.push(pending.def);
            }
        });

        // cancel previous query of pending finish. create new query.
        this.cancelFinishingPending(root);
        this._parallelDef[root] = parallelDef.done().getResult();
        this._validateStatus = {};

        this._parallelDef[root]
            .then((results) => {
                if (typeof results === 'object') {
                    for (const resultIndex in results) {
                        if (results.hasOwnProperty(resultIndex)) {
                            const result = results[resultIndex];
                            pendingResults.push(result);
                        }
                    }
                }
                this._parallelDef[root] = null;

                pendingResolver(pendingResults);
            })
            .catch((e) => {
                pendingReject(e);
                return e;
            });

        return resultPromise;
    }

    cancelFinishingPending(root: string = null): void {
        if (this._parallelDef && this._parallelDef[root]) {
            // its need to cancel result Deferred of parallel deferred. reset state of deferred to achieve it.
            this._parallelDef[root]._fired = -1;
            this._parallelDef[root].cancel();
        }
    }

    hasPendings(): boolean {
        let hasPending = false;
        Object.keys(this._pendings).forEach((root) => {
            if (this.hasRegisteredPendings(root, false)) {
                hasPending = true;
            }
        });
        return hasPending;
    }

    hasRegisteredPendings(
        root: string = null,
        withCompatible: boolean = true
    ): boolean {
        let hasPending = false;
        const pendingRoot = this._pendings[root] || {};
        Object.keys(pendingRoot).forEach((key) => {
            const pending = pendingRoot[key];
            let isValid = true;
            if (pending.validate) {
                isValid = pending.validate();
                this._validateStatus[key] = isValid;
            } else if (pending.validateCompatible) {
                // ignore compatible pendings from beforeunload handler
                isValid = withCompatible ? pending.validateCompatible() : false;
            }

            // We have at least 1 active pending
            if (isValid) {
                hasPending = true;
            }
        });
        return hasPending;
    }

    destroy(): void {
        this._pendings = null;
        this._parallelDef = null;
        if (constants.isBrowserPlatform) {
            window.removeEventListener(
                'beforeunload',
                this._beforeUnloadHandler
            );
        }
    }
}

export default PendingClass;
