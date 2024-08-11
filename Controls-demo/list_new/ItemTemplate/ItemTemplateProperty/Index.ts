import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/ItemTemplate/ItemTemplateProperty/ItemTemplateProperty';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { getFewCategories as getData } from '../../DemoHelpers/DataCatalog';
import 'wml!Controls-demo/list_new/ItemTemplate/ItemTemplateProperty/itemTemplateNoHighlight';
import 'wml!Controls-demo/list_new/ItemTemplate/ItemTemplateProperty/itemTemplateWithDescription';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemTemplateItemTemplateProperty: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    }
}
