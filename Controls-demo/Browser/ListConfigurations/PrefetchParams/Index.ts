import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import * as controlTemplate from 'wml!Controls-demo/Browser/ListConfigurations/PrefetchParams/Index';
import { Memory } from 'Types/source';
import { IFilterItem } from 'Controls/filter';
import * as memorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';
import PrefetchSource from 'Controls-demo/Browser/ListConfigurations/PrefetchParams/PrefetchSource';
import 'css!Controls-demo/Browser/ListConfigurations/ListConfigurations';
import 'Controls-demo/Browser/ListConfigurations/PrefetchParams/HistorySourceDemo';

class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _listConfigurations: any;
    protected _prefetchParams: object = {
        PrefetchSessionLiveTime: 'P30DT0H0M0S',
    };

    protected _firstListSource: PrefetchSource = new PrefetchSource({
        id: 'firstList',
        keyProperty: 'key',
        data: [
            {
                id: 0,
                title: 'Sasha',
            },
            {
                id: 1,
                title: 'Sergey',
            },
            {
                id: 2,
                title: 'Dmitry',
            },
        ],
        filter: (item, query) => {
            return (
                !query.title ||
                item
                    .get('title')
                    .toLowerCase()
                    .includes(query.title.toLowerCase())
            );
        },
    });

    protected _secondListSource: PrefetchSource = new PrefetchSource({
        id: 'secondList',
        keyProperty: 'key',
        data: [
            {
                id: 3,
                title: 'Yaroslavl',
            },
            {
                id: 4,
                title: 'Moscow',
            },
            {
                id: 5,
                title: 'Kostroma',
            },
        ],
        filter: (item, query) => {
            const isSearched =
                !query.title ||
                item
                    .get('title')
                    .toLowerCase()
                    .includes(query.title.toLowerCase());
            const isCity =
                !query.city ||
                !query.city.length ||
                query.city.includes(item.get('title'));
            return isSearched && isCity;
        },
    });

    protected _thirdListSource: Memory = new Memory({
        keyProperty: 'key',
        data: [
            {
                id: 6,
                title: 'Development',
            },
            {
                id: 7,
                title: 'Promotion',
            },
            {
                id: 8,
                title: 'Support',
            },
        ],
        filter: memorySourceFilter('title'),
    });
    protected _filterSource: IFilterItem = [
        {
            name: 'city',
            value: [],
            resetValue: [],
            caption: 'Город',
            textValue: '',
            editorTemplateName: 'Controls/filterPanel:DropdownEditor',
            editorOptions: {
                emptyText: 'Все города',
                source: new Memory({
                    keyProperty: 'id',
                    data: [
                        { id: 'Yaroslavl', title: 'Yaroslavl' },
                        { id: 'Moscow', title: 'Moscow' },
                        { id: 'Kostroma', title: 'Kostroma' },
                    ],
                }),
                displayProperty: 'title',
                keyProperty: 'id',
            },
            viewMode: 'basic',
        },
    ];

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._listConfigurations = this._getListConfigurations();
    }

    protected _filterChanged(
        event: SyntheticEvent,
        filter: object,
        listId: string
    ): void {
        this._listConfigurations = [...this._listConfigurations];
        this._getListConfig(listId).filter = filter;
    }

    private _getListConfigurations(): object {
        return [
            {
                id: 'firstList',
                source: this._firstListSource,
                keyProperty: 'id',
                searchParam: 'title',
                prefetchParams: this._prefetchParams,
                historyId: 'demo_history_prefetch',
                filterButtonSource: this._filterSource,
            },
            {
                id: 'secondList',
                source: this._secondListSource,
                keyProperty: 'id',
                searchParam: 'title',
                prefetchParams: this._prefetchParams,
                historyId: 'demo_history_prefetch',
                filterButtonSource: this._filterSource,
            },
            {
                id: 'thirdList',
                source: this._thirdListSource,
                keyProperty: 'id',
                searchParam: 'title',
            },
        ];
    }

    private _getListConfig(listId: string = 'firstList'): object {
        return this._listConfigurations.find(({ id }) => {
            return id === listId;
        });
    }
}

export default Demo;
