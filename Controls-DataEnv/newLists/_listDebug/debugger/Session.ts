import { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { TListActions } from 'Controls-DataEnv/list';
import { getSender, PUBLIC_API_SENDER_NAME } from './utils/patchAction';
import { showChanges } from './utils/showChanges';
import { IOutput } from './output/IOutput';
import { getChanges } from './utils/getChanges';
import * as MSG from './MessageDescriptors';

const COMPLEX_UPDATE_ACTION_TYPE: TListActions.complexUpdate.TBeforeApplyStateAction['type'] =
    'beforeApplyState';

export class Session {
    readonly name: string;
    private readonly _output: IOutput;

    private _initialState?: unknown;

    private _timeStamps?: {
        start: number;
        end: number;
    };

    constructor(name: string, output: IOutput) {
        this.name = name;
        this._output = output;
    }

    start(initialState: unknown) {
        this._initialState = initialState;

        this._timeStamps = {
            start: performance.now(),
            end: 0,
        };

        this._output
            .add('groupCollapsed', [MSG.START_UPDATE_SESSION(this.name)])
            .add('groupCollapsed', ['trace'])
            .add('trace')
            .add('groupEnd');
    }

    end(resultState: unknown) {
        // Останавливаем подсчет времени до высчитывания разницы состояний.
        if (this._timeStamps) {
            this._timeStamps.end = performance.now();
        }

        // Выводим разницу состояний
        this._stateUpdated('outer', this._initialState, resultState);

        // Выводим время выполнения всей сессии.
        if (this._timeStamps) {
            this._timeStamps.end = performance.now();
            this._output.add('info', [
                MSG.DISPATCH_DURATION(this._timeStamps.end - this._timeStamps.start),
            ]);
        }

        this._initialState = undefined;
        this._timeStamps = undefined;
    }

    startDispatch(action: TAbstractAction) {
        const sender = getSender(action);

        if (sender === PUBLIC_API_SENDER_NAME) {
            this._output.add('group', [MSG.FIRST_ACTION_INFO(action.type)]);
        } else {
            this._output.add('group', [MSG.ACTION_INFO(action.type, sender)]);
        }

        if (action.type === COMPLEX_UPDATE_ACTION_TYPE) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const changes = getChanges(this._initialState, action.payload.nextState);

            this._output.add('groupCollapsed', [MSG.COMPLEX_UPDATE_CHANGES()], 'success');
            showChanges(this._output, changes);
            this._output.add('groupEnd');
        }
    }

    endDispatch(_action: TAbstractAction) {
        this._output.add('groupEnd');
    }

    innerSetState(prevState: object, nextState: object, _partialState: object) {
        this._stateUpdated('inner', prevState, nextState);
    }

    immediateApplyState(prevState: object, nextState: object, _partialState: object) {
        this._stateUpdated('immediate', prevState, nextState);
    }

    private _stateUpdated(
        type: 'immediate' | 'inner' | 'outer',
        prevState: unknown,
        nextState: unknown
    ) {
        const changes = getChanges(prevState, nextState);

        // Нет изменений при вызове обновления любого состояния, кроме результата всей сессии.
        // "Холостое" обновление внутреннего состояния всегда бесполезная трата ресурсов,
        // а незамедлительная установка в Slice - ошибка.
        // Состояние после всей цепочки действительно может не измениться, это вариант нормы.
        if (!changes.length && type !== 'outer') {
            this._output.add('info', [MSG.USELESS_STATE_UPDATE(type)], 'error');
            return;
        }

        if (type === 'inner') {
            this._output.add(
                'groupCollapsed',
                [MSG.INNER_SLICE_STATE_UPDATE()],
                'additionalSuccess'
            );
        } else if (type === 'immediate') {
            this._output.add('groupCollapsed', [MSG.IMMEDIATE_SLICE_STATE_UPDATE()], 'success');
        } else {
            this._output.add('groupCollapsed', [MSG.OUTER_SLICE_STATE_UPDATE()], 'success');
        }

        showChanges(this._output, changes);

        this._output.add('groupEnd');
    }
}
