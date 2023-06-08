import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanel/FilterChangedCallback/Index';
import { isEqual } from 'Types/object';
import { Memory } from 'Types/source';
import { departments } from 'Controls-demo/filterPanel/resources/DataStorage';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _filterButtonSource: unknown[] = [];
    protected _source: Memory = null;

    protected _beforeMount(): void {
        this._source = new Memory({
            data: departments,
            keyProperty: 'id',
            filter: (item, queryFilter) => {
                let addToData = true;
                const emptyFields = {
                    owner: null,
                    department: null,
                };
                for (const filterField in queryFilter) {
                    if (
                        queryFilter.hasOwnProperty(filterField) &&
                        item.get(filterField) &&
                        addToData
                    ) {
                        const filterValue = queryFilter[filterField];
                        const itemValue = item.get(filterField);
                        addToData =
                            filterValue === itemValue ||
                            (emptyFields &&
                                isEqual(filterValue, emptyFields[filterField]));
                    }
                }
                return addToData;
            },
        });
        this._filterButtonSource = [
            {
                caption: 'Отдел',
                name: 'department',
                editorTemplateName: 'Controls/filterPanel:ListEditor',
                resetValue: null,
                value: null,
                textValue: '',
                viewMode: 'basic',
                editorOptions: {
                    keyProperty: 'id',
                    filter: {},
                    displayProperty: 'title',
                    source: new Memory({
                        data: [
                            { id: 'Разработка', title: 'Разработка' },
                            { id: 'Продвижение', title: 'Продвижение' },
                        ],
                        keyProperty: 'id',
                    }),
                },
            },
            {
                name: 'owner',
                resetValue: null,
                value: null,
                caption: '',
                textValue: '',
                editorTemplateName: 'Controls/filterPanel:ListEditor',
                filterChangedCallback:
                    'Controls-demo/filterPanel/FilterChangedCallback/filterChangedCallback',
                editorOptions: {
                    keyProperty: 'id',
                    filter: {},
                    displayProperty: 'title',
                    additionalTextProperty: 'counter',
                    source: new Memory({
                        data: [
                            {
                                id: 'Новиков Д.В.',
                                title: 'Новиков Д.В.',
                                showOnAmountChanged: true,
                                counter: 12,
                                devCounter: 4,
                            },
                            {
                                id: 'Кошелев А.Е.',
                                title: 'Кошелев А.Е.',
                                showOnAmountChanged: true,
                                counter: 123,
                                devCounter: 6,
                            },
                            {
                                id: 'Субботин А.В.',
                                title: 'Субботин А.В.',
                                counter: 23,
                                devCounter: 1,
                            },
                            {
                                id: 'Чеперегин А.С.',
                                title: 'Чеперегин А.С.',
                                counter: 5,
                                devCounter: 2,
                            },
                        ],
                        keyProperty: 'id',
                    }),
                },
            },
        ];
    }

    static _styles: string[] = [
        'Controls-demo/Filter_new/Filter',
        'Controls-demo/filterPanel/Index',
    ];
}
