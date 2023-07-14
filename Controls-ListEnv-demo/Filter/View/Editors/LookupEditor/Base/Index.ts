import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IFilterItem } from 'Controls/filter';
import * as filter from '../resources/DataFilter';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/Base/Index';

const data = [
    { id: 'Yaroslavl', title: 'Yaroslavl' },
    { id: 'Moscow', title: 'Moscow' },
    { id: 'Kazan', title: 'Kazan' },
];

export const lookupConfig = {
    name: 'city',
    caption: 'Город',
    editorTemplateName: 'Controls/filterPanel:LookupEditor',
    resetValue: null,
    value: null,
    textValue: '',
    viewMode: 'extended',
    editorOptions: {
        source: new Memory({
            keyProperty: 'id',
            data,
        }),
        displayProperty: 'title',
        keyProperty: 'id',
        extendedCaption: 'Город',
        frequentItemText: 'Yaroslavl',
        frequentItemKey: 'Yaroslavl',
        selectorTemplate: {
            templateName:
                'Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/resources/StackTemplate',
            templateOptions: {
                items: data,
            },
        },
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
                        data,
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
