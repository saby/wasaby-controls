import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanel/FilterEditors/LookupEditor/Index';
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _filterButtonSource: object[] = [];
    protected _source: Memory = null;

    protected _beforeMount(): void {
        const data = [
            { id: '1', title: 'Yaroslavl' },
            { id: '2', title: 'Moscow' },
            { id: '3', title: 'St-Petersburg' },
        ];
        this._source = new Memory({
            data: [
                { city: '1', title: 'Yaroslavl' },
                { city: '2', title: 'Moscow' },
                { city: '3', title: 'St-Petersburg' },
            ],
            keyProperty: 'city',
            filter: (item, queryFilter) => {
                let addToData = true;
                for (const filterField in queryFilter) {
                    if (
                        queryFilter.hasOwnProperty(filterField) &&
                        item.get(filterField)
                    ) {
                        const filterValue = queryFilter[filterField];
                        const itemValue = item.get(filterField);
                        addToData =
                            filterValue.includes(itemValue) ||
                            !filterValue.length;
                    }
                }
                return addToData;
            },
        });
        this._filterButtonSource = [
            {
                caption: 'Город',
                name: 'city',
                editorTemplateName: 'Controls/filterPanel:LookupEditor',
                resetValue: [],
                value: ['1'],
                textValue: '',
                viewMode: 'basic',
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data,
                    }),
                    displayProperty: 'title',
                    keyProperty: 'id',
                    extendedCaption: 'Должность',
                    selectorTemplate: {
                        templateName:
                            'Controls-demo/filterPanel/resources/MultiSelectStackTemplate/StackTemplate',
                        templateOptions: {
                            items: data,
                        },
                    },
                },
            },
        ];
    }

    static _styles: string[] = ['Controls-demo/filterPanel/Index'];
}
