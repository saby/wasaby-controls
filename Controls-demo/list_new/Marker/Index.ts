import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/list_new/Marker/Marker';

import Visible from 'Controls-demo/list_new/Marker/Visible/Index';
import Base from 'Controls-demo/list_new/Marker/Base/Index';
import Hidden from 'Controls-demo/list_new/Marker/Hidden/Index';
import OnReload from 'Controls-demo/list_new/Marker/OnReload/Index';
import OnBeforeMarkedKeyChanged from 'Controls-demo/list_new/Marker/OnBeforeMarkedKeyChanged/Index';
import OnMarkedKeyChanged from 'Controls-demo/list_new/Marker/OnMarkedKeyChanged/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Visible.getLoadConfig(),
            ...Base.getLoadConfig(),
            ...Hidden.getLoadConfig(),
            ...OnReload.getLoadConfig(),
            ...OnBeforeMarkedKeyChanged.getLoadConfig(),
            ...OnMarkedKeyChanged.getLoadConfig(),
        };
    }
}
