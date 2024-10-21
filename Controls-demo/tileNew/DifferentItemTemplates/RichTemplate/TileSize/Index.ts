import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/TileSize/Template';

import TileSizel from 'Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/TileSize/l/Index';
import TileSizem from 'Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/TileSize/m/Index';
import TileSizes from 'Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/TileSize/s/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;


    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...TileSizel.getLoadConfig(),
            ...TileSizem.getLoadConfig(),
            ...TileSizes.getLoadConfig(),
        };
    }
}
