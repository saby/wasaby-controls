import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { getColorsData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

import 'wml!Controls-demo/list_new/ItemTemplate/FromFile/TempItem';
import * as Template from 'wml!Controls-demo/list_new/ItemTemplate/BackgroundColorStyle/BackgroundColorStyle';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: getColorsData(),
        });
    }
}
