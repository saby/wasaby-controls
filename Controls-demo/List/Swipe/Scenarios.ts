import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/List/Swipe/Scenarios';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import News from 'Controls-demo/List/Swipe/Scenarios/News/News';
import Shipments from 'Controls-demo/List/Swipe/Scenarios/Shipments/Shipments';
import SmallRow from 'Controls-demo/List/Swipe/Scenarios/SmallRow/SmallRow';
import Tile from 'Controls-demo/List/Swipe/Scenarios/Tile/Tile';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static _styles: string[] = ['Controls-demo/List/Swipe/Scenarios'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...News.getLoadConfig(),
            ...Shipments.getLoadConfig(),
            ...SmallRow.getLoadConfig(),
            ...Tile.getLoadConfig(),
        };
    }
}
