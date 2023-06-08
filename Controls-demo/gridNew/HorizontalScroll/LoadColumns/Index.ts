import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/HorizontalScroll/LoadColumns/LoadColumns';
import * as headerTemplate from 'wml!Controls-demo/gridNew/HorizontalScroll/HeaderTemplate';
import * as columnTemplate from 'wml!Controls-demo/gridNew/HorizontalScroll/ColumnTemplate';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Memory } from 'Types/source';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

const PAGE_SIZE = 40;
const SEGMENT_SIZE = PAGE_SIZE / 4;
const COLUMN_KEY_PROPERTY = 'key';

const getColumns = (
    firstColumn: IColumn,
    startFrom: number,
    count: number,
    template: TemplateFunction,
    displayProperty: string = 'pseudo'
): object[] => {
    const columns: {
        displayProperty?: string;
        width?: string;
    }[] = firstColumn
        ? [
              {
                  ...firstColumn,
                  [COLUMN_KEY_PROPERTY]: 'first',
              },
          ]
        : [];

    for (let i = startFrom; i < startFrom + count - +!!firstColumn; i++) {
        columns.push({
            width: '60px',
            [displayProperty]: i + 1,
            template,
            [COLUMN_KEY_PROPERTY]: `scroll-${i + 1}`,
        });
    }
    return columns;
};

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columnKeyProperty: string = COLUMN_KEY_PROPERTY;
    protected _header: IHeaderCell[];
    protected _columns: IColumn[];

    private _columnsStartIndex: number = 0;
    private _loadingDirectionNow: 'backward' | 'forward' | null = null;
    private _shouldScrollToColumn: boolean = false;

    protected _beforeMount(): void {
        this._setColumns();
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: this._getData('key', 30),
        });
    }

    private _getData(keyProperty: string, count: number): object[] {
        const res = [];
        const data = Countries.getData();
        for (let i = 0; i < count; i++) {
            res.push({ ...data[i % data.length], number: i });
            res[i][keyProperty] = i;
        }
        return res;
    }

    _setColumns(startFrom: number = 0): void {
        this._header = getColumns(
            Countries.getHeader()[1],
            startFrom,
            PAGE_SIZE,
            headerTemplate
        );
        this._columns = getColumns(
            Countries.getColumnsWithWidths()[1],
            startFrom,
            PAGE_SIZE,
            columnTemplate
        );
    }

    _onViewMouseUp(): void {
        if (!this._loadingDirectionNow) {
            return;
        }
        let newStart = this._columnsStartIndex;
        if (this._loadingDirectionNow === 'forward') {
            newStart = this._columnsStartIndex + SEGMENT_SIZE;
        } else if (this._columnsStartIndex > 0) {
            newStart = Math.max(this._columnsStartIndex - SEGMENT_SIZE, 0);
        }
        if (newStart !== this._columnsStartIndex) {
            this._columnsStartIndex = newStart;
            this._setColumns(this._columnsStartIndex - 1);
            this._shouldScrollToColumn = true;
        }
    }

    _onColumnsEnded(e: Event, direction: 'backward' | 'forward'): void {
        this._loadingDirectionNow = direction;
    }

    protected _afterRender(): void {
        if (this._shouldScrollToColumn) {
            let index;
            if (this._loadingDirectionNow === 'forward') {
                index =
                    this._columnsStartIndex + SEGMENT_SIZE + SEGMENT_SIZE - 1;
            } else {
                index = this._columnsStartIndex + SEGMENT_SIZE;
            }
            this._children.grid.scrollToColumn(`scroll-${index}`);
            this._shouldScrollToColumn = false;
            this._loadingDirectionNow = null;
        }
    }
}
