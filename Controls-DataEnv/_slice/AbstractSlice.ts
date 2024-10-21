import { PromiseCanceledError } from 'Types/entity';
import { ISliceConstructorProps } from 'Controls-DataEnv/dataFactory';
import { ConsoleLogger } from 'Env/Env';

function isObjectState(value: unknown | Record<string, unknown>): value is Record<string, unknown> {
    return value instanceof Object;
}

/**
 * Абстрактный Класс базового слайса.
 * Является дженериком. Принимает параметр State - тип состояния слайса
 * @remark
 * Полезные ссылки:
 * Про реализацию своего собственного читайте в {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/context-data/new-data-store/create-context/ статье}.
 * @public
 */
export default abstract class AbstractSlice<State = unknown> {
    readonly '[ISlice]': boolean = true;
    protected readonly _name: string;
    protected _onChange: Function | undefined;
    private _isExecuting: boolean = false;
    private _queue: Partial<State>[] = [];
    private _destroyed: boolean;
    private _stateForApply: Partial<State> | null;
    private _beforeApplyReject: Function | null;

    /**
     * Текущее состояние слайса.
     */
    state: State;

    /**
     * Конструктор класса
     */
    constructor(props: ISliceConstructorProps<unknown, unknown>) {
        this.state = this._initState(props.loadResult, props.config);
        if (this.state instanceof Object) {
            Object.keys(this.state).forEach((propName) => {
                Object.defineProperty(this, propName, {
                    enumerable: false,
                    get(): any {
                        return this.state[propName];
                    },
                });
            });
        }
        this._name = props.name || '';
        this._onChange = props.onChange;
    }

    /**
     * Метод инициализации начального состояния слайса.
     * @param loadResult Результат загрузки фабрики данных.
     * @param config Конфигурация фабрики даннных
     * @example
     * <pre class="brush: js">
     *    import {Slice} from 'Controls-DataEnv/Slice';
     *
     *    interface IMySliceState {
     *        propFromData: number;
     *        propFromConfig: number;
     *    }
     *
     *    export default class MySlice extends Slice<IMySliceState> {
     *        protected _initState(loadResult: IMyLoadResult, config: IMyFactoryConfig): IMySliceState {
     *            return {
     *                propFromData: loadResult.prop1,
     *                propFromConfig: config.prop2
     *            };
     *        }
     *    }
     * </pre>
     */
    protected abstract _initState(loadResult: unknown, config: unknown): State;

    /**
     * Метод, вызываемый при разрушении экземпляра слайса.
     * Может быть использован для отписок от различных хранилищ, шин событий и т.п.
     * @example
     * <pre class="brush: js">
     *    import {Slice} from 'Controls-DataEnv/Slice';
     *
     *    interface IMySliceState {
     *        propFromData: number;
     *        propFromConfig: number;
     *    }
     *
     *    export default class MySlice extends Slice<IMySliceState> {
     *          constructor(loadResult, config) {
     *              super(this);
     *              EventBusChannel.subscribe('event', this._eventHandler);
     *          }
     *
     *          destroy(): void {
     *              EventBusChannel.unsubscribe('event', this._eventHandler);
     *              super.destroy();
     *          }
     *    }
     * </pre>
     */
    destroy(): void {
        if (this._beforeApplyReject) {
            this._beforeApplyReject(new PromiseCanceledError('slice has been destroyed'));
        }
        this._onChange = undefined;
        this._destroyed = true;
    }

    isDestroyed(): boolean {
        return this._destroyed;
    }

    /**
     * Метод, вызываемый перед применением состояния в слайсе.
     * Должен вернуть новое состояние или Promise с новым состоянием в результате
     * Если вернулся Promise, то все изменения, происходящие за время задержки будут применены после резолва.
     * @param nextState следующее состояние слайса.
     * @example
     * <pre class="brush: js">
     *    import {Slice} from 'Controls-DataEnv/Slice';
     *
     *    interface IMySliceState {
     *        propFromData: number;
     *        propFromConfig: number;
     *    }
     *
     *    export default class MySlice extends Slice<IMySliceState> {
     *          _beforeApplyState(nextState: IMySliceState): IMySliceState {
     *              if (this.state.propFromData !== nextState.propFromData) {
     *                  nextState.propFromConfig++;
     *              }
     *              return nextState;
     *          }
     *    }
     * </pre>
     */
    protected _beforeApplyState(nextState: State): State | Promise<State> {
        return nextState;
    }

    protected _applyState<State>(partialState: Partial<State>): void {
        this._setState({
            ...this.state,
            ...partialState,
        });
    }

    protected _onRejectBeforeApplyState(): void | Promise<void> {
        // for overrides
    }

    protected _needRejectBeforeApply(
        _partialState: Partial<State>,
        _currentAppliedState?: Partial<State> | null
    ): boolean {
        return false;
    }

    protected _rejectBeforeApplyPromise(): void {
        this._beforeApplyReject?.(new PromiseCanceledError(''));
    }

