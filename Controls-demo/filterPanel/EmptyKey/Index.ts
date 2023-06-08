import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanel/EmptyKey/Index';
import { isEqual } from 'Types/object';
import { Memory } from 'Types/source';
import { MultiSelectAccessibility } from 'Controls/list';
import { departments } from 'Controls-demo/filterPanel/resources/DataStorage';
import { default as CustomMemory } from '../Util/CustomMemory';
import { IFilterItem } from 'Controls/filter';
import { Record } from 'Types/entity';

const filterItems = [
    {
        id: 1,
        title: 'Новиков Д.В.',
        owner: 'Новиков Д.В.',
        showCheckbox: MultiSelectAccessibility.enabled,
    },
    {
        id: 2,
        title: 'Кошелев А.Е.',
        owner: 'Кошелев А.Е.',
        showCheckbox: MultiSelectAccessibility.enabled,
    },
    {
        id: 3,
        title: 'Субботин А.В.',
        owner: 'Субботин А.В.',
        showCheckbox: MultiSelectAccessibility.enabled,
    },
];

export const emptyKeyConfig = {
    caption: 'Ответственный',
    name: 'owner',
    resetValue: [],
    value: [],
    textValue: '',
    emptyText: 'Все сотрудники',
    emptyKey: null,
    editorTemplateName: 'Controls/filterPanel:ListEditor',
    editorOptions: {
        multiSelect: true,
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
        multiSelectAccessibilityProperty: 'showCheckbox',
        additionalTextProperty: 'id',
        mainCounterProperty: 'pk',
        emptyTextAdditionalCounterProperty: 'emptyTextAddCounter',
        emptyTextMainCounterProperty: 'emptyTextMainCounter',
        displayProperty: 'title',
        source: new CustomMemory({
            data: filterItems,
            keyProperty: 'owner',
            metaDataResults: new Record({
                rawData: {
                    emptyTextAddCounter: 5,
                    emptyTextMainCounter: 2,
                },
            }),
        }),
    },
} as unknown as IFilterItem;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _filterDescription: unknown[] = [];
    protected _source: Memory = null;
    protected _navigation: object = null;

    protected _beforeMount(): void {
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
                    owner: [],
                };
                for (const filterField in queryFilter) {
                    if (
                        queryFilter.hasOwnProperty(filterField) &&
                        item.get(filterField) &&
                        addToData
                    ) {
                        const filterValue = queryFilter[filterField];
                        const itemValue = item.get(filterField);
                        addToData = filterValue.includes(itemValue);
                        if (
                            emptyFields &&
                            isEqual(filterValue, emptyFields[filterField])
                        ) {
                            addToData = true;
                        }
                    }
                }
                return addToData;
            },
        });
        this._filterDescription = [emptyKeyConfig];
    }

    static _styles: string[] = [
        'Controls-demo/Filter_new/Filter',
        'Controls-demo/filterPanel/Index',
    ];
}
