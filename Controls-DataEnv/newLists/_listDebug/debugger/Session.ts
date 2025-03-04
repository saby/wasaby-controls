import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { IOutput } from './output/IOutput';
import { ConsoleOutput } from './output/console';
import DurationTimer from './common/DurationTimer';
import { getChanges } from './utils/getChanges';
import { SliceUpdate, ISliceUpdateMeta } from './SliceUpdate';
import { DispatchesStorage, IDispatchesMeta } from './session/DispatchesStorage';
import { ChangesStorage, ChangeType, IChangesMeta } from './session/ChangesStorage';

import {
    IPhase,
    PhaseOne,
    PhaseTwo,
    PhaseThree,
    PhaseFour,
    PhaseFive,
    PhaseSix,
    IPhaseOneMeta,
    IPhaseTwoMeta,
    IPhaseThreeMeta,
    IPhaseFourMeta,
    IPhaseFiveMeta,
    IPhaseSixMeta,
} from './session/phases';
import * as ErrorDescriptors from '../ErrorDescriptors';

interface IAbstractUpdate {
    title?: string;
    initialState?: unknown;
    resultState?: unknown;
    duration?: number;
    changes?: IChangesMeta;
}

export interface IUpdateSessionMeta extends IAbstractUpdate {
    apiCalls?: TAbstractAction[];
    process?: IDispatchesMeta[];
    phases?: [
        IPhaseOneMeta,
        IPhaseTwoMeta,
        IPhaseThreeMeta,
        IPhaseFourMeta,
        IPhaseFiveMeta,
        IPhaseSixMeta,
    ];
    sliceUpdates?: ISliceUpdateMeta[];
}

const getFromTuple = <T extends unknown[] = unknown[]>(
    tuple: T,
    index: number
): T[number] | undefined => {
    if (index < 0 || index > tuple.length - 1) {
        return undefined;
    }
    return tuple[index];
};

/**
 * Сессия обновления интерактора.
 * От инициализации, до отрисовки или отмены.
 */
export class Session {
    private readonly _output: IOutput;

    /* new API */
    private _meta: IUpdateSessionMeta;
    /* new API */

    private _sessionDurationTimer?: DurationTimer;
    private _dispatchesStorage?: DispatchesStorage;
    private _changesStorage?: ChangesStorage;
    private _currentPhaseIndex: -1 | 0 | 1 | 2 | 3 | 4 = -1;
    private _phases?: [PhaseOne, PhaseTwo, PhaseThree, PhaseFour, PhaseFive, PhaseSix];
    private _sliceUpdates?: SliceUpdate[];

    private _isSessionStarted: boolean = false;

    constructor(output: IOutput = new ConsoleOutput()) {
        this._output = output;
        this._resetMeta();
    }

    private _ifStarted(): this | undefined;
    private _ifStarted(strict: true): this | never;
    private _ifStarted(strict?: true | void): this | never | undefined {
        if (this._isSessionStarted) {
            return this;
        }
        if (strict && !this._isSessionStarted) {
            throw ErrorDescriptors.MISSING_SESSION();
        }
    }

    private _getDispatchesStorage(): DispatchesStorage;
    private _getDispatchesStorage(strict: false): DispatchesStorage | undefined;
    private _getDispatchesStorage(strict?: false): DispatchesStorage | undefined {
        if (this._dispatchesStorage) {
            return this._dispatchesStorage;
        }
        if (strict !== false) {
            throw ErrorDescriptors.MISSING_DISPATCHER_STORAGE();
        }
    }

    private _getCurrentPhase(): IPhase;
    private _getCurrentPhase(strict: false): IPhase | undefined;
    private _getCurrentPhase(strict?: false): IPhase | undefined {
        if (this._phases) {
            const phase = getFromTuple(this._phases, this._currentPhaseIndex) as IPhase;
            if (phase) {
                return phase;
            }
        }

        if (strict !== false) {
            throw ErrorDescriptors.MISSING_PHASE();
        }
    }

    getMeta(): IUpdateSessionMeta {
        return this._meta;
    }

    //# region Сессия обновления
    startSession(initialState: unknown, actions: TAbstractAction[]) {
        if (this._isSessionStarted) {
            throw ErrorDescriptors.SESSION_ALREADY_EXISTS();
        }
        this._isSessionStarted = true;
        this._resetMeta();
        this._resetPhases();
        this._resetDispatches();
        this._resetChanges();
        this._resetSliceUpdates();

        // todo spread after check via Symbol.iterator
        this._meta.initialState = initialState;
        this._meta.apiCalls = actions;
        this._currentPhaseIndex = -1;
        this._sessionDurationTimer = DurationTimer.start();
        this.nextPhase(actions);
    }

    endSession(resultState: unknown) {
        if (!this._isSessionStarted) {
            throw ErrorDescriptors.MISSING_SESSION();
        }
        this._isSessionStarted = false;

        this.nextPhase(resultState);

        if (this._sessionDurationTimer) {
            this._meta.duration = this._sessionDurationTimer?.stop();
            this._sessionDurationTimer = undefined;
        }

        if (this._dispatchesStorage) {
            this._meta.process = this._dispatchesStorage.getMeta();
        }

        if (this._sliceUpdates) {
            this._meta.sliceUpdates = this._sliceUpdates.map((u) => u.getMeta());
        }

        if (this._changesStorage) {
            this._meta.changes = this._changesStorage.getMeta();
        }

        if (this._phases) {
            if (this._phases.some((p) => !p.isCompleted())) {
                const error = ErrorDescriptors.NOT_ALL_PHASES_COMPLETED();
                const { name, message } = error;
                this._output.renderItemImmediate({
                    type: 'info',
                    args: [`${name}: ${message}`],
                    status: 'errorBig',
                });
                throw error;
            }

            this._meta.phases = [
                this._phases[0].getMeta(),
                this._phases[1].getMeta(),
                this._phases[2].getMeta(),
                this._phases[3].getMeta(),
                this._phases[4].getMeta(),
                this._phases[5].getMeta(),
            ];
        }

        this._meta.resultState = resultState;
    }

