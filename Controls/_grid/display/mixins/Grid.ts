/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import { TemplateFunction } from 'UI/Base';
import { Model, Model as EntityModel } from 'Types/entity';

import { IScrollBarOptions } from 'Controls/columnScroll';
import type {
    ColumnsEnumerator as HScrollColumnsEnumerator,
    IVirtualColumnsEnumerator,
} from 'Controls/horizontalScroll';

import { IColumn, TColumns, TColumnSeparatorSize } from '../interface/IColumn';
import { THeader } from '../interface/IHeaderCell';

import {
    GridLadderUtil,
    GridLayoutUtil,
    ICollectionOptions,
    ILadderObject,
    isFullGridSupport,
    IViewIterator,
    TItemActionsPosition,
    TRowSeparatorVisibility,
} from 'Controls/display';

import Header from '../Header';
import TableHeaderRow from '../TableHeaderRow';
import Colgroup from '../Colgroup';
import GridRow from '../Row';
import HeaderRow from '../HeaderRow';
import DataRow from '../DataRow';
import FooterRow, { TFooter } from '../FooterRow';
import ResultsRow, { TResultsPosition } from '../ResultsRow';
import GridRowMixin from './Row';
import EmptyRow from '../EmptyRow';
import { EnumeratorCallback, RecordSet } from 'Types/collection';
import {
    INavigationOptionValue,
    INavigationSourceConfig,
} from 'Controls/interface';
import { create } from 'Types/di';
import { IGridAbstractColumn } from './../interface/IGridAbstractColumn';
import {
    ColumnsEnumerator,
    IColumnsEnumerable,
    IColumnsEnumerator,
} from './../ColumnsEnumerator';
import { Logger } from 'UI/Utils';
import Indicator from '../Indicator';
import Trigger from '../Trigger';
import type { TGetRowPropsCallback } from 'Controls/gridReact';
import type { ISelectorsProps } from 'Controls/columnScrollReact';

export type THeaderVisibility = 'visible' | 'hasdata';
export type TResultsVisibility = 'visible' | 'hasdata' | 'hidden';

export interface ISortItem {
    [p: string]: string;
}

export type TEditArrowVisibilityCallback = (item: EntityModel) => boolean;

export type TColspanCallbackResult = number | 'end';

export type TColspanCallback = (
    item: EntityModel,
    column: IColumn,
    columnIndex: number,
    isEditing: boolean
) => TColspanCallbackResult;

export type TResultsColspanCallback = (
    column: IColumn,
    columnIndex: number
) => TColspanCallbackResult;

export type TColumnScrollViewMode = IScrollBarOptions['mode'] | 'unaccented';

export { IGridAbstractColumn as IEmptyTemplateColumn };

export const ERROR_MSG = {
    INVALID_STICKY_COLUMNS_COUNT_VALUE:
        'Неверное значение опции stickyColumnsCount! ' +
        'Значение опции stickyColumnsCount должно быть меньше чем количество колонок в таблице. ' +
        'Должна быть хотябы одна скроллируемая колонка.',
};

export interface IOptions extends ICollectionOptions {
    columns: TColumns;
    // TODO: Написать интерфейс и доку для TFooter
    footer?: TFooter;
    footerTemplate?: TemplateFunction;
    header?: THeader;
    resultsTemplate?: TemplateFunction;
    resultsTemplateOptions?: { [key: string]: unknown };
    resultsPosition?: TResultsPosition;
    headerVisibility?: THeaderVisibility;
    resultsVisibility?: TResultsVisibility;
    ladderProperties?: string[];
    stickyColumn?: {};
    showEditArrow?: boolean;
    colspanCallback?: TColspanCallback;
    resultsColspanCallback?: TResultsColspanCallback;
    editArrowVisibilityCallback?: TEditArrowVisibilityCallback;
    columnScroll?: boolean;
    columnScrollViewMode?: TColumnScrollViewMode;
    stickyColumnsCount?: number;

    /**
     * Ширины колонок сохраненные в конфиге для пользователя.
     * Используется, если включен ресайзер ширин колонок.
     */
    columnsWidths?: string[];
    /**
     * Видимость ресайзера ширин колонок.
     */
    resizerVisibility?: boolean;
    sorting?: ISortItem[];
    emptyTemplateColumns?: IGridAbstractColumn[];
    columnSeparatorSize?: TColumnSeparatorSize;
    emptyTemplateOptions?: object;
    feature1187930642?: boolean;
}