    private _executeQueueIfNeed(): void {
        if (this._destroyed) {
            return;
        }
        if (this._queue.length) {
            let queueState: Partial<State> = {};
            this._queue.forEach((partialState) => {
                queueState = {
                    ...queueState,
                    ...partialState,
                };
            });
            this._queue = [];
            this.setState(queueState);
        }
    }

    private _setState(state: State): void {
        if (this.isDestroyed()) {
            new ConsoleLogger().error(
                'Controls-DataEnv/slice:AbstractSlice',
                'Произошла попытка установить состояние в уничтоженный экземпляр слайса'
            );
        }
        this.state = this._onSnapshot(state) || state;
        this._onChange?.(this.state);
    }

    protected _onSnapshot(state: State): State {
        return state;
    }

    private _getStateFromQueue(): Partial<State> {
        return this._queue.reduce((acc, queuedState) => {
            return { ...acc, ...queuedState };
        }, {});
    }

    /**
     * Метод для изменения состояния в слайсе.
     * @param partialState Новые значения состояния.
     * @example
     * <pre class="brush: js">
     *    import React from 'react';
     *    import {useSlice} from 'Controls-DataEnv/context';
     *
     *    export function MyComponent(props) {
     *        const mySlice = useSlice<MySlice>('mySliceId');
     *        mySlice.setState({
     *            prop1: 'value',
     *            prop2: 'value'
     *        });
     *    }
     * </pre>
     * @example
     * <pre class="brush: js">
     *    import React from 'react';
     *    import {useSlice} from 'Controls-DataEnv/context';
     *
     *    export function MyComponent(props) {
     *        const mySlice = useSlice<MySlice>('mySliceId');
     *        mySlice.setState((prevState) => ({prop1: prevState.prop1.concat([])}));
     *    }
     * </pre>
     * @example
     * <pre class="brush: js">
     *    import React from 'react';
     *    import {useSlice} from 'Controls-DataEnv/context';
     *
     *    export function MyComponent(props) {
     *        const mySlice = useSlice<MySlice>('mySliceId');
     *        mySlice.setState((prevState) => {
     *            if (condition) {
     *                return {
     *                  prop1: prevState.prop1.concat([])
     *                }
     *            };
     *            return {};
     *        });
     *    }
     * </pre>
     */
    setState(partialState: Partial<State> | ((prevState: State) => Partial<State>)): void {
        if (this._destroyed) {
            return;
        }
        const newPartialState: Partial<State> =
            typeof partialState === 'function'
                ? partialState({
                      ...this.state,
                      ...this._stateForApply,
                      ...this._getStateFromQueue(),
                  })
                : partialState;
        if (this._isExecuting) {
            let newState = newPartialState;
            if (
                this._beforeApplyReject &&
                this._needRejectBeforeApply(newPartialState, this._stateForApply)
            ) {
                newState = {
                    ...this._stateForApply,
                    ...newPartialState,
                };
                this._stateForApply = null;
                this._rejectBeforeApplyPromise();
            }
            this._queue.push(newState);
            return;
        }
        const partialStateKeys = Object.keys(newPartialState);
        if (partialStateKeys.length === 0) {
            return;
        }

        let stateAreEqual;

        if (isObjectState(this.state) && isObjectState(newPartialState)) {
            stateAreEqual = Object.keys(newPartialState).every((key) => {
                return (
                    (this.state as Record<string, unknown>)[key] ===
                    (newPartialState as Record<string, unknown>)[key]
                );
            });
        } else {
            stateAreEqual = this.state === newPartialState;
        }

        if (stateAreEqual) {
            this._isExecuting = false;
            this._executeQueueIfNeed();
            return;
        }
        this._isExecuting = true;

        const nextState = {
            ...this.state,
            ...newPartialState,
        };

        const beforeApplyResult = this._beforeApplyState(nextState);

        if (beforeApplyResult instanceof Promise) {
            this._stateForApply = newPartialState;
            const beforeApplyPromise = new Promise<State>((resolve, reject) => {
                this._beforeApplyReject = reject;
                return beforeApplyResult
                    .then((result) => resolve(result))
                    .catch((error) => reject(error));
            });
            beforeApplyPromise
                .then((result: State) => {
                    this._setState(result);
                })
                .catch((error) => {
                    if (!error.isCanceled) {
                        return Promise.reject(error);
                    } else {
                        return Promise.resolve(this._onRejectBeforeApplyState())
                            .then(() => {})
                            .catch(() => {});
                    }
                })
                .finally(() => {
                    this._beforeApplyReject = null;
                    this._isExecuting = false;
                    this._stateForApply = null;
                    this._executeQueueIfNeed();
                });
        } else if (typeof nextState === 'undefined') {
            throw new Error('Из обработчика _beforeApplyState не вернулось новое состояние');
        } else {
            this._setState(beforeApplyResult);
            this._isExecuting = false;
            this._executeQueueIfNeed();
        }
    }

    getData(): Partial<State> {
        return this.state;
    }
}
