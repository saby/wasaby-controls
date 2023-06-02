import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Memory } from 'Types/source';
import { getFewCategories as getData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

import * as Template from 'wml!Controls-demo/list_new/RowSeparator/RowSeparatorVisibility/RowSeparatorVisibility';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _rowSeparatorVisibility: string;

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: getData(),
        });
    }

    protected _setRowSeparatorVisibility(
        e: SyntheticEvent,
        value: string
    ): void {
        this._rowSeparatorVisibility = value;
    }

    static _styles: string[] = ['DemoStand/Controls-demo'];
}
