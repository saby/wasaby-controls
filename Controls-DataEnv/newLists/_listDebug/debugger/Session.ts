/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { TListActions } from 'Controls-DataEnv/list';
import type { TDebugMode } from './types/TDebugMode';
import type { IOutput } from './output/IOutput';
import * as MSG from './MessageDescriptors';
import * as shouldLog from './utils/shouldLog';
import { getSender, PUBLIC_API_SENDER_NAME } from './utils/patchAction';
import { showChanges } from './utils/showChanges';
import { getChanges } from './utils/getChanges';

const COMPLEX_UPDATE_ACTION_TYPE: TListActions.complexUpdate.TBeforeApplyStateAction['type'] =
    'beforeApplyState';

export class Session {
    private readonly _id: string;
    private readonly _output: IOutput;
    private readonly _debugMode: TDebugMode;

    private _initialState?: unknown;

    private _timeStamps?: {
        start: number;
        end: number;
    };

    constructor(id: string, output: IOutput, debugMode: TDebugMode) {
        this._id = id;
        this._output = output;
        this._debugMode = debugMode;
    }

    start(initialState: unknown) {
        this._initialState = initialState;

        this._timeStamps = {
            start: performance.now(),
            end: 0,
        };

        this._output.add('groupCollapsed', [
            MSG.START_UPDATE_SESSION(this._id, this._output.getConfig().style),
        ]);

        if (shouldLog.trace(this._debugMode)) {
            this._output.add('groupCollapsed', [MSG.TRACE()]).add('trace').add('groupEnd');
        }
    }

    end(resultState: unknown) {
        // Останавливаем подсчет времени до высчитывания разницы состояний.
        if (this._timeStamps) {
            this._timeStamps.end = performance.now();
        }

        // Выводим разницу состояний
        this._stateUpdated('outer', this._initialState, resultState);

        if (shouldLog.time(this._debugMode)) {
            // Выводим время выполнения всей сессии.
            if (this._timeStamps) {
                this._timeStamps.end = performance.now();
                this._output.add('info', [
                    MSG.DISPATCH_DURATION(
                        this._timeStamps.end - this._timeStamps.start,
                        this._output.getConfig().style
                    ),
                ]);
            }
        }

        this._output.add('groupEnd');

        this._initialState = undefined;
        this._timeStamps = undefined;
    }

    startDispatch(action: TAbstractAction) {
        if (shouldLog.action(this._debugMode)) {
            const { style } = this._output.getConfig();
            const sender = getSender(action);

            if (sender === PUBLIC_API_SENDER_NAME) {
                this._output.add('group', [MSG.FIRST_ACTION_INFO(action.type, style)]);
            } else {
                this._output.add('group', [MSG.ACTION_INFO(action.type, sender, style)]);
            }
        }

        if (action.type === COMPLEX_UPDATE_ACTION_TYPE) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const nextState = action.payload.nextState as unknown;
            this._stateUpdated('passed', this._initialState, nextState);
        }
    }

    endDispatch(_action: TAbstractAction) {
        if (shouldLog.action(this._debugMode)) {
            this._output.add('groupEnd');
        }
    }

    innerSetState(prevState: object, nextState: object, senderName: string) {
        this._stateUpdated('inner', prevState, nextState, senderName);
    }

    immediateApplyState(prevState: object, nextState: object, senderName: string) {
        this._stateUpdated('immediate', prevState, nextState, senderName);
    }

    destroy() {
        this._initialState = undefined;
        this._timeStamps = undefined;
    }

    private _stateUpdated(
        type: 'immediate' | 'inner' | 'outer' | 'passed',
        prevState: unknown,
        nextState: unknown,
        senderName?: string
    ) {
        if (!shouldLog[`${type}StateUpdated` as const](this._debugMode)) {
            return;
        }

        const { style } = this._output.getConfig();
        const changes = getChanges(prevState, nextState);

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
            case 'passed': {
                this._output.add('groupCollapsed', [MSG.COMPLEX_UPDATE_CHANGES(style)], 'success');

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

        showChanges(this._output, changes, style);

        this._output.add('groupEnd');
    }
}
