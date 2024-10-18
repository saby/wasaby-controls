import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/HorizontalScroll/Overlay/Grid/Grid';
import { Memory } from 'Types/source';
import { getData } from 'Controls-demo/HorizontalScroll/content/Grid/resources/data';
import { getColumns } from 'Controls-demo/HorizontalScroll/content/Grid/resources/columns';
import {
    getHeader,
    TActionClickCallbackType,
} from 'Controls-demo/HorizontalScroll/content/Grid/resources/header';
import type { TColumns, THeader } from 'Controls/grid';

export const DEFAULT_ROWS_COUNT = 50;
export const DEFAULT_COLUMNS_COUNT = 50;

export class Grid extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory = new Memory({
        keyProperty: 'key',
        data: getData(DEFAULT_ROWS_COUNT, DEFAULT_COLUMNS_COUNT),
    });
    protected _header: THeader = getHeader(DEFAULT_COLUMNS_COUNT);
    protected _columns: TColumns = getColumns(DEFAULT_COLUMNS_COUNT);
}

export default Grid;
