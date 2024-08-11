import * as rk from 'i18n!Controls';
import { RecordSet } from 'Types/collection';
import { TItemsOrder, TStoreImport } from 'Controls/interface';
import {
    BaseAction,
    IActionOptions,
    IActionExecuteParams,
    IListActionOptions,
} from 'Controls/actions';

import type { ListSlice } from 'Controls/dataFactory';
import { USER } from 'ParametersWebAPI/Scope';
import { loadSync } from 'WasabyLoader/ModulesLoader';

export interface IInvertActionOptions extends IActionOptions {
    propStorageId?: string;
    storeId?: string;
}

const getStore = () => {
    return loadSync<TStoreImport>('Controls/Store');
};

const STORE_EVENT_NAME = 'itemsOrderChanged';

export default class Invert extends BaseAction<IInvertActionOptions, IActionExecuteParams> {
    private _currentOrder: TItemsOrder;
    private _items: RecordSet = null;
    protected _compatibleMode: boolean;
    protected _itemsOrderChangedId: string;
    protected _storeCtxCallbackId: string;

    constructor(options: IInvertActionOptions) {
        super(options);
        this._items = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: 'default',
                    tooltip: rk('Инвертировать'),
                    icon: 'Controls/sortIcons:date_ASC',
                },
                {
                    id: 'reverse',
                    tooltip: rk('По умолчанию'),
                    icon: 'Controls/sortIcons:date_DESC',
                },
            ],
        });
        this._compatibleMode = !options.storeId;

        this._validateOptions(options);
        let initialOrder: TItemsOrder;
        if (this._compatibleMode) {
            const compatibleStore = getStore();
            this._itemsOrderChangedId = compatibleStore.onPropertyChanged(
                STORE_EVENT_NAME,
                this._updateButton.bind(this)
            );
            this._storeCtxCallbackId = compatibleStore.onPropertyChanged(
                '_contextName',
                () => {
                    compatibleStore.unsubscribe(this._itemsOrderChangedId);
                    this._itemsOrderChangedId = compatibleStore.onPropertyChanged(
                        STORE_EVENT_NAME,
                        this._updateButton.bind(this)
                    );
                },
                true
            );
            initialOrder = compatibleStore.get(STORE_EVENT_NAME);
        } else {
            const slice = this._getSlice();
            initialOrder = slice.state.order;
        }

        this._updateButton(initialOrder || 'default');
    }

    execute(): void {
        const newOrder: TItemsOrder =
            this._getCurrentGlobalOrder() === 'reverse' ? 'default' : 'reverse';
        if (this._compatibleMode) {
            getStore().dispatch(STORE_EVENT_NAME, newOrder);
        } else {
            this._getSlice().setOrder(newOrder);
        }

        if (this._options.propStorageId) {
            USER.set(this._options.propStorageId + '-order', newOrder);
        }
        this._updateButton(newOrder);
    }

    updateContext(newContext: IInvertActionOptions['context']) {
        if (this._options.storeId) {
            const sliceOrder = this._getSlice().state.order;
            if (sliceOrder && this._currentOrder !== sliceOrder) {
                super.updateContext(newContext);
                this._updateButton(sliceOrder);
            }
        }
    }

    protected _getSlice(): ListSlice {
        return this._options.context[this._options.storeId] as ListSlice;
    }

    protected _validateOptions(options: IListActionOptions): void {
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

    private _getCurrentGlobalOrder(): TItemsOrder {
        if (this._compatibleMode) {
            return getStore().get(STORE_EVENT_NAME);
        } else {
            return this._getSlice().state.order;
        }
    }

    private _updateButton(order: TItemsOrder) {
        let item = this._items.getRecordById(order);
        if (!item) {
            item = this._items.getRecordById('default');
        }

        this._currentOrder = order;
        this.icon = item.get('icon');
        this.tooltip = item.get('tooltip');
    }

    destroy() {
        super.destroy();

        if (this._itemsOrderChangedId) {
            getStore().unsubscribe(this._itemsOrderChangedId);
        }
        if (this._storeCtxCallbackId) {
            getStore().unsubscribe(this._storeCtxCallbackId);
        }
    }
}

Object.assign(Invert.prototype, {
    iconStyle: 'secondary',
    propStorageId: 'itemsOrder',
});
