import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { HierarchyData } from '../Data';
import * as controlTemplate from 'wml!Controls-ListEnv-demo/Search/Hierarchy/Base/Index';
import 'css!Controls-ListEnv-demo/Search/Index';
import HierarchyMemory from '../HierarchyMemory';

export default class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    // Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
    // используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
    // https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
    static getLoadConfig() {
        return {
            viewData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new HierarchyMemory({
                        data: HierarchyData,
                        keyProperty: 'id',
                    }),
                    parentProperty: 'parent',
                    nodeProperty: 'node',
                    searchParam: 'title',
                    keyProperty: 'id',
                    displayProperty: 'title',
                },
            },
        };
    }
}