/**
 * Миксин, который содержит логику отображения таблицы
 * @private
 */
export default abstract class Grid<
    S extends Model = Model,
    T extends GridRowMixin<S> = GridRowMixin<S>
> implements IColumnsEnumerable
{
    readonly '[Controls/_display/grid/mixins/Grid]': boolean;

    protected _$columns: TColumns;
    protected _$columnKeyProperty: string | number;
    protected _$colgroup: Colgroup<S>;
    protected _$header: THeader;
    protected _$headerModel: Header;
    protected _$headerVisibility: THeaderVisibility;
    protected _$multiSelectVisibility: string;
    protected _$results: ResultsRow;
    protected _$ladder: ILadderObject;
    protected _$ladderProperties: string[];
    protected _$stickyColumn: {};
    protected _$resultsPosition: TResultsPosition;
    protected _$resultsVisibility: TResultsVisibility;
    protected _$showEditArrow: boolean;
    protected _$editArrowVisibilityCallback: TEditArrowVisibilityCallback;
    protected _$colspanCallback: TColspanCallback;
    protected _$columnSeparatorSize: TColumnSeparatorSize;
    protected _$resultsColspanCallback: TResultsColspanCallback;
    protected _$resultsTemplate: TemplateFunction;
    protected _$resultsTemplateOptions: { [key: string]: unknown };
    protected _$columnScroll: boolean;
    protected _$newColumnScroll: boolean;
    protected _$columnScrollViewMode: TColumnScrollViewMode;
    protected _$stickyColumnsCount: number;
    protected _$resizerVisibility: boolean;
    protected _$emptyGridRow: EmptyRow;
    protected _$emptyTemplate: TemplateFunction;
    protected _$sorting: ISortItem[];
    protected _$emptyTemplateColumns: IGridAbstractColumn[];
    protected _$colspanGroup: boolean;
    protected _$backgroundStyle: string;
    protected _$rowSeparatorVisibility: TRowSeparatorVisibility;
    protected _$useSpacingColumn: boolean;
    protected _$resizer: boolean;
    protected _$columnsWidths: string[];
    protected _$resizerOffsetCallback: Function;
    private _$getRowProps: TGetRowPropsCallback;

    private _$itemEditorTemplate: TemplateFunction;
    private _$itemEditorTemplateOptions: object;

    protected _isFullGridSupport: boolean = isFullGridSupport();
    protected _footer: FooterRow;
    private _columnsEnumerator: IColumnsEnumerator | IVirtualColumnsEnumerator;

    protected abstract _$emptyTemplateOptions: object;

    protected abstract _$itemActionsPosition: TItemActionsPosition;
    protected _$columnScrollReact: boolean;
    protected _$columnScrollSelectors: ISelectorsProps;

    protected constructor(options: IOptions) {
        const supportLadder = GridLadderUtil.isSupportLadder(
            this._$ladderProperties
        );
        if (supportLadder) {
            this._prepareLadder(this._$ladderProperties, this._$columns);
        }

        if (this._headerIsVisible(options.header, this._$headerVisibility)) {
            this._initializeHeader(options);
        }
        if (this._resultsIsVisible()) {
            this._initializeResults(options);
        }
        if (!this.isFullGridSupport()) {
            this._initializeColgroup(options);
        }

        if (this._$emptyTemplate || this._$emptyTemplateColumns) {
            this._initializeEmptyRow();
        }
        if (supportLadder) {
            this._updateItemsLadder();
        }
    }

    setColumnsWidths(columnsWidths: string[]): void {
        this._$columnsWidths = columnsWidths;
        this._$headerModel.setColumnsWidths(columnsWidths);
        this._nextVersion();
    }

    getGridColumnsConfig(): TColumns {
        return this._$columns;
    }

    /**
     * Возвращает массив ширин всех колонок.
     * Включая колонку с чекбоксом, лесенку, экшины и т.д.
     */
    getColumnWidths(isOnlyFixedColumns: boolean = false): string[] {
        const columns = !isOnlyFixedColumns
            ? this.getGridColumnsConfig()
            : this.getGridColumnsConfig().filter((_, index) => {
                  return index < (this.getStickyColumnsCount() || 1);
              });

        const columnWidths: string[] = columns.map((config, index) => {
            if (this._$columnsWidths && this._$columnsWidths[index]) {
                return this._$columnsWidths[index];
            }

            if (this.isFullGridSupport() && config.width) {
                return config.width;
            }

            if (
                !this.isFullGridSupport() &&
                (config.compatibleWidth || config.width)
            ) {
                return config.compatibleWidth || config.width;
            }

            return GridLayoutUtil.getDefaultColumnWidth();
        });

        if (this.hasResizer()) {
            columnWidths.splice(this.getStickyColumnsCount() || 1, 0, '0px');
        }

        // Во время днд отключаем лесенку, а контент отображаем принудительно с помощью visibility: visible
        if (this.isFullGridSupport() && !this.isDragging()) {
            const ladderStickyColumn = this.getStickyColumn();
            if (ladderStickyColumn) {
                if (ladderStickyColumn.property.length === 2) {
                    columnWidths.splice(1, 0, '0px');
                }
                columnWidths.unshift('0px');
            }
        }

        if (this.hasMultiSelectColumn()) {
            columnWidths.unshift('max-content');
        }

        // Дополнительная колонка для отображения застиканных операций над записью при горизонтальном скролле.
        if (this.hasItemActionsSeparatedCell()) {
            columnWidths.push('0px');
        }

        return columnWidths;
    }

    getHeaderConfig(): THeader {
        return this._$header;
    }

    getColgroup(): Colgroup<S> {
        return this._$colgroup;
    }

    getHeader(): Header {
        if (
            !this._$headerModel &&
            this._headerIsVisible(this._$header, this._$headerVisibility)
        ) {
            this._initializeHeader({
                header: this._$header,
                columns: this._$columns,
                backgroundStyle: this._$backgroundStyle,
                columnSeparatorSize: this._$columnSeparatorSize,
                sorting: this._$sorting,
                multiSelectVisibility: this._$multiSelectVisibility,
                hasMoreDataUp: this.hasMoreDataUp(),
                columnsWidths: this._$columnsWidths,
            } as unknown as IOptions);
        }

        return this._$headerModel;
    }

    hasHeader(): boolean {
        return !!this._$headerModel;
    }

    getEmptyGridRow(): EmptyRow {
        return this._$emptyGridRow;
    }

    getColumnsToRecalcWidth(): { key: string | number; className?: string }[] {
        return (
            this.getColumnsEnumerator() as HScrollColumnsEnumerator
        ).getColumnsToRecalcWidth();
    }

    hasSpacingColumn(): boolean {
        return this._$useSpacingColumn;
    }

    hasResizer(): boolean {
        const hasResizerByOptions =
            this._$resizerVisibility &&
            (this.hasNewColumnScroll() || this.hasColumnScroll());
        const hasEnoughColumns =
            this.getGridColumnsConfig() &&
            this.getGridColumnsConfig().length > this.getStickyColumnsCount();
        return hasResizerByOptions && hasEnoughColumns;
    }

    getColumnsEnumerator(): IColumnsEnumerator {
        if (!this._columnsEnumerator) {
            this._columnsEnumerator = new ColumnsEnumerator(this);
        }
        return this._columnsEnumerator as IColumnsEnumerator;
    }

    setColumnsEnumerator(enumerator: IColumnsEnumerator): void {
        if (this._columnsEnumerator === enumerator) {
            return;
        }

        this._columnsEnumerator = enumerator;

        this._updateItemsProperty(
            'setColumnsEnumerator',
            enumerator,
            'setColumnsEnumerator'
        );

        [
            this.getColgroup(),
            this.getHeader(),
            this.getResults(),
            this.getFooter(),
            this.getEmptyGridRow(),
        ].forEach((gridUnit) => {
            gridUnit?.setColumnsEnumerator(enumerator);
        });
    }

    getSourceColumnIndex(index: number): number {
        if (
            this._columnsEnumerator &&
            (this._columnsEnumerator as IVirtualColumnsEnumerator)
                .IVirtualColumnsEnumerator
        ) {
            return (
                this._columnsEnumerator as IVirtualColumnsEnumerator
            ).getColumnIndexByVirtualIndex(index);
        }
        return index;
    }

    getColumnsCount(): number {
        return this._$columns ? this._$columns.length : 0;
    }

    getColumnIndexByKey(key: string | number): number {
        if (this._$columns && typeof this._$columnKeyProperty === 'string') {
            return this._$columns.findIndex((column) => {
                return column[this._$columnKeyProperty] === key;
            });
        } else {
            return -1;
        }
    }

    getColumnKeyProperty(): string | number {
        return this._$columnKeyProperty;
    }

    setEmptyTemplateOptions(options: object): void {
        this.getEmptyGridRow()?.setRowTemplateOptions(options);
    }

    setFooter(options: IOptions): void {
        const footerModel = this.getFooter();
        if (!options.footerTemplate && !options.footer) {
            this._footer = null;
        } else if (footerModel) {
            footerModel.setRowTemplate(options.footerTemplate);
            footerModel.setColumnsConfig(options.footer);
        } else {
            this._footer = this._initializeFooter({
                multiSelectVisibility: this._$multiSelectVisibility,
                footerTemplate: options.footerTemplate,
                footer: options.footer,
                columns: options.columns,
                backgroundStyle: this._$backgroundStyle,
                columnSeparatorSize: this._$columnSeparatorSize,
            } as unknown as IOptions);
        }

        this._nextVersion();
    }

    setGetRowPropsCallback(getRowProps: TGetRowPropsCallback): void {
        if (this._$getRowProps !== getRowProps) {
            this._$getRowProps = getRowProps;
            this._updateItemsProperty(
                'setGetRowPropsCallback',
                getRowProps,
                '[Controls/_display/grid/DataRow]'
            );
            this._nextVersion();
        }
    }

    getResults(): ResultsRow {
        if (!this._$results && this._resultsIsVisible()) {
            this._initializeResults({
                columns: this._$columns,
                multiSelectVisibility: this._$multiSelectVisibility,
                resultsTemplate: this._$resultsTemplate,
                resultsTemplateOptions: this._$resultsTemplateOptions,
                resultsPosition: this._$resultsPosition,
                backgroundStyle: this._$backgroundStyle,
                columnSeparatorSize: this._$columnSeparatorSize,
                resultsColspanCallback: this._$resultsColspanCallback,
            });
        }
        return this._$results;
    }

    hasResults(): boolean {
        return !!this.getResults();
    }

    getResultsPosition(): TResultsPosition {
        return this._$resultsPosition;
    }

    setColspanCallback(colspanCallback: TColspanCallback): void {
        if (this._$colspanCallback === colspanCallback) {
            return;
        }

        this._$colspanCallback = colspanCallback;
        this._updateItemsProperty(
            'setColspanCallback',
            this._$colspanCallback,
            'setColspanCallback'
        );
        this._nextVersion();
    }

    setResultsColspanCallback(
        resultsColspanCallback: TResultsColspanCallback
    ): void {
        this._$resultsColspanCallback = resultsColspanCallback;
        const results = this.getResults();
        if (results) {
            results.setColspanCallback(resultsColspanCallback);
        }
        this._nextVersion();
    }

    setColspanGroup(colspanGroup: boolean): void {
        if (this._$colspanGroup !== colspanGroup) {
            this._$colspanGroup = colspanGroup;
            const wasItemsUpdated = this._updateItemsProperty(
                'setColspanGroup',
                colspanGroup,
                '[Controls/_display/grid/GroupRow]'
            );
            // Не обновляем и не перестраиваем таблицу, если нет элементов у которых обновилось свойство,
            // от которого зависит визуальное отображение.
            if (wasItemsUpdated) {
                this._nextVersion();
            }
        }
    }

    getColspanGroup(): boolean {
        return this._$colspanGroup;
    }

    getColspanCallback(): TColspanCallback {
        return this._$colspanCallback;
    }

    isFullGridSupport(): boolean {
        return this._isFullGridSupport;
    }

    protected _shouldAddListTopSeparator(): boolean {
        const isVisibleByHeaderOrFooter =
            this._headerIsVisible(this._$header, this._$headerVisibility) ||
            this._resultsIsVisible() ||
            !!this.getFooter();
        return (
            this._$rowSeparatorVisibility !== 'items' ||
            isVisibleByHeaderOrFooter
        );
    }

    getStickyColumn(): GridLadderUtil.IStickyColumn {
        return GridLadderUtil.getStickyColumn({
            stickyColumn: this._$stickyColumn,
            columns: this._$columns,
        });
    }

    setHeader(header: THeader): void {
        this._$header = header;
        this._nextVersion();
        this._$headerModel = null;
    }

    setHeaderVisibility(headerVisibility: THeaderVisibility): void {
        const isEqualOption = this._$headerVisibility === headerVisibility;
        const currentHeaderVisible = this._headerIsVisible(
            this._$header,
            this._$headerVisibility
        );
        const newHeaderVisible = this._headerIsVisible(
            this._$header,
            headerVisibility
        );
        const headerVisibleChanged =
            !isEqualOption && currentHeaderVisible !== newHeaderVisible;

        this._$headerVisibility = headerVisibility;

        if (headerVisibleChanged) {
            this._$headerModel = null;
            this._nextVersion();
        }
    }

    setColumns(newColumns: TColumns, silent: boolean = true): void {
        const oldColumns = this._$columns;
        this._$columns = newColumns;
        this._nextVersion();

        // Строки данных, группы
        this._updateItemsProperty('setGridColumnsConfig', this._$columns);

        // В столбцах может измениться stickyProperty, поэтому нужно пересчитать ladder
        // Проверка, что точно изменился stickyProperty, это не быстрая операция, т.к. columns - массив объектов
        const supportLadder = GridLadderUtil.isSupportLadder(
            this._$ladderProperties
        );
        if (supportLadder) {
            this._prepareLadder(this._$ladderProperties, this._$columns);
            this._updateItemsLadder();
        }

        [
            this.getColgroup(),
            this.getHeader(),
            this.getResults(),
            this.getFooter(),
            this.getEmptyGridRow(),
            this.getTopIndicator(),
            this.getBottomIndicator(),
            this.getGlobalIndicator(),
            this.getTopTrigger(),
            this.getBottomTrigger(),
        ].forEach((gridUnit) => {
            gridUnit?.setGridColumnsConfig(this._$columns);
        });

        if (!silent) {
            this._notify('onColumnsConfigChanged', oldColumns, this._$columns);
        }
    }

    setLadderProperties(ladderProperties: string[]): void {
        if (this._$ladderProperties !== ladderProperties) {
            this._$ladderProperties = ladderProperties;
            this._nextVersion();

            const supportLadder = GridLadderUtil.isSupportLadder(
                this._$ladderProperties
            );
            if (supportLadder) {
                this._prepareLadder(this._$ladderProperties, this._$columns);
                this._updateItemsLadder();
            }
            this._getItems().forEach((item) => {
                item.resetColumns();
            });
        }
    }

    setSorting(sorting: ISortItem[]): void {
        this._$sorting = sorting;
        this._nextVersion();
        if (this.hasHeader()) {
            this.getHeader().setSorting(sorting);
        }
    }

    editArrowIsVisible(item: EntityModel): boolean {
        if (!this._$editArrowVisibilityCallback) {
            return this._$showEditArrow;
        }
        return this._$editArrowVisibilityCallback(item);
    }

    setColumnSeparatorSize(columnSeparatorSize: TColumnSeparatorSize): void {
        this._$columnSeparatorSize = columnSeparatorSize;
        this._nextVersion();

        const header = this.getHeader();
        if (header) {
            header.setColumnSeparatorSize(columnSeparatorSize);
        }
        if (this.getEmptyGridRow()) {
            this.getEmptyGridRow().setColumnSeparatorSize(columnSeparatorSize);
        }
        this._updateItemsProperty(
            'setColumnSeparatorSize',
            this._$columnSeparatorSize,
            'setColumnSeparatorSize'
        );
    }

    // TODO удалить после https://online.sbis.ru/opendoc.html?guid=76c1ba00-bfc9-4eb8-91ba-3977592e6648
    getLadderProperties(): string[] {
        return this._$ladderProperties;
    }

    protected _initializeEmptyRow(): void {
        this._$emptyGridRow = new EmptyRow({
            owner: this,
            columnsConfig: this._$emptyTemplateColumns,
            columnSeparatorSize: this._$columnSeparatorSize,
            gridColumnsConfig: this._$columns,
            rowTemplate: this._$emptyTemplate,
            rowTemplateOptions: this._$emptyTemplateOptions,
            multiSelectVisibility: this._$multiSelectVisibility,
            roundBorder: this._$roundBorder,
        });
    }

    setEmptyTemplateColumns(emptyTemplateColumns: IGridAbstractColumn[]): void {
        this._$emptyTemplateColumns = emptyTemplateColumns;
        this._nextVersion();
        if (this._$emptyGridRow) {
            this._$emptyGridRow.setColumnsConfig(emptyTemplateColumns);
        } else {
            this._initializeEmptyRow();
        }
    }

    protected _prepareLadder(
        ladderProperties: string[],
        columns: TColumns
    ): void {
        this._$ladder = GridLadderUtil.prepareLadder({
            columns,
            ladderProperties,
            startIndex: this.getStartIndex(),
            stopIndex: this.getStopIndex(),
            display: this,
        });
    }

    protected _updateItemsLadder(): void {
        this.each((item: GridRowMixin<S>, index: number) => {
            let ladder;
            let stickyLadder;
            if (this._$ladder) {
                if (this._$ladder.ladder) {
                    ladder = this._$ladder.ladder[index];
                }
                if (this._$ladder.stickyLadder) {
                    stickyLadder = this._$ladder.stickyLadder[index];
                }
            }
            if (item.LadderSupport) {
                item.updateLadder(ladder, stickyLadder);
            }
        });
    }

    protected _headerIsVisible(
        header: THeader,
        headerVisibility: THeaderVisibility
    ): boolean {
        const hasHeader = header && header.length;
        return (
            hasHeader && (headerVisibility === 'visible' || this.getCount() > 0)
        );
    }

    setResultsPosition(resultsPosition: TResultsPosition): void {
        if (this._$resultsPosition !== resultsPosition) {
            this._$resultsPosition = resultsPosition;
            if (!this._$resultsPosition) {
                this._$results = null;
            }
            this._nextVersion();
        }
    }

    setResultsVisibility(resultsVisibility: TResultsVisibility): void {
        if (this._$resultsVisibility === resultsVisibility) {
            return;
        }

        this._$results = null;
        this._$resultsVisibility = resultsVisibility;

        this._nextVersion();
    }

    protected _hasItemsToCreateResults(): boolean {
        return this.getSourceCollection().getCount() > 1;
    }

    protected _resultsIsVisible(): boolean {
        return (
            !!this._$resultsPosition &&
            this._$resultsVisibility !== 'hidden' &&
            (this._$resultsVisibility === 'visible' ||
                this._hasItemsToCreateResults())
        );
    }

    protected _initializeHeader(options: IOptions): void {
        const cOptions = {
            ...options,
            owner: this,
            columnsConfig: options.header,
            gridColumnsConfig: options.columns,
            style: this.getStyle(),
            theme: this.getTheme(),
            resizerOffsetCallback: this._$resizerOffsetCallback,
        };
        const headerModule = this.getHeaderConstructor();
        this._$headerModel = create(headerModule, cOptions);
    }

    getHeaderConstructor(): string {
        return this.isFullGridSupport()
            ? 'Controls/grid:GridHeader'
            : 'Controls/grid:GridTableHeader';
    }

    protected _initializeFooter(options: Partial<IOptions>): FooterRow {
        if (!options.footerTemplate && !options.footer) {
            return;
        }

        return new FooterRow({
            owner: this,
            multiSelectVisibility: options.multiSelectVisibility,
            gridColumnsConfig: options.columns,
            columnsConfig: options.footer,
            rowTemplate: options.footerTemplate,
            rowTemplateOptions: {},
            backgroundStyle: options.backgroundStyle,
            columnSeparatorSize: options.columnSeparatorSize,
            shouldAddFooterPadding: options.itemActionsPosition === 'outside',
            style: this.getStyle(),
            theme: this.getTheme(),
        });
    }

    protected _initializeResults(options: Partial<IOptions>): void {
        const resultsRowClass = this.getResultsConstructor();
        this._$results = new resultsRowClass({
            owner: this,
            multiSelectVisibility: options.multiSelectVisibility,
            columnsConfig: options.columns,
            gridColumnsConfig: options.columns,
            resultsPosition: options.resultsPosition,
            rowTemplate: options.resultsTemplate,
            rowTemplateOptions: options.resultsTemplateOptions,
            metaResults: this.getMetaResults(),
            backgroundStyle: options.backgroundStyle,
            columnSeparatorSize: options.columnSeparatorSize,
            colspanCallback: options.resultsColspanCallback,
            style: this.getStyle(),
            theme: this.getTheme(),
        });
    }

    protected _initializeColgroup(options: IOptions): void {
        this._$colgroup = new Colgroup({
            owner: this,
            gridColumnsConfig: options.columns,
        });
    }

    protected _handleAfterCollectionItemChange(
        item: S,
        index: number,
        properties?: object
    ): void {
        const collectionItem = this.getItemBySourceItem(item);
        if (collectionItem instanceof DataRow) {
            collectionItem.updateContentsVersion();
        }
        if (this._$feature1187930642 && this._$colspanCallback) {
            collectionItem.resetColumns();
        }
    }

    protected _handleCollectionActionChange(newItems: S[]): void {
        newItems.forEach((item) => {
            const collectionItem = this.getItemBySourceItem(item);
            if (collectionItem instanceof DataRow) {
                collectionItem.updateContentsVersion();
            }
        });
    }

    getResultsConstructor(): typeof ResultsRow {
        return ResultsRow;
    }

    getRowIndex(row: GridRow<S>): number {
        const getHeaderOffset = () => {
            if (this._$headerModel) {
                const { start, end } = this._$headerModel.getBounds().row;
                return end - start;
            } else {
                return 0;
            }
        };

        if (row instanceof TableHeaderRow) {
            return this._$headerModel.getRows().indexOf(row);
        } else if (row instanceof HeaderRow) {
            return 0;
        } else if (row instanceof this.getResultsConstructor()) {
            let index = getHeaderOffset();
            if (this.getResultsPosition() !== 'top') {
                index += this.getCount();
            }
            return index;
        } else if (row instanceof DataRow) {
            let index = getHeaderOffset() + this.getItems().indexOf(row);
            if (this._$results) {
                index++;
            }
            return index;
        } else if (row instanceof FooterRow) {
            let index = getHeaderOffset() + this.getCount();
            if (this._$results) {
                index++;
            }
            return index;
        } else {
            return -1;
        }
    }

    hasMultiSelectColumn(): boolean {
        return (
            this.getMultiSelectVisibility() !== 'hidden' &&
            this.getMultiSelectPosition() !== 'custom'
        );
    }

    setColumnScroll(columnScroll: boolean): void {
        this._$columnScroll = columnScroll;

        [
            this.getColgroup(),
            this.getHeader(),
            this.getResults(),
            this.getFooter(),
            this.getEmptyGridRow(),
        ].forEach((gridUnit) => {
            if (gridUnit) {
                gridUnit.setColumnScroll();
            }
        });
        this._updateItemsProperty(
            'setColumnScroll',
            columnScroll,
            'setColumnScroll'
        );

        this._nextVersion();
    }

    setNewColumnScroll(columnScroll: boolean): void {
        this._$newColumnScroll = columnScroll;
        this._nextVersion();
    }

    hasColumnScroll(): boolean {
        return this._$columnScroll;
    }

    hasNewColumnScroll(): boolean {
        return this._$newColumnScroll;
    }

    getColumnScrollSelectors(): ISelectorsProps {
        return this._$columnScrollSelectors;
    }

    hasColumnScrollReact(): boolean {
        return this._$columnScrollReact;
    }

    getColumnScrollViewMode(): TColumnScrollViewMode {
        return this._$columnScrollViewMode;
    }

    setColumnScrollViewMode(
        newColumnScrollViewMode: TColumnScrollViewMode
    ): void {
        if (this._$columnScrollViewMode !== newColumnScrollViewMode) {
            this._$columnScrollViewMode = newColumnScrollViewMode;
            if (this.getHeader()) {
                this.getHeader().setColumnScrollViewMode(
                    newColumnScrollViewMode
                );
            }
        }
    }

    updateColumnsIndexes(): void {
        this.getItems().forEach((item) => {
            item.updateColumnsIndexes();
        });

        [
            this.getColgroup(),
            this.getHeader(),
            this.getResults(),
            this.getFooter(),
            this.getEmptyGridRow(),
        ].forEach((gridUnit) => {
            if (gridUnit) {
                gridUnit.updateColumnsIndexes();
            }
        });
        this._nextVersion();
        this._notify('columnsIndexesChanged');
    }

    getStickyColumnsCount(): number {
        return this._$stickyColumnsCount;
    }

    setStickyColumnsCount(stickyColumnsCount: number): void {
        if (
            !this.hasNewColumnScroll() &&
            stickyColumnsCount >= this._$columns.length
        ) {
            Logger.error(ERROR_MSG.INVALID_STICKY_COLUMNS_COUNT_VALUE, this);
            return;
        }
        this._$stickyColumnsCount = stickyColumnsCount;
        this._updateItemsProperty(
            'setStickyColumnsCount',
            stickyColumnsCount,
            'setStickyColumnsCount'
        );
        if (this.getHeader()) {
            this.getHeader().setStickyColumnsCount(stickyColumnsCount);
        }

        this._nextVersion();
    }

    hasItemActionsSeparatedCell(): boolean {
        return (
            !!this.getGridColumnsConfig() &&
            (this.isStickyItemActions() ||
                ((this.hasColumnScroll() || this.hasNewColumnScroll()) &&
                    this._$itemActionsPosition !== 'custom'))
        );
    }

    // region ItemEditorTemplate

    getItemEditorTemplate(): TemplateFunction {
        return this._$itemEditorTemplate;
    }

    getItemEditorTemplateOptions(): object {
        return this._$itemEditorTemplateOptions;
    }

    setItemEditorTemplateOptions(options: object): void {
        this._$itemEditorTemplateOptions = options;
        this._getItems().forEach((item) => {
            if (item.isEditing()) {
                item.setRowTemplateOptions(options, false);
            }
        });
        this._nextVersion();
    }

    // endregion ItemEditorTemplate

    getResultsTemplateOptions(): { [key: string]: unknown } {
        return this._$resultsTemplateOptions;
    }

    setResultsTemplateOptions(options: { [key: string]: unknown }): void {
        this._$resultsTemplateOptions = options;
        if (this._$results) {
            this._$results.setRowTemplateOptions(options, false);
            this._nextVersion();
        }
    }

    // region Controls/_display/CollectionItem

    abstract getMetaResults(): EntityModel;

    abstract hasMoreData(): boolean;

    abstract hasMoreDataUp(): boolean;

    abstract getViewIterator(): IViewIterator;

    abstract getStartIndex(): number;

    abstract getStopIndex(): number;

    abstract getRowSeparatorSize(): string;

    abstract getMultiSelectVisibility(): string;

    abstract getMultiSelectPosition(): string;

    abstract getItemBySourceItem(item: S): T;

    abstract getItemBySourceKey(key: string | number): T;

    abstract getSourceCollection(): RecordSet;

    abstract getFooter(): FooterRow;

    abstract each(callback: EnumeratorCallback<T>, context?: object): void;

    abstract getNavigation(): INavigationOptionValue<INavigationSourceConfig>;

    abstract getCount(): number;

    abstract getStyle(): string;

    abstract getTheme(): string;

    abstract getItems(): T[];

    abstract isDragging(): boolean;

    abstract isStickyItemActions(): boolean;

    abstract getTopIndicator(): Indicator;
    abstract getGlobalIndicator(): Indicator;
    abstract getBottomIndicator(): Indicator;
    abstract getTopTrigger(): Trigger;
    abstract getBottomTrigger(): Trigger;

    protected abstract _nextVersion(): void;

    protected abstract _getItems(): T[];

    protected abstract _updateItemsProperty(
        updateMethodName: string,
        newPropertyValue: any,
        conditionProperty?: string,
        silent?: boolean
    ): boolean;

    // endregion
}

