import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { getFewCategories as getData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

import * as Template from 'wml!Controls-demo/list_new/RoundBorder/RoundBorder';
import 'css!DemoStand/Controls-demo';

export default class extends Control {
    static _styles: string[] = [''];
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
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
