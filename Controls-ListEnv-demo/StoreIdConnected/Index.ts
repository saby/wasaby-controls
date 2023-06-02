import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/StoreIdConnected/Index';
import { IColumn, IHeaderCell } from 'Controls/grid';
import 'Controls-ListEnv-demo/StoreIdConnected/listActions';
import { IFilterItem } from 'Controls/filter';
import { getFlatList, getFilterDescription } from './Data';
import { RecordSet } from 'Types/collection';
import { HierarchicalMemory } from 'Types/source';
import * as filter from './DataFilter';
import 'css!Controls-ListEnv-demo/Filter/filter';

const COUNT_ITEMS = 5;

export default class LayoutWithFilter extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _toggleSelectedKey: string = 'notSelected';
    protected _toggleItems: RecordSet;
    protected _filterNames: string[];
    protected _filterViewNames: string[];
    protected _editorsViewMode: string;
    protected _multiSelect: boolean = true;
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

    protected _beforeMount(): void {
        this._editorsViewMode = this._getEditorsViewMode();
        this._toggleSelectedKey = this._editorsViewMode || 'undefined';
        this._filterNames = this._getFilterNames(this._editorsViewMode);
        if (this._editorsViewMode === 'unrelatedFilters') {
            this._filterViewNames = ['inStock'];
        }
        this._toggleItems = new RecordSet({
            rawData: [
                {
                    id: 'notSelected',
                    title: 'Не задано',
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
                    id: 'unrelatedFilters',
                    title: 'unrelatedFilters',
                },
            ],
            keyProperty: 'id',
        });
        sessionStorage.clear();
    }

    protected _getEditorsViewMode(): string {
        const savedValue = sessionStorage.getItem('editorsViewMode');
        if (!savedValue || savedValue === 'notSelected') {
            return undefined;
        }
        return savedValue;
    }

    protected _getFilterNames(editorsViewMode: string): string[] {
        if (editorsViewMode === 'cloud') {
            return ['inStock', 'type'];
        }
        if (editorsViewMode === 'default') {
            return ['company', 'screenType', 'type'];
        }
        if (editorsViewMode === 'popupCloudPanelDefault') {
            this._multiSelect = false;
            return ['type', 'primaryCompany'];
        }
        if (editorsViewMode === undefined) {
            return ['type'];
        }
        if (editorsViewMode === 'unrelatedFilters') {
            return ['type'];
        }
    }

    protected _handleSelectedKeyChanged(
        event: Event,
        selectedKey: string
    ): void {
        sessionStorage.setItem('editorsViewMode', selectedKey);
        this._filterViewNames = null;
        // @ts-ignore
        window.reloadDemo();
    }

    static getLoadConfig(): unknown {
        return {
            nomenclature: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        data: getFlatList(
                            ['США', 'Южная Корея', 'Тайвань'],
                            COUNT_ITEMS
                        ),
                        parentProperty: 'parent',
                        filter,
                    }),
                    listActions:
                        'Controls-ListEnv-demo/StoreIdConnected/listActions',
                    actions: 'Controls-ListEnv-demo/StoreIdConnected/listActions',
                    searchParam: 'title',
                    displayProperty: 'title',
                    multiSelectVisibility: 'onhover',
                    keyProperty: 'id',
                    viewMode: 'table',
                    parentProperty: 'parent',
                    nodeProperty: 'node',
                    filterDescription: getFilterDescription() as IFilterItem[],
                },
            },
        };
    }
}
