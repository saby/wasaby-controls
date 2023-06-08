import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Filter_new/FilterView/Source/FrequentWithMultiSelect/Index';
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _filterSource: object[] = null;
    protected _source: Memory = null;

    protected _beforeMount(): void {
        this._filterSource = [
            {
                name: 'city',
                value: ['Yaroslavl'],
                emptyText: 'Choose city',
                editorOptions: {
                    multiSelect: true,
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
                    multiSelect: true,
                },
                viewMode: 'frequent',
            },
        ];
    }
}
