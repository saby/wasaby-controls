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

/**
 * Действие инвертирования списка.
 * Для того чтобы связать действие со списком, задайте опцию storeId.
 * @control
 * @extends Controls/actions:BaseAction
 * @public
 * @demo Controls-demo/list_new/VirtualScroll/Invert/ReactList
 * @remark
 * Подробнее о настройке тулбара на странице читайте {@link /doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/toolbar-config/ здесь}.
 */
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
            initialOrder = slice.state.itemsOrder;
        }

        this._updateButton(initialOrder || 'default');
    }

    execute(): void {
        const newItemsOrder: TItemsOrder = this._currentOrder === 'reverse' ? 'default' : 'reverse';
        if (this._compatibleMode) {
            getStore().dispatch(STORE_EVENT_NAME, newItemsOrder);
        } else {
            this._getSlice().setItemsOrder(newItemsOrder);
        }

        if (this._options.propStorageId) {
            USER.set(this._options.propStorageId + '-itemsOrder', newItemsOrder);
        }
        this._updateButton(newItemsOrder);
    }

    updateContext(newContext: IInvertActionOptions['context']) {
        if (this._options.storeId) {
            const sliceOrder = this._getSlice().state.itemsOrder;
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
});
