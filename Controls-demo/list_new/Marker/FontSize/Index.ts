import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/Marker/FontSize/FontSize';
import { Memory } from 'Types/source';
import { getFewCategories as getData } from '../../DemoHelpers/DataCatalog';
import 'wml!Controls-demo/list_new/ItemTemplate/FromFile/TempItem';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            MarkerFontSize: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'description',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    markerVisibility: 'visible',
                },
            },
        };
    }
}
