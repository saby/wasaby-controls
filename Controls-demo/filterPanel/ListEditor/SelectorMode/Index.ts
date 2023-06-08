import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanel/ListEditor/SelectorMode/Index';
import * as stackTemplate from 'wml!Controls-demo/filterPanel/resources/MultiSelectStackTemplate/StackTemplate';
import { isEqual } from 'Types/object';
import { Memory } from 'Types/source';
import { departments } from 'Controls-demo/filterPanel/resources/DataStorage';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _stackTemplate: TemplateFunction = stackTemplate;
    protected _filterButtonData: unknown[] = [];
    protected _source: Memory = null;
    protected _navigation: object = null;
    protected _filterItems: object[] = null;

    protected _beforeMount(): void {
        this._filterItems = [
            { id: 1, title: 'Новиков Д.В.', owner: 'Новиков Д.В.' },
            { id: 2, title: 'Кошелев А.Е.', owner: 'Кошелев А.Е.' },
            { id: 3, title: 'Субботин А.В.', owner: 'Субботин А.В.' },
            { id: 4, title: 'Чеперегин А.С.', owner: 'Чеперегин А.С.' },
        ];
        this._navigation = {
            source: 'page',
            view: 'page',
            sourceConfig: {
                pageSize: 20,
                page: 0,
                hasMore: false,
            },
        };
        this._source = new Memory({
            data: departments,
            keyProperty: 'id',
            filter: (item, queryFilter) => {
                let addToData = true;
                const emptyFields = {
                    owner: null,
                    amount: [],
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
                            filterValue === null ||
                            (itemValue >= filterValue[0] &&
                                itemValue <= filterValue[1]) ||
                            filterValue.includes(itemValue);
                        if (
                            (emptyFields &&
                                isEqual(
                                    filterValue,
                                    emptyFields[filterField]
                                )) ||
                            filterValue[0] === null ||
                            filterValue[1] === null
                        ) {
                            addToData = true;
                        }
                    }
                }
                return addToData;
            },
        });
        this._filterButtonData = [
            {
                caption: 'Количество сотрудников',
                name: 'amount',
                editorTemplateName:
                    'Controls/filterPanelExtEditors:NumberRangeEditor',
                resetValue: [],
                value: [],
                textValue: '',
                viewMode: 'basic',
                editorOptions: {
                    afterEditorTemplate:
                        'wml!Controls-demo/filterPanel/resources/AfterEditorTemplate',
                },
            },
            {
                caption: 'Ответственный',
                name: 'owner',
                resetValue: null,
                value: null,
                textValue: '',
                editorTemplateName: 'Controls/filterPanel:ListEditor',
                editorOptions: {
                    navigation: {
                        source: 'page',
                        view: 'page',
                        sourceConfig: {
                            pageSize: 3,
                            page: 0,
                            hasMore: false,
                        },
                    },
                    keyProperty: 'owner',
                    additionalTextProperty: 'id',
                    displayProperty: 'title',
                    selectorTemplate: {
                        templateName:
                            'Controls-demo/filterPanel/resources/DialogTemplate',
                        templateOptions: { items: this._filterItems },
                        popupOptions: {
                            width: 500,
                        },
                        mode: 'dialog',
                    },
                    source: new Memory({
                        data: this._filterItems,
                        keyProperty: 'owner',
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
