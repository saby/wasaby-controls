import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/SuggestSearchInput/InBrowser/Index';
import { Memory } from 'Types/source';
import { IFilterItem } from 'Controls/filter';
import SearchMemory from './resources/SearchMemory';
import * as MemorySourceFilter from 'Controls-ListEnv-demo/FilterPanel/View/Editors/LookupEditor/resources/MemorySourceFilter';
import {
    listData,
    namesFilterData,
    cityFilterData,
} from 'Controls-ListEnv-demo/Filter/resources/Data';
import 'css!Controls-ListEnv-demo/SuggestSearchInput/InBrowser/Index';

export default class WidgetWrapper extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;
    protected _listSource: Memory = null;
    protected _filterSource: IFilterItem[] = null;
    protected _filters: string[] = ['name', 'city'];
    protected _personsSource: Memory;
    protected _locationSource: Memory;

    protected _beforeMount(): void | Promise<void> {
        this._listSource = new Memory({
            data: listData,
            keyProperty: 'id',
            filter: (item, queryFilter) => {
                let addToData = true;
                for (const filterField in queryFilter) {
                    if (
                        queryFilter.hasOwnProperty(filterField) &&
                        item.get(filterField) &&
                        addToData
                    ) {
                        const filterValue = queryFilter[filterField];
                        const itemValue = item.get(filterField);
                        if (filterValue instanceof Array) {
                            addToData = !filterValue[0] || filterValue.includes(itemValue);
                        } else {
                            addToData = !filterValue || filterValue === itemValue;
                        }
                    }
                }
                return addToData;
            },
        });

        this._personsSource = new SearchMemory({
            keyProperty: 'id',
            data: this._getSuggestData('person'),
            filter: MemorySourceFilter(),
        });

        this._locationSource = new SearchMemory({
            keyProperty: 'id',
            data: this._getSuggestData('location'),
            filter: MemorySourceFilter(),
        });

        this._filterSource = [
            {
                type: 'list',
                name: 'name',
                id: 'name',
                group: 'Имя',
                caption: 'Сотрудники',
                value: [],
                resetValue: [],
                viewMode: 'basic',
                textValue: '',
                editorTemplateName: 'Controls/filterPanelEditors:Lookup',
                editorOptions: {
                    multiSelect: true,
                    keyProperty: 'id',
                    displayProperty: 'title',
                    source: this._personsSource,
                },
            },
            {
                type: 'list',
                name: 'city',
                id: 'city',
                group: 'Город',
                caption: 'Города',
                value: [],
                resetValue: [],
                viewMode: 'basic',
                textValue: '',
                editorTemplateName: 'Controls/filterPanelEditors:Lookup',
                editorOptions: {
                    multiSelect: true,
                    keyProperty: 'id',
                    displayProperty: 'title',
                    source: this._locationSource,
                },
            },
        ] as IFilterItem[];
    }

    private _getSuggestData(type: 'person' | 'location'): object[] {
        const items = [];
        if (type === 'person') {
            namesFilterData.forEach(({ name }) => {
                items.push({
                    id: name,
                    title: name,
                    currentTab: 'name',
                });
            });
        }
        if (type === 'location') {
            cityFilterData.forEach(({ city }) => {
                items.push({
                    id: city,
                    title: city,
                    currentTab: 'city',
                });
            });
        }
        return items;
    }
}