Object.assign(Grid.prototype, {
    '[Controls/_display/grid/mixins/Grid]': true,
    _indicatorModule: 'Controls/grid:Indicator',
    _triggerModule: 'Controls/grid:Trigger',
    _$displayProperty: null,
    _$columns: null,
    _$columnsWidths: null,
    _$getRowProps: null,
    _$resizerOffsetCallback: null,
    _$header: null,
    _$headerVisibility: 'hasdata',
    _$resultsVisibility: 'hasdata',
    _$resultsPosition: null,
    _$ladderProperties: null,
    _$stickyColumn: null,
    _$showEditArrow: false,
    _$editArrowVisibilityCallback: null,
    _$colspanCallback: null,
    _$resultsColspanCallback: null,
    _$columnSeparatorSize: null,
    _$resultsTemplate: null,
    _$resultsTemplateOptions: null,
    _$colspanGroup: true,
    _$columnScroll: false,
    _$newColumnScroll: false,
    _$rowSeparatorVisibility: 'all',
    _$ladderMode: 'visibility',
    _$columnScrollViewMode: 'scrollbar',
    _$stickyColumnsCount: 0,
    _$resizerVisibility: false,
    _$sorting: null,
    _$emptyTemplateColumns: null,
    _$itemEditorTemplate: null,
    _$itemEditorTemplateOptions: null,
    _$columnKeyProperty: null,
    _$useSpacingColumn: false,
    _$resizer: false,
    _$feature1187930642: false,
    _$columnScrollSelectors: null,
    _$columnScrollReact: null,
});
