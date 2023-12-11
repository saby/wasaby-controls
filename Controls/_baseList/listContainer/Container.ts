/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
// @ts-ignore
import * as template from 'wml!Controls/_baseList/listContainer/Container';
import { IContextOptionsValue, connectToDataContext } from 'Controls/context';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IListState, ListSlice } from 'Controls/dataFactory';
import { isEqual } from 'Types/object';
import { DATA_SYNTHETIC_STORE_ID } from 'Controls/_baseList/Data/Controller';

export interface IListContainerOptions extends IControlOptions {
    id: string;
    _dataOptionsValue: IContextOptionsValue;
    dataContextCompatibleValue?: ListSlice;
}

/**
 * Контрол-контейнер для списка. Передает опции из контекста в список.
 *
 * @remark
 * Контейнер ожидает поле контекста "dataOptions", которое поставляет Controls/list:DataContainer.
 * Из поля контекста "dataOptions" контейнер передает в список следующие опции: <a href="/docs/js/Controls/list/View/options/filter/">filter</a>, <a href="/docs/js/Controls/list/View/options/navigation/">navigation</a>, <a href="/docs/js/Controls/list/View/options/sorting/">sorting</a>, <a href="/docs/js/Controls/list/View/options/keyProperty/">keyProperty</a>, <a href="/docs/js/Controls/list/View/options/source/">source</a>, sourceController.
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter-and-search/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_list.less переменные тем оформления}
 * * {@link Controls/list:DataContainer}
 *
 * @class Controls/_list/Container
 * @extends UI/Base:Control
 * @public
 */
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

    static displayName = 'Controls/_baseList/listContainer/Container';
}

export default connectToDataContext<ListContainer>(ListContainer);
