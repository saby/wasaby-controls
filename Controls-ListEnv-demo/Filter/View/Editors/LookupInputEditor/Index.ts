import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/Editors/LookupInputEditor/Index';
import { Memory } from 'Types/source';
import * as dataFilter from './LookupFilter';
import { IFilterItem } from 'Controls/filter';
import * as filter from './DataFilter';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';

const data = [
    { id: 'Новиков Д.В.', title: 'Новиков Д.В.' },
    { id: 'Кошелев А.Е.', title: 'Кошелев А.Е.' },
    { id: 'Субботин А.В.', title: 'Субботин А.В.' },
];

export const lookupInputConfig = {
    name: 'owner',
    caption: 'Руководитель',
    editorTemplateName: 'Controls/filterPanel:LookupInputEditor',
    resetValue: [],
    value: [],
    textValue: '',
    viewMode: 'extended',
    editorOptions: {
        source: new Memory({
            keyProperty: 'id',
            data,
            filter: dataFilter,
        }),
        displayProperty: 'title',
        keyProperty: 'id',
        searchParam: 'title',
        selectorTemplate: {
            templateName:
                'Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/resources/StackTemplate',
            templateOptions: {
                items: data,
            },
        },
        suggestTemplate: {
            templateName: 'Controls/suggestPopup:SuggestTemplate',
        },
        multiSelect: true,
        extendedCaption: 'Выбор руководителя из поля выбора из спарвочника',
    },
} as IFilterItem;

export const lookupInputBasicConfig = {
    ...lookupInputConfig,
    ...{
        name: 'ownerBasic',
        value: ['Новиков Д.В.'],
    },
} as IFilterItem;

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            lookupInputData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data,
                        keyProperty: 'id',
                        filter,
                    }),
                    keyProperty: 'id',
                    displayProperty: 'title',
                    filterDescription: [lookupInputConfig],
                },
            },
        };
    }
}
