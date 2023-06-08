import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Filter_new/List/List';
import memorySourceFilter = require('Controls-demo/Utils/MemorySourceFilter');
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _filterSource: object[] = null;
    protected _source: Memory = null;

    protected _beforeMount(): void {
        this._filterSource = [
            {
                name: 'city',
                value: null,
                resetValue: null,
                emptyText: 'Choose city',
                emptyKey: 10,
                filterTemplate: 'Controls/filterPopup:Dropdown',
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            { id: 'Yaroslavl', city: 'Yaroslavl' },
                            { id: 'Moscow', city: 'Moscow' },
                            { id: 'Kazan', city: 'Kazan' },
                        ],
                    }),
                    displayProperty: 'city',
                    keyProperty: 'id',
                },
                viewMode: 'frequent',
            },
        ];

        this._source = new Memory({
            keyProperty: 'id',
            data: [
                { id: '1', title: 'Yaroslavl city', city: 'Yaroslavl' },
                { id: '2', title: 'Moscow city', city: 'Moscow' },
                { id: '3', title: 'Kazan city', city: 'Kazan' },
            ],
            filter: memorySourceFilter({
                city: null,
            }),
        });
    }
}
