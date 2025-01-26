import { Control, TemplateFunction } from 'UI/Base';
import * as MemorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';
import * as SearchMemory from 'Controls-demo/Search/SearchMemory';
import { Memory } from 'Types/source';
import { _departmentsWithCompanies } from 'Controls-demo/Suggest_new/DemoHelpers/DataCatalog';
import controlTemplate = require('wml!Controls-demo/Suggest_new/Input/SuggestTemplateWithTabs/SuggestTemplateWithTabs');
import suggestTemplate = require('wml!Controls-demo/Suggest_new/Input/SuggestTemplateWithTabs/resources/SuggestTabTemplate');

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _suggestTemplate: TemplateFunction = suggestTemplate;
    protected _source: Memory;
    protected _navigation: object;
    protected _suggestListsOptions: object;
    protected _suggestListsOptionsOneTab: object;
    protected _beforeMount(): void {
        this._source = new SearchMemory({
            keyProperty: 'id',
            data: _departmentsWithCompanies,
            searchParam: 'title',
            filter: MemorySourceFilter(),
        });
        this._navigation = {
            source: 'page',
            view: 'page',
            sourceConfig: {
                pageSize: 2,
                page: 0,
                hasMore: false,
            },
        };

        const source2 = new SearchMemory({
            keyProperty: 'id',
            data: [
                {
                    currentTab: 2,
                    id: 1,
                    title: 'Наша компания',
                },
                {
                    currentTab: 2,
                    id: 2,
                    title: '"Компания "Тензор" ООО',
                },
                {
                    currentTab: 2,
                    id: 3,
                    title: 'Все юридические лица',
                },
            ],
            searchParam: 'title',
            filter: MemorySourceFilter(),
        });

        this._suggestListsOptions = {
            1: {
                order: 1,
                caption: 'Контрагенты',
                id: '1',
                source: this._source,
                navigation: this._navigation,
            },
            2: {
                order: 0,
                caption: 'Компании',
                id: '2',
                source: source2,
                navigation: this._navigation,
            },
        };

        this._suggestListsOptionsOneTab = {
            1: {
                order: 0,
                caption: 'Контрагенты',
                id: '1',
                source: this._source,
                navigation: this._navigation,
            },
        };
    }
}
