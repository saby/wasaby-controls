import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { INavigation } from 'Controls/interface';
import * as explorerImages from 'Controls-demo/Explorer/ExplorerImagesLayout';
import { generateData } from 'Controls-demo/tileNew/DataHelpers/ForScroll';
import { Memory } from 'Types/source';

import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/ToggleImageVisible/ScrollToDown/ScrollToDown';

const data = generateData(100, [20]);

export default class ScrollToDown extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory = null;
    protected _navigation: INavigation;
    protected _fallbackImage: string = `${explorerImages[0]}`;

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data,
        });
        this._navigation = {
            source: 'page',
            view: 'infinity',
            sourceConfig: {
                hasMore: false,
                page: 0,
                pageSize: 20,
            },
        };
    }
}
