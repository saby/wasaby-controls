import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { getColorsData as getData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

import 'wml!Controls-demo/list_new/ItemTemplate/FromFile/TempItem';
import * as Template from 'wml!Controls-demo/list_new/ItemTemplate/BackgroundColorStyle/BackgroundColorStyle';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemTemplateBackgroundColorStyle: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'backgroundStyle',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    }
}
