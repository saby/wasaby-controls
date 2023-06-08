import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IFilterItem } from 'Controls/filter';
import { cities } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import * as filter from '../resources/DataFilter';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/MultiSelect/Index';

export const lookupConfig = {
    name: 'city',
    editorTemplateName: 'Controls/filterPanel:LookupEditor',
    resetValue: [],
    value: [],
    textValue: '',
    viewMode: 'extended',
    editorOptions: {
        source: new Memory({
            keyProperty: 'id',
            data: cities,
        }),
        displayProperty: 'title',
        keyProperty: 'id',
        extendedCaption: 'Город',
        selectorTemplate: {
            multiSelect: true,
            templateName:
                'Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/resources/StackTemplate',
            templateOptions: {
                items: cities,
            },
        },
        multiSelect: true,
    },
} as IFilterItem;

export const lookupBasicConfig = {
    ...lookupConfig,
    ...{
        viewMode: 'basic',
        value: ['Yaroslavl'],
    },
} as IFilterItem;

export default class extends Control {
    protected _template: TemplateFunction = Template;

    // Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
    // используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
    // https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
    static getLoadConfig() {
        return {
            cities: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: cities,
                        keyProperty: 'id',
                        filter,
                    }),
                    filterDescription: [lookupConfig],
                    displayProperty: 'title',
                    keyProperty: 'id',
                },
            },
        };
    }
}
