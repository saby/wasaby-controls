import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/EmptyKey/Index';
import { Memory } from 'Types/source';
import { MultiSelectAccessibility } from 'Controls/list';
import { departmentsWithAmount } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import { default as CustomMemory } from 'Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/EmptyKey/CustomMemory';
import { IFilterItem } from 'Controls/filter';
import { Record } from 'Types/entity';
import * as filter from './DataFilter';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';

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

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            emptyKeyData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: departmentsWithAmount,
                        keyProperty: 'id',
                        filter,
                    }),
                    navigation: {
                        source: 'page',
                        view: 'page',
                        sourceConfig: {
                            pageSize: 20,
                            page: 0,
                            hasMore: false,
                        },
                    },
                    keyProperty: 'id',
                    displayProperty: 'title',
                    filterDescription: [emptyKeyConfig],
                },
            },
        };
    }
}
