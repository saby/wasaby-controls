import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { TDebugMode } from './types/TDebugMode';
import type { IOutput, TOutputStyle } from './output/IOutput';
import * as MSG from './MessageDescriptors';
import * as shouldLog from './utils/shouldLog';

import { showChanges } from './utils/showChanges';
import { getChanges, IChange } from './utils/getChanges';
import { DurationTimer } from './DurationTimer';
import { Dispatches } from './Dispatches';

export class Session {
    private readonly _id: string;
    private readonly _output: IOutput;
    private readonly _debugMode: TDebugMode;

    private _initialState?: unknown;

    private _sessionDurationTimer?: DurationTimer;
    private _dispatches: Dispatches;

    constructor(id: string, output: IOutput, debugMode: TDebugMode) {
        this._id = id;
        this._output = output;
        this._debugMode = debugMode;
        this._dispatches = new Dispatches(output, debugMode);
    }

    start(initialState: unknown) {
        this._initialState = initialState;

        this._sessionDurationTimer = DurationTimer.start();

        this._output.add('groupCollapsed', [
            MSG.START_UPDATE_SESSION(this._id, this._output.getConfig().style),
        ]);

        if (shouldLog.trace(this._debugMode)) {
            this._output.add('groupCollapsed', [MSG.TRACE()]).add('trace').add('groupEnd');
        }
    }

    end(resultState: unknown) {
        // Выводим разницу состояний
        this._stateUpdated('outer', this._initialState, resultState);

        // Выводим время выполнения всей сессии.
        if (this._sessionDurationTimer && shouldLog.time(this._debugMode)) {
            this._output.add('info', [MSG.DURATION(this._sessionDurationTimer.stop(), 'All')]);
        }

        this._output.add('groupEnd');

        this._initialState = undefined;
        this._sessionDurationTimer = undefined;
        this._dispatches.destroy();
    }

    startDispatch(action: TAbstractAction) {
        this._dispatches.push(action);
    }

    endDispatch(action: TAbstractAction) {
        this._dispatches.pop(action);
    }

    handleUserUpdateChanges(prevState: object, nextState: object) {
        this._stateUpdated('userUpdate', prevState, nextState);
    }

    innerSetState(prevState: object, nextState: object, senderName: string) {
        this._stateUpdated('inner', prevState, nextState, senderName);
    }

    immediateApplyState(prevState: object, nextState: object, senderName: string) {
        this._stateUpdated('immediate', prevState, nextState, senderName);
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

    destroy() {
        this._initialState = undefined;
        if (this._sessionDurationTimer) {
            this._sessionDurationTimer = undefined;
        }
        this._dispatches.destroy();
    }

    private _stateUpdated(
        type: 'immediate' | 'inner' | 'outer' | 'userUpdate',
        prevState: unknown,
        nextState: unknown,
        senderName?: string
    ) {
        if (!shouldLog[`${type}StateUpdated` as const](this._debugMode)) {
            return;
        }

        const { style } = this._output.getConfig();
        const changes = Session.getChanges(prevState, nextState);

        // Нет изменений при вызове обновления любого состояния, кроме результата всей сессии.
        // "Холостое" обновление внутреннего состояния всегда бесполезная трата ресурсов,
        // а незамедлительная установка в Slice - ошибка.
        // Состояние после всей цепочки действительно может не измениться, это вариант нормы.
        if (!changes.length && (type === 'inner' || type === 'immediate')) {
            this._output.add(
                'info',
                [
                    shouldLog.uselessUpdateInitiator(this._debugMode)
                        ? MSG.USELESS_STATE_UPDATE_DETAILED(type, senderName, style)
                        : MSG.USELESS_STATE_UPDATE(type, style),
                ],
                'error'
            );
            return;
        }

        switch (type) {
            case 'userUpdate': {
                this._output.add('groupCollapsed', [MSG.USER_UPDATE_CHANGES(style)], 'success');

                break;
            }
            case 'inner': {
                this._output.add(
                    'groupCollapsed',
                    [MSG.INNER_SLICE_STATE_UPDATE(style)],
                    'additionalSuccess'
                );
                break;
            }
            case 'immediate': {
                this._output.add(
                    'groupCollapsed',
                    [MSG.IMMEDIATE_SLICE_STATE_UPDATE(style)],
                    'success'
                );
                break;
            }
            case 'outer': {
                this._output.add(
                    'groupCollapsed',
                    [MSG.OUTER_SLICE_STATE_UPDATE(style)],
                    'success'
                );
                break;
            }
        }

        Session.showChanges(changes, this._output, style, type !== 'userUpdate');

        this._output.add('groupEnd');
    }

    static getChanges(prevState: unknown, nextState: unknown): IChange[] {
        return getChanges(prevState, nextState);
    }

    static showChanges(
        changes: IChange[],
        output: IOutput,
        style: TOutputStyle,
        showErrorIfEmpty: boolean = true
    ): void {
        showChanges(output, changes, style, showErrorIfEmpty);
    }
}
