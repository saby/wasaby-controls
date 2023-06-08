import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Filter_new/FilterView/Frequent/Hierarchy/Index';
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _filterSource: object[] = null;
    protected _source: Memory = null;
    protected _viewSource: Memory = null;

    protected _beforeMount(): void {
        this._filterSource = [
            {
                name: 'response',
                value: null,
                resetValue: null,
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'key',
                        data: [
                            { key: 1, title: 'Только онлайн' },
                            { key: 2, title: 'Только оффлайн' },
                        ],
                    }),
                    displayProperty: 'title',
                    keyProperty: 'key',
                    emptyText: 'Все',
                },
                viewMode: 'frequent',
            },
            {
                name: 'online',
                value: null,
                resetValue: null,
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'key',
                        data: [
                            {
                                key: 1,
                                title: 'Поддержка',
                                parent: null,
                                '@parent': false,
                            },
                            {
                                key: 2,
                                title: 'с клиентами',
                                parent: 1,
                                '@parent': false,
                            },
                            {
                                key: 3,
                                title: 'с сотрудниками',
                                parent: 1,
                                '@parent': false,
                            },
                            {
                                key: 4,
                                title: 'Продажи',
                                parent: null,
                                '@parent': false,
                            },
                            {
                                key: 5,
                                title: 'устройств',
                                parent: 4,
                                '@parent': null,
                            },
                            {
                                key: 6,
                                title: 'приложений',
                                parent: 4,
                                '@parent': null,
                            },
                            {
                                key: 7,
                                title: 'SabyGet',
                                parent: null,
                                '@parent': false,
                            },
                            {
                                key: 8,
                                title: 'чаты',
                                parent: 7,
                                '@parent': false,
                            },
                            {
                                key: 9,
                                title: 'специализированные',
                                parent: 8,
                                '@parent': false,
                            },
                            {
                                key: 10,
                                title: 'помощь с документами',
                                parent: 9,
                                '@parent': null,
                            },
                            {
                                key: 11,
                                title: 'чат',
                                parent: 7,
                                '@parent': null,
                            },
                        ],
                    }),
                    displayProperty: 'title',
                    keyProperty: 'key',
                    nodeProperty: '@parent',
                    parentProperty: 'parent',
                    emptyText: 'Все',
                },
                viewMode: 'frequent',
            },
        ];

        this._viewSource = new Memory({
            data: [
                { id: 'Новиков Д.В.', title: 'Новиков Д.В.' },
                { id: 'Кошелев А.Е.', title: 'Кошелев А.Е.' },
                { id: 'Субботин А.В.', title: 'Субботин А.В.' },
            ],
            keyProperty: 'department',
            filter: (item, queryFilter) => {
                if (queryFilter.response && queryFilter instanceof Array) {
                    return (
                        queryFilter.response.includes(item.get('id')) ||
                        !queryFilter.response.length
                    );
                }
            },
        });
    }
    static _styles: string[] = ['DemoStand/Controls-demo'];
}
