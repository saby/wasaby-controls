import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tileNew/TileScalingMode/template';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import Inside from 'Controls-demo/tileNew/TileScalingMode/Inside/Index';
import Outside from 'Controls-demo/tileNew/TileScalingMode/Outside/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Inside.getLoadConfig(),
            ...Outside.getLoadConfig(),
        };
    }
}
