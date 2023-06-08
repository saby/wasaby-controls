import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';

import { getFewCategories as getData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

import * as Template from 'wml!Controls-demo/list_new/RoundBorder/RoundBorder';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: getData(),
        });
    }

    static _styles: string[] = ['DemoStand/Controls-demo'];
}
