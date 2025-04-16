import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/ItemTemplate/MarkerPositionCustom/MarkerPositionCustom';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { getFewCategories as getData } from '../../DemoHelpers/DataCatalog';
import 'css!Controls-demo/list_new/ItemTemplate/MarkerPositionCustom/MarkerPositionCustom';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemTemplateMarker: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    keyProperty: 'key',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    }
}
