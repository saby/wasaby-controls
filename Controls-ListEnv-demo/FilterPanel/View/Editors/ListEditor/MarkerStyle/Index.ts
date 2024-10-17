import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/MarkerStyle/Index';
import { Memory } from 'Types/source';
import { IFilterItem } from 'Controls/filter';
import {
    departmentsWithAmount,
    filterItems,
} from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import * as filter from './DataFilter';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';

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

const filterData = [
    { id: 1, title: 'Новиков Д.В.', owner: 'Новиков Д.В.' },
    { id: 2, title: 'Кошелев А.Е.', owner: 'Кошелев А.Е.' },
    { id: 3, title: 'Субботин А.В.', owner: 'Субботин А.В.' },
    { id: 4, title: 'Чеперегин А.С.', owner: 'Чеперегин А.С.' },
];

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            markerStyleData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: departmentsWithAmount,
                        keyProperty: 'id',
                        filter,
                    }),
                    keyProperty: 'id',
                    displayProperty: 'title',
                    filterDescription: [
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
                                        'Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/MarkerStyle/MultiSelectStackTemplate/StackTemplate',
                                    templateOptions: { items: filterData },
                                    popupOptions: { width: 300 },
                                },
                                source: new Memory({
                                    data: filterData,
                                    keyProperty: 'owner',
                                }),
                            },
                        },
                    ],
                },
            },
        };
    }
}
