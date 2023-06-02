import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/ColumnScroll/DevelopmentFull/DevelopmentFull';
import * as NewColumnTemplate from 'wml!Controls-demo/gridNew/ColumnScroll/DevelopmentFull/NewColumnTemplate';
import * as PopulationColumn from 'wml!Controls-demo/gridNew/ColumnScroll/DevelopmentFull/PopulationColumn';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { IHeader } from 'Controls-demo/types';
import { SyntheticEvent } from 'UI/Vdom';
import * as Dnd from 'Controls/dragnDrop';
import { Collection } from 'Controls/display';
import { Model } from 'Types/entity';
import { IItemAction } from 'Controls/interface';
import { getActionsForContacts as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

const DEFAULT_HEADER = [
    { title: '#' },
    { title: 'Страна' },
    { title: 'Столица' },
    { title: 'Население' },
    { title: 'Площадь км2' },
    { title: 'Плотность населения чел/км2' },
];

const COLSPAN_HEADER = [
    { title: 'Страна', startColumn: 1, endColumn: 3 },
    { title: 'Столица', startColumn: 3, endColumn: 4 },
    { title: 'Население', startColumn: 4, endColumn: 5 },
    { title: 'Площадь км2', startColumn: 5, endColumn: 7 },
];

const COLSPAN_HEADER_MULTI = [
    { title: '#', startColumn: 1, endColumn: 2, startRow: 1, endRow: 3 },
    { title: 'Страна', startColumn: 2, endColumn: 3, startRow: 1, endRow: 3 },
    {
        title: 'Характеристики',
        startColumn: 3,
        endColumn: 7,
        startRow: 1,
        endRow: 2,
    },
    { title: 'Столица', startColumn: 3, endColumn: 4, startRow: 2, endRow: 3 },
    {
        title: 'Население',
        startColumn: 4,
        endColumn: 5,
        startRow: 2,
        endRow: 3,
    },
    {
        title: 'Площадь км2',
        startColumn: 5,
        endColumn: 6,
        startRow: 2,
        endRow: 3,
    },
    {
        title: 'Плотность населения чел/км2',
        startColumn: 6,
        endColumn: 7,
        startRow: 2,
        endRow: 3,
    },
];

class DemoSource extends Memory {
    private _qPromise: Promise<void>;
    private _qPromiseResolver: () => void;

    setDelay(delay: number): void {
        this._delay = delay;
    }

    freezeQuerry() {
        if (!this._qPromise) {
            this._qPromise = new Promise((res) => {
                this._qPromiseResolver = res;
            });
        }
    }

    unfreezeQuerry() {
        if (this._qPromise) {
            this._qPromiseResolver();
            this._qPromiseResolver = null;
            this._qPromise = null;
        }
    }

    query(): Promise<any> {
        const args = arguments;
        return Promise.resolve()
            .then(() => {
                return this._qPromise;
            })
            .then(() => {
                return super.query.apply(this, args);
            });
    }
}

export default class extends Control {
    private DEFAULT_HEADER: object[] = DEFAULT_HEADER;
    private COLSPAN_HEADER: object[] = COLSPAN_HEADER;
    private COLSPAN_HEADER_MULTI: object[] = COLSPAN_HEADER_MULTI;
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IColumn[] = Countries.getColumnsWithWidths();
    protected _header: IHeader[] = DEFAULT_HEADER;
    protected _itemActions: IItemAction[] = [];

    private _columnScroll: boolean = true;
    private _dragScrolling: boolean = undefined;
    private _currentItemsName: 'Empty' | 'Not empty' = 'Not empty';
    private _emptyViewSource: DemoSource;
    private _notEmptyViewSource: DemoSource;
    private _newColumnWidth: string = '100px';
    private _containerWidth: string = '710px';
    private _containerWidthInputValue: string = this._containerWidth;
    private _shouldNotifyOfResize: boolean = false;
    private _stickyColumnsCount: number = 2;
    private _stickyColumnsCountInput: string = `${this._stickyColumnsCount}`;
    private _columnScrollStartPosition: undefined | 'end' = 'end';
    private _currentHeaderName:
        | 'default'
        | 'colspan'
        | 'multiDefault'
        | 'multiColspan' = 'default';
    private _itemsDragNDrop: boolean = false;
    private _scrollToColumnIdx?: number;
    private _hasResults?: boolean;
    private _multiSelectVisibility: 'visible' | 'hidden' = 'hidden';
    private _columnScrollViewMode?: 'scrollbar' | 'arrows' | 'unaccented';
    private _isPendingScrollToColumn: boolean = false;
    private _backgroundStyleInputValue: string = 'default';
    private _backgroundStyle: string = 'default';

    protected _beforeMount(): void {
        this._columns[2].width = '1fr';
        this._columns[3].template = PopulationColumn;
        this._emptyViewSource = new DemoSource({
            keyProperty: 'key',
            data: [],
        });
        const data = Countries.getData();
        data[2].show = true;
        this._notEmptyViewSource = new DemoSource({
            keyProperty: 'key',
            data,
        });
        this._viewSource = this._notEmptyViewSource;
    }

    protected _afterUpdate(): void {
        if (this._isPendingScrollToColumn) {
            this._isPendingScrollToColumn = false;
            this._children.grid.scrollToColumn(this._columns.length - 1);
        }
    }

    protected _afterRender(): void {
        if (this._shouldNotifyOfResize) {
            this._shouldNotifyOfResize = false;
            this._children.resizeDetect.start();
        }
    }

    protected _dragStart(_: SyntheticEvent, draggedKeys: number[]): any {
        if (!this._itemsDragNDrop) {
            return;
        }
        let title = '';

        draggedKeys.forEach((draggedItemKey) => {
            title +=
                this._children.grid
                    .getItems()
                    .getRecordById(draggedItemKey)
                    .get('country') + ', ';
        });

        return new Dnd.ItemsEntity({
            items: draggedKeys,
            // eslint-disable-next-line
            title: title.trim().slice(0, title.length - 2),
        });
    }

    protected _dragEnd(
        _: SyntheticEvent,
        entity: Collection<Model>,
        target: unknown,
        position: string
    ): void {
        if (!this._itemsDragNDrop) {
            return;
        }
        this._children.mover.moveItems(entity.getItems(), target, position);
    }

    protected _toggleDND(): void {
        this._itemsDragNDrop = !this._itemsDragNDrop;
    }

    protected _toggleItemActions(): void {
        if (this._itemActions.length) {
            this._itemActions = [];
        } else {
            this._itemActions = getItemActions();
        }
    }

    protected _toggleColumnScroll(): void {
        this._columnScroll = !this._columnScroll;
    }

    protected _toggleDragScrollScroll(e: Event, value: boolean): void {
        if (this._dragScrolling !== value) {
            this._dragScrolling = value;
        }
    }

    protected _toggleItems(e: Event, val: 'Empty' | 'Not empty'): void {
        if (this._currentItemsName !== val) {
            this._currentItemsName = val;
            this._viewSource =
                val === 'Empty'
                    ? this._emptyViewSource
                    : this._notEmptyViewSource;
        }
    }

    protected _changeStickyColumnsCount(): void {
        if (this._stickyColumnsCount !== +this._stickyColumnsCountInput) {
            this._stickyColumnsCount = +this._stickyColumnsCountInput;
        }
    }

    protected _changeWidth(): void {
        if (this._containerWidth !== this._containerWidthInputValue) {
            this._containerWidth = this._containerWidthInputValue;
            this._shouldNotifyOfResize = true;
        }
    }

    protected _addColumn(): void {
        this._columns = [
            ...this._columns,
            {
                template: NewColumnTemplate,
                templateOptions: {
                    columnName: this._columns.length + 1,
                },
                width: this._newColumnWidth,
            },
        ];
        if (this._currentHeaderName === 'multiColspan') {
            this._header = [
                ...this._header,
                {
                    title: '№ ' + (this._header.length + 1),
                    startRow: 1,
                    endRow: 3,
                    startColumn: this._columns.length,
                    endColumn: this._columns.length + 1,
                },
            ];
        } else {
            this._header = [
                ...this._header,
                {
                    title: '№ ' + (this._header.length + 1),
                },
            ];
        }
        this.DEFAULT_HEADER = [
            ...this.DEFAULT_HEADER,
            {
                title: '№ ' + (this.DEFAULT_HEADER.length + 1),
            },
        ];
        this.COLSPAN_HEADER = [
            ...this.COLSPAN_HEADER,
            {
                title: '№ ' + (this.COLSPAN_HEADER.length + 1),
            },
        ];
        this.COLSPAN_HEADER_MULTI = [
            ...this.COLSPAN_HEADER_MULTI,
            {
                title: '№ ' + (this.COLSPAN_HEADER_MULTI.length + 1),
                startRow: 1,
                endRow: 3,
                startColumn: this._columns.length,
                endColumn: this._columns.length + 1,
            },
        ];
    }

    protected _reload(e: Event, isLong: boolean): void {
        if (isLong) {
            if (this._isLongLoad) {
                this._isLongLoad = false;
                this._viewSource.unfreezeQuerry();
            } else {
                this._isLongLoad = true;
                this._viewSource.freezeQuerry();
                this._children.grid.reload();
            }
        } else {
            this._children.grid.reload();
        }
    }

    protected _toggleColumnScrollStartPosition(e: Event, value: boolean): void {
        if (this._columnScrollStartPosition !== value) {
            this._columnScrollStartPosition = value;
        }
    }

    protected _changeHeader(
        e: Event,
        value: 'default' | 'colspan' | 'multiDefault' | 'multiColspan'
    ): void {
        if (this._currentHeaderName !== value) {
            this._currentHeaderName = value;
            switch (value) {
                case 'default':
                    this._header = this.DEFAULT_HEADER;
                    break;
                case 'colspan':
                    this._header = this.COLSPAN_HEADER;
                    break;
                case 'multiColspan': {
                    this._header = this.COLSPAN_HEADER_MULTI;
                    break;
                }
            }
        }
    }

    protected _toggleCheckbox(): void {
        this._multiSelectVisibility =
            this._multiSelectVisibility === 'visible' ? 'hidden' : 'visible';
    }

    protected _toggleResults(): void {
        this._hasResults = !this._hasResults;
    }

    protected _toggleScrollBar(e: Event, value: string): void {
        this._columnScrollViewMode = value;
    }

    protected _setBackgroundStyle(e: Event, reset?: boolean): void {
        if (reset) {
            this._backgroundStyleInputValue = 'default';
        }
        if (this._backgroundStyleInputValue !== this._backgroundStyle) {
            this._backgroundStyle = this._backgroundStyleInputValue;
        }
    }

    protected _scrollToColumn(): void {
        this._children.grid.scrollToColumn(+this._scrollToColumnIdx);
    }

    protected _scrollToNewColumn(): void {
        this._addColumn();
        this._isPendingScrollToColumn = true;
    }

    protected _scrollToLeft(): void {
        this._children.grid.scrollToLeft();
    }

    protected _scrollToRight(): void {
        this._children.grid.scrollToRight();
    }
}
