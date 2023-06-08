import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanel/ListEditor/MarkerStyle/Index';
import { Memory } from 'Types/source';
import { IFilterItem } from 'Controls/filter';
import {
    departments,
    filterItems,
} from 'Controls-demo/filterPanel/resources/DataStorage';
import { isEqual } from 'Types/object';

export const markerListConfig = {
    caption: 'Ответственные',
    name: 'owners',
    resetValue: null,
    value: 'Новиков Д.В.',
    textValue: '',
    editorTemplateName: 'Controls/filterPanel:ListEditor',
    editorOptions: {
        imageProperty: 'sourceImage',
        markerStyle: 'primary',
        style: 'master',
        keyProperty: 'owner',
        additionalTextProperty: 'id',
        mainCounterProperty: 'additionalCounter',
        displayProperty: 'title',
        source: new Memory({
            data: filterItems,
            keyProperty: 'owner',
        }),
        extendedCaption: 'Ответственные',
    },
} as IFilterItem;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _filterButtonData: unknown[] = [];
    protected _source: Memory = null;
    protected _filterItems: object[] = null;

    protected _beforeMount(): void {
        this._filterItems = [
            { id: 1, title: 'Новиков Д.В.', owner: 'Новиков Д.В.' },
            { id: 2, title: 'Кошелев А.Е.', owner: 'Кошелев А.Е.' },
            { id: 3, title: 'Субботин А.В.', owner: 'Субботин А.В.' },
            { id: 4, title: 'Чеперегин А.С.', owner: 'Чеперегин А.С.' },
        ];

        this._source = new Memory({
            data: departments,
            keyProperty: 'id',
            filter: (item, queryFilter) => {
                const emptyField = [];
                let addToData = true;
                for (const filterField in queryFilter) {
                    if (queryFilter.hasOwnProperty(filterField) && addToData) {
                        const filterValue = queryFilter[filterField];
                        const itemValue = item.get('owner');
                        addToData =
                            filterValue.includes(itemValue) ||
                            isEqual(filterValue, emptyField) ||
                            filterValue[0] === null ||
                            filterValue[1] === null;
                    }
                }
                return addToData;
            },
        });
        this._filterButtonData = [
            {
                caption: 'Ответственные',
                name: 'owners',
                resetValue: [],
                value: ['Новиков Д.В.', 'Чеперегин А.С.'],
                textValue: '',
                editorTemplateName: 'Controls/filterPanel:ListEditor',
                editorOptions: {
                    markerStyle: 'primary',
                    style: 'master',
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
                    mainCounterProperty: 'additionalCounter',
                    displayProperty: 'title',
                    selectorTemplate: {
                        templateName:
                            'Controls-demo/filterPanel/resources/MultiSelectStackTemplate/StackTemplate',
                        templateOptions: { items: this._filterItems },
                        popupOptions: { width: 300 },
                    },
                    source: new Memory({
                        data: this._filterItems,
                        keyProperty: 'owner',
                    }),
                },
            },
        ];
    }

    static _styles: string[] = ['Controls-demo/Filter_new/Filter'];
}
