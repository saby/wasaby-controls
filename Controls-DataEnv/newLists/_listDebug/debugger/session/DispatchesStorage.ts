import { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import { Dispatch, IDispatchMeta } from './Dispatch';
import { logger } from 'Application/Env';

export interface IDispatchesMeta extends IDispatchMeta {
    children: IDispatchesMeta[];
}

export class DispatchesStorage {
    private _rootDispatches: Dispatch[] = [];
    private _currentDispatch?: Dispatch;
    private _dispatches: Dispatch[] = [];

    private _meta: IDispatchesMeta[] = [];

    push(action: TAbstractAction, phaseId?: string): Dispatch {
        const currentPhaseId = this._currentDispatch
            ? this._currentDispatch.getMeta().phaseId || phaseId
            : phaseId;

        if (typeof phaseId !== 'undefined' && currentPhaseId !== phaseId) {
            logger.warn(
                'Фаза данного распространения отличается от фазы родителя.\n' +
                    'Это неверная конфигурация, т.к. фаза ждет распространения, а распространение - детей.\n' +
                    'Поэтому вложенное распространение ВСЕГДА принадлежит той же фазе, что и родитель.\n'
            );
        }

        const newDispatch = new Dispatch(this._currentDispatch, currentPhaseId);
        newDispatch.start(action);

        // _currentDispatch будет определен, если мы начинаем распространение
        // внутри другого распространения.
        // В противном случае - ничего не распространяется, запишем
        // новое распространение в корневые.
        if (!this._currentDispatch) {
            this._rootDispatches.push(newDispatch);
        }

        this._currentDispatch = newDispatch;

        this._dispatches.push(newDispatch);
        this._updateMeta();
        return newDispatch;
    }

    pop() {
        const dispatch = this._dispatches.pop();
        if (dispatch) {
            dispatch.end();
            this._currentDispatch = this._currentDispatch?.getParent();
        }
        this._updateMeta();
    }

    getCurrentDispatch() {
        return this._currentDispatch;
    }

    getMeta(): IDispatchesMeta[] {
        return this._meta;
    }

    destroy() {
        this._dispatches.forEach((d) => {
            d.destroy();
        });
        this._dispatches = [];
        this._meta = [];
    }

    private _updateMeta() {
        const fill = (items: Dispatch[]): IDispatchesMeta[] =>
            items.map((i) => ({
                ...i.getMeta(),
                children: fill(i.getChildren()),
            }));
        this._meta = fill(this._rootDispatches);
    }
}

export default DispatchesStorage;
