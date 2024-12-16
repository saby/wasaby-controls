import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/StoreIdConnected/Index';
import { IColumn, IHeaderCell } from 'Controls/grid';
import 'Controls-ListEnv-demo/StoreIdConnected/listActions';
import 'Controls-ListEnv/actions';
import { IFilterItem } from 'Controls/filter';
import { getFlatList, getFilterDescription, getEditorsViewMode } from './Data';
import { RecordSet } from 'Types/collection';
import { HierarchicalMemory } from 'Types/source';
import * as filter from './DataFilter';
import { SessionStorage } from 'Browser/Storage';
import { connectToDataContext, IContextValue } from 'Controls/context';
import { query } from 'Application/Env';
import 'Controls-ListEnv-demo/StoreIdConnected/CopyUtils';
import 'css!Controls-ListEnv-demo/Filter/filter';

interface IOptions extends IControlOptions {
    _dataOptionsValue: IContextValue;
}
const COUNT_ITEMS = 5;

class LayoutWithFilter extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _toggleSelectedKey: string = 'notSelected';
    protected _toggleItems: RecordSet;
    protected _filterNames: string[];
    protected _filterViewNames: string[];
    protected _editorsViewMode: string;
    protected _multiSelect: boolean = true;
    protected _slice: any;
    protected _nomenclatureHeader: IHeaderCell[] = [
        { caption: 'Название' },
        { caption: 'Страна' },
        { caption: 'Тип' },
        { caption: 'Тип экрана' },
        { caption: 'Производитель' },
        { caption: 'Наличие' },
    ];
    protected _columns: IColumn[] = [
        { displayProperty: 'title', width: '150px' },
        { displayProperty: 'country' },
        { displayProperty: 'type' },
        { displayProperty: 'screenType' },
        { displayProperty: 'company' },
        { displayProperty: 'available' },
    ];

    protected _beforeMount(options: IOptions): void {
        this._slice = options._dataOptionsValue.nomenclature;
        this._editorsViewMode = getEditorsViewMode();
        this._toggleSelectedKey = this._editorsViewMode || 'notSelected';
        this._filterNames = this._getFilterNames(this._editorsViewMode);
        if (this._editorsViewMode === 'unrelatedFilters') {
            this._filterViewNames = ['inStock'];
        }
        this._toggleItems = new RecordSet({
            rawData: [
                {
                    id: 'cloud|default',
                    title: 'cloud|default',
                },
                {
                    id: 'popupCloudPanelDefault',
                    title: 'popupCloudPanelDefault',
                },
                {
                    id: 'cloud',
                    title: 'cloud',
                },
                {
                    id: 'default',
                    title: 'default',
                },
                {
                    id: 'notSelected',
                    title: 'Не задано',
                },
                {
                    id: 'unrelatedFilters',
                    title: 'unrelatedFilters',
                },
            ],
            keyProperty: 'id',
        });
        this._slice.setState({
            editorsViewMode: this._editorsViewMode,
        });
        SessionStorage.remove('editorsViewMode');
    }

    protected _getFilterNames(editorsViewMode: string): string[] {
        if (editorsViewMode === 'cloud') {
            return ['inStock', 'type'];
        }
        if (editorsViewMode === 'default' || !editorsViewMode) {
            return ['company', 'screenType', 'type'];
        }
        if (editorsViewMode === 'popupCloudPanelDefault') {
            this._multiSelect = false;
            return ['type', 'primaryCompany'];
        }
        return ['type'];
    }

    protected _handleSelectedKeyChanged(event: Event, selectedKey: string): void {
        SessionStorage.set('editorsViewMode', selectedKey);
        this._filterViewNames = null;
        // @ts-ignore
        window.reloadDemo();
    }

    protected _getActions(): string {
        return getActions();
    }
}

const getActions = function (): string {
    return query.get.showViewMode
        ? 'Controls-ListEnv-demo/StoreIdConnected/viewModeAction'
        : 'Controls-ListEnv-demo/StoreIdConnected/listActions';
};

const connectedDemo = connectToDataContext(LayoutWithFilter);
connectedDemo.getLoadConfig = (): Record<string, unknown> => {
    const editorsViewMode = getEditorsViewMode();
    const actions = getActions();
    return {
        nomenclature: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                source: new HierarchicalMemory({
                    keyProperty: 'id',
                    data: getFlatList(['США', 'Южная Корея', 'Тайвань'], COUNT_ITEMS),
                    parentProperty: 'parent',
                    filter,
                }),
                listActions: actions,
                actions,
                searchParam: 'title',
                displayProperty: 'title',
                multiSelectVisibility: 'onhover',
                keyProperty: 'id',
                viewMode: 'table',
                parentProperty: 'parent',
                nodeProperty: 'node',
                editorsViewMode,
                filterDescription: getFilterDescription(editorsViewMode) as IFilterItem[],
            },
        },
    };
};
export default connectedDemo;
