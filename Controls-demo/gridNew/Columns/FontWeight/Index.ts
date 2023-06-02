import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

import * as Template from 'wml!Controls-demo/gridNew/Columns/FontWeight/FontWeight';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: Countries.getData().slice(0, 5),
        });
    }
}
