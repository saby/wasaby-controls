import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { IFilterItem } from 'Controls/filter';
import * as filter from './DataFilter';
import * as template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/TumblerEditor/Index';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';

export const tumblerConfig = {
    caption: 'Пол',
    name: 'gender',
    value: '2',
    resetValue: null,
    textValue: '',
    viewMode: 'basic',
    editorTemplateName: 'Controls/filterPanelExtEditors:TumblerEditor',
    editorOptions: {
        items: new RecordSet({
            rawData: [
                {
                    id: '1',
                    caption: 'Мужской',
                },
                {
                    id: '2',
                    caption: 'Женский',
                },
            ],
            keyProperty: 'id',
        }),
    },
} as IFilterItem;

export const tumblerBasicConfig = {
    ...tumblerConfig,
    ...{
        viewMode: 'basic',
        value: '1',
    },
} as IFilterItem;

export default class WidgetWrapper extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;

    // Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
    // используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
    // https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
    static getLoadConfig() {
        return {
            genders: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    filterDescription: [tumblerConfig],
                    source: new Memory({
                        data: [
                            {
                                id: '1',
                                title: 'Мужской',
                            },
                            {
                                id: '2',
                                title: 'Женский',
                            },
                        ],
                        keyProperty: 'id',
                        filter,
                    }),
                    keyProperty: 'department',
                    displayProperty: 'title',
                },
            },
        };
    }
}
