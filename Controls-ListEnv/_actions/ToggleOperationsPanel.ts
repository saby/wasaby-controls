import { BaseAction, IActionOptions } from 'Controls/actions';
import * as rk from 'i18n!Controls';
import { ListSlice } from 'Controls/dataFactory';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { TStoreImport } from 'Controls/interface';

export interface IToggleOperationsPanelAction extends IActionOptions {
    storeId: string;
}

const getStore = () => {
    return loadSync<TStoreImport>('Controls/Store');
};

export default class ToggleOperationsPanelAction extends BaseAction<IToggleOperationsPanelAction> {
    protected _visibleChangedId: string = null;
    protected _compatibleMode: boolean;
    protected _storeCtxCallbackId: string;

    constructor(options: IToggleOperationsPanelAction) {
        super(options);
        this._compatibleMode = !options.storeId;
        this._validateOptions(options);
        let operationsPanelVisible = false;
        this._updateState = this._updateState.bind(this);
        if (this._compatibleMode) {
            const compatibleStore = getStore();
            operationsPanelVisible = compatibleStore.get('operationsPanelExpanded');
            this._visibleChangedId = compatibleStore.onPropertyChanged(
                'operationsPanelExpanded',
                this._updateState
            );
            this._storeCtxCallbackId = compatibleStore.onPropertyChanged(
                '_contextName',
                () => {
                    compatibleStore.unsubscribe(this._visibleChangedId);
                    this._visibleChangedId = compatibleStore.onPropertyChanged(
                        'operationsPanelExpanded',
                        this._updateState
                    );
                },
                true
            );
        } else {
            const slice = this._options.context?.[options.storeId] as ListSlice;
            operationsPanelVisible =
                !!slice.state.listActions?.length && !!slice.state.operationsPanelVisible;
        }
        this._updateState(operationsPanelVisible);
    }

    updateContext(newContext: Record<string, unknown>): void {
        if (this._options.storeId) {
            const slice = newContext[this._options.storeId] as ListSlice;
            const operationsPanelVisible =
                !!slice.state.listActions?.length && !!slice.state.operationsPanelVisible;
            this._updateState(operationsPanelVisible);
        }
    }

    protected _validateOptions(options: IToggleOperationsPanelAction): void {
        if (options.storeId) {
            const slice = options.context[options.storeId] as ListSlice;
            if (!slice) {
                throw new Error(
                    `ToggleOperationsPanelAction::Указан неверный storeId ${options.storeId}`
                );
            } else if (!slice['[IListSlice]']) {
                throw new Error(
                    `ToggleOperationsPanelAction::Слайс ${options.storeId} должен быть наследником cлайса списка`
                );
            } else if (!slice.state.listActions && !slice.state.operationsController) {
                throw new Error(
                    `ToggleOperationsPanelAction::В слайсе ${options.storeId} не указаны экшены списка`
                );
            }
        }
    }

    execute(): void {
        const operationsPanelVisible = !this._getOperationsPanelVisible();
        if (this._compatibleMode) {
            getStore().dispatch('operationsPanelExpanded', operationsPanelVisible);
        } else {
            const slice = this._options.context[this._options.storeId] as ListSlice;
            if (operationsPanelVisible) {
                slice.openOperationsPanel();
            } else {
                slice.closeOperationsPanel();
            }
        }
        this._updateState(operationsPanelVisible);
    }

    protected _updateState(operationsPanelVisible: boolean): void {
        this.title = operationsPanelVisible ? rk('Завершить выделение') : rk('Отметить');
        this.tooltip = this.title;
        this.icon = operationsPanelVisible
            ? 'Controls-icons/actions:icon-CloseCheck'
            : 'icon-Check2';
    }

    destroy(): void {
        if (this._visibleChangedId) {
            getStore().unsubscribe(this._visibleChangedId);
        }
        if (this._storeCtxCallbackId) {
            getStore().unsubscribe(this._storeCtxCallbackId);
        }
    }

    private _getOperationsPanelVisible(): boolean {
        if (this._compatibleMode) {
            return getStore().get('operationsPanelExpanded');
        } else {
            const slice = this._options.context[this._options.storeId] as ListSlice;
            return slice.state.operationsPanelVisible;
        }
    }
}

Object.assign(ToggleOperationsPanelAction.prototype, {
    id: 'toggleOperationsPanel',
    icon: 'icon-Check2',
    tooltip: rk('Отметить'),
    title: rk('Отметить'),
});