    //# region Фазы сессии обновления
    nextPhase(arg: unknown): void {
        if (!this._phases || this._currentPhaseIndex > this._phases.length - 1) {
            return;
        }

        const start = () => {
            const currentPhase = this._getCurrentPhase(false);
            currentPhase?.start(typeof arg === 'object' ? { ...arg } : arg);
        };

        const end = () => {
            this.endPhase(typeof arg === 'object' ? { ...arg } : arg);
        };

        end();
        this._currentPhaseIndex++;
        start();
    }

    endPhase(arg: unknown): void {
        const currentPhase = this._getCurrentPhase(false);
        currentPhase?.end(typeof arg === 'object' ? { ...arg } : arg);
    }

    private _resetPhases() {
        this._destroyPhases();
        this._phases = [
            new PhaseOne(),
            new PhaseTwo(({ beforeMeta, afterMeta }) => {
                this._extractChanges(ChangeType.User, beforeMeta as object, afterMeta as object);
            }),
            new PhaseThree(),
            new PhaseFour(({ beforeMeta, afterMeta }) => {
                this._extractChanges(ChangeType.User, beforeMeta as object, afterMeta as object);
            }),
            new PhaseFive(),
            new PhaseSix(),
        ];
    }

    private _destroyPhases() {
        if (this._phases) {
            this._phases.forEach((p) => {
                p.destroy();
            });
        }
        this._phases = undefined;
    }
    //# endregion Фазы сессии обновления

    //# region Распространение действий(dispatch)
    startDispatch(action: TAbstractAction) {
        this._ifStarted(true);
        const dispatches = this._getDispatchesStorage();
        const phase = this._getCurrentPhase();

        if (!phase.isStarted()) {
            throw ErrorDescriptors.PHASE_NOT_STARTED();
        }
        dispatches.push(action, phase.id);
    }

    endDispatch() {
        this._ifStarted(true);

        const phase = this._getCurrentPhase();

        if (!phase.isStarted()) {
            throw ErrorDescriptors.PHASE_NOT_STARTED();
        }

        this._getDispatchesStorage().pop();
    }

    private _resetDispatches() {
        this._destroyDispatches();
        this._dispatchesStorage = new DispatchesStorage();
    }

    private _destroyDispatches() {
        if (this._dispatchesStorage) {
            this._dispatchesStorage.destroy();
        }
        this._dispatchesStorage = undefined;
    }
    //# endregion Распространение действий(dispatch)

    //# endregion Сессия обновления

    //# region Мутации состояние
    innerSetState(prevState: object, nextState: object) {
        this._ifStarted(true);
        const dispatch = this._getDispatchesStorage().getCurrentDispatch();

        // Не может быть вне распространения, т.к. это буквально
        // обновление состояния middleware-функцией
        if (!dispatch) {
            throw ErrorDescriptors.MISSING_DISPATCH();
        }

        const type = String(dispatch?.getMeta()?.action?.type);
        if (type !== 'Symbol(BeforeApplyStateSymbol)') {
            this._extractChanges(ChangeType.Inner, prevState, nextState);
        }
    }

    immediateSetState(prevState: object, nextState: object) {
        // Не может быть вне распространения, т.к. это буквально
        // обновление состояния middleware-функцией
        this._ifStarted(true)._extractChanges(ChangeType.Immediate, prevState, nextState);
    }

    private _extractChanges(changeType: ChangeType, prevState: object, nextState: object) {
        const store = this._changesStorage;
        if (!store) {
            // todo
            throw Error('!!!');
        }
        const changes = getChanges(prevState, nextState);
        changes.forEach((change) => {
            store.addChange({
                type: changeType,
                ...change,
                phaseId: this._getCurrentPhase(false)?.id,
            });
        });
    }

    private _resetChanges() {
        this._destroyChangesStorage();
        this._changesStorage = new ChangesStorage(this._getDispatchesStorage());
    }

    private _destroyChangesStorage() {
        if (this._changesStorage) {
            this._changesStorage.destroy();
            this._changesStorage = undefined;
        }
    }
    //# endregion Мутации состояние

    //# region Обновление слайса (непосредственно обновление React контекста)
    addSliceUpdate(update: SliceUpdate) {
        if (!this._sliceUpdates) {
            // todo
            throw Error('!!!!');
        }
        this._sliceUpdates?.push(update);
    }

    private _resetSliceUpdates() {
        this._destroySliceUpdates();
        this._sliceUpdates = [];
    }

    private _destroySliceUpdates() {
        if (this._sliceUpdates) {
            this._sliceUpdates.forEach((u) => u.destroy());
            this._sliceUpdates = undefined;
        }
    }
    //# endregion Обновление слайса (непосредственно обновление React контекста)

    destroy() {
        this._isSessionStarted = false;

        this._destroyChangesStorage();
        this._resetMeta();
        this._destroyDispatches();
        this._destroyPhases();

        if (this._sessionDurationTimer) {
            this._sessionDurationTimer.destroy();
            this._sessionDurationTimer = undefined;
        }
    }

    // ========

    private _resetMeta() {
        this._meta = {};
    }

    handleDispatchError(e: Error) {
        this._output.getNew().forEach((item) => {
            item.status = 'error';
        });
        this._output.add({
            type: 'info',
            status: 'errorBig',
            args: [`${e.name} ${e.message} ${e.stack}`, e],
        });
    }
}
