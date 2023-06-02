import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { IHeaderCell } from 'Controls/grid';
import { IColumn } from 'Controls/grid';
import { Data } from 'Controls-demo/gridNew/Header/SpacingForMoney/Data';

import * as Template from 'wml!Controls-demo/gridNew/Header/SpacingForMoney/SpacingForMoney';

/**
 * Демка для https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/header/visual/#paddings
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _header: IHeaderCell[] = Data.getHeader();
    protected _columns: IColumn[] = Data.getColumns();

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: Data.getData(),
        });
        this._itemsReadyCallback = this._itemsReadyCallback.bind(this);
    }

    protected _itemsReadyCallback(items: RecordSet): void {
        items.setMetaData({
            ...items.getMetaData(),
            results: Data.getMeta(items.getAdapter()),
        });
    }
}
