/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
// @ts-ignore
import * as template from 'wml!Controls/_listDataOld/listContainer/Container';
import { IContextOptionsValue, connectToDataContext } from 'Controls/context';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IListState, ListSlice } from 'Controls/dataFactory';
import { isEqual } from 'Types/object';

const DATA_SYNTHETIC_STORE_ID = '_dataSyntheticStoreId';

export interface IListContainerOptions extends IControlOptions {
    id: string;
    _dataOptionsValue: IContextOptionsValue;
    dataContextCompatibleValue?: ListSlice;
}

class ListContainer extends Control<IListContainerOptions> {
    protected _template: TemplateFunction = template;
    protected _dataOptions: IContextOptionsValue | IListState;
    protected _compatibleOptions: Partial<IListState>;

    protected _beforeMount(options: IListContainerOptions): void {
        this._dataOptions = ListContainer._getListOptions(options);
        this._compatibleOptions = this._getCompatibleContextOptions(options);
    }

    protected _beforeUpdate(options: IListContainerOptions): void {
        this._dataOptions = ListContainer._getListOptions(options);
        const compatibleOptions = this._getCompatibleContextOptions(options);

        if (!isEqual(this._compatibleOptions, compatibleOptions)) {
            this._compatibleOptions = compatibleOptions;
        }
    }

    protected _notifyEventWithBubbling(e: SyntheticEvent, eventName: string): unknown {
        const eventArgs = Array.prototype.slice.call(arguments, 2);

        if (this._options.id) {
            eventArgs.push(this._options.id);
        }
        if (!e.isBubbling()) {
            e.stopPropagation();
        }
        return this._notify(eventName, eventArgs, { bubbling: true });
    }

    private _getCompatibleContextOptions(options): Partial<IListState> {
        const dataOptions = this._dataOptions || {};
        let compatibleContextOptions = {};

        if (options.dataContextCompatibleValue) {
            compatibleContextOptions = {
                expandedItems: dataOptions.expandedItems,
                selectedKeys: dataOptions.selectedKeys,
                excludedKeys: dataOptions.excludedKeys,
                nodeProperty: dataOptions.nodeProperty,
                multiSelectVisibility: dataOptions.multiSelectVisibility,
                viewMode: dataOptions.viewMode,
                loading: dataOptions.loading,
            };
        }
        return {
            groupProperty: dataOptions.groupProperty || options.groupProperty,
            expandedItems: options.nodeHistoryId
                ? dataOptions.expandedItems
                : options.expandedItems,
            selectedKeys: options.id ? dataOptions.selectedKeys : options.selectedKeys,
            excludedKeys: options.id ? dataOptions.excludedKeys : options.excludedKeys,
            parentProperty: dataOptions.parentProperty || options.parentProperty,
            nodeProperty:
                dataOptions.nodeProperty !== undefined
                    ? dataOptions.nodeProperty
                    : options.nodeProperty,
            dragControlId: dataOptions.dragControlId || options.dragControlId,
            viewMode: options.viewMode,
            multiSelectVisibility: options.multiSelectVisibility,
            loading: options.loading,
            ...compatibleContextOptions,
        };
    }

    private static _getListOptions(options: IListContainerOptions): IContextOptionsValue {
        let listOptions;

        if (options.dataContextCompatibleValue) {
            listOptions = options.dataContextCompatibleValue;
        } else if (options.id) {
            const dataOptions = options._dataOptionsValue;
            listOptions = dataOptions.listsConfigs[options.id];
            if (listOptions) {
                listOptions.selectedKeys = dataOptions.listsSelectedKeys?.[options.id];
                listOptions.excludedKeys = dataOptions.listsExcludedKeys?.[options.id];
            }
        } else if (options.storeId) {
            listOptions = options._dataOptionsValue[options.storeId].state;
        } else {
            listOptions =
                options._dataOptionsValue?.[DATA_SYNTHETIC_STORE_ID]?.state ||
                options._dataOptionsValue;
        }

        return listOptions;
    }

    static displayName = 'Controls/_listDataOld/listContainer/Container';
}

export default connectToDataContext(ListContainer);
