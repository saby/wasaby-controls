import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/FilterOld/FilterView/Browser/List';
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
                textValue: '',
                emptyText: 'Choose city',
                editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
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
