import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tileNew/Tile';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import Default from 'Controls-demo/tileNew/Default/Index';
import DifferentWidth from 'Controls-demo/tileNew/DifferentWidth/Index';
import SameWidth from 'Controls-demo/tileNew/SameWidth/Index';
import ScaleOnHover from 'Controls-demo/tileNew/ScaleOnHover/Index';
import Shadows from 'Controls-demo/tileNew/Shadows/Index';
import Marker from 'Controls-demo/tileNew/Marker/Index';
import MultiSelect from 'Controls-demo/tileNew/MultiSelect/Index';
import DragNDrop from 'Controls-demo/tileNew/DragNDrop/Index';
import ItemPadding from 'Controls-demo/tileNew/ItemPadding/Index';
import TitleStyleAccent from 'Controls-demo/tileNew/TitleStyleAccent/Index';
import NodesHeight from 'Controls-demo/tileNew/NodesHeight/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Default.getLoadConfig(),
            ...DifferentWidth.getLoadConfig(),
            ...SameWidth.getLoadConfig(),
            ...ScaleOnHover.getLoadConfig(),
            ...Shadows.getLoadConfig(),
            ...Marker.getLoadConfig(),
            ...MultiSelect.getLoadConfig(),
            ...DragNDrop.getLoadConfig(),
            ...ItemPadding.getLoadConfig(),
            ...TitleStyleAccent.getLoadConfig(),
            ...NodesHeight.getLoadConfig(),
        };
    }
}
