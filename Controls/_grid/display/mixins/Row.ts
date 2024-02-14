/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import { TemplateFunction } from 'UI/Base';
import { create } from 'Types/di';
import { isEqual } from 'Types/object';
import { Model as EntityModel, Model } from 'Types/entity';
import { IColspanParams, IColumn, TColumns, TColumnSeparatorSize } from '../interface/IColumn';
import { THeader } from '../interface/IHeaderCell';
import {
    Collection,
    ICollectionItemOptions as IBaseOptions,
    IEditingConfig,
    ILadderConfig,
    IStickyLadderConfig,
    TLadderElement,
} from 'Controls/display';
import type { StickyVerticalPosition } from 'Controls/stickyBlock';
import Cell, { IOptions as ICellOptions } from '../Cell';
import type { TResultsPosition } from '../interface/IGridControl';
import StickyLadderCell from '../StickyLadderCell';
import CheckboxCell from '../CheckboxCell';
import ItemActionsCell from './../ItemActionsCell';
import { TColspanCallback, TColspanCallbackResult, TColumnScrollViewMode } from './Grid';
import { DRAG_SCROLL_JS_SELECTORS } from 'Controls/columnScroll';
import { IRoundBorder, TBackgroundStyle } from 'Controls/interface';
import DataCell from '../DataCell';
import type { IRowProps, TGetRowPropsCallback, IRowComponentProps } from 'Controls/gridReact';
import type { IItemActionsHandler, IItemEventHandlers } from 'Controls/baseList';
import type { IGridSelectors } from 'Controls/gridColumnScroll';
import { getRowComponentProps } from 'Controls/_grid/display/ReactRenderUtils';

const DEFAULT_GRID_ROW_TEMPLATE = 'Controls/grid:ItemTemplate';

export interface IItemTemplateParams {
    highlightOnHover?: boolean;
    cursor?: 'default' | 'pointer';
    showItemActionsOnHover?: boolean;
    hoverBackgroundStyle?: TBackgroundStyle;

    // Deprecated, use cursor
    clickable?: boolean;
    style?: string;
}

export interface IInitializeColumnsOptions {
    prepareStickyLadderCellsStrategy?: 'add' | 'colspan' | 'offset';
    shouldAddMultiSelectCell?: boolean;
    shouldAddSpacingCell?: boolean;
    addEmptyCellsForStickyLadder?: boolean;
    colspanStrategy?: 'skipColumns' | 'consistently' | 'manual';
    extensionCellsConstructors?: {
        stickyLadderCell?: new () => object;
        multiSelectCell?: new () => object;
        separatedActionsCell?: new () => object;
    };
}

export interface IOptions<T extends Model = Model> extends IBaseOptions<T> {
    columnsConfig: TColumns;
    gridColumnsConfig: TColumns;
    colspanCallback?: TColspanCallback;
    rowTemplate?: TemplateFunction;
    rowTemplateOptions?: object;
    columnSeparatorSize?: TColumnSeparatorSize;
    colspanGroup?: boolean;
    hasStickyGroup?: boolean;
    itemActionsPosition?: 'inside' | 'outside' | 'custom';
    ladderMode?: 'visibility' | 'display';
    useSpacingColumn?: boolean;
    getRowProps?: TGetRowPropsCallback;
}

type TCellsIteratorCallback = (cell: Cell, index: number) => void;
export type TCellsIterator = (callback: TCellsIteratorCallback) => void;

/**
 * Миксин, который содержит логику отображения строки в таблице
 * @private
 */
export default abstract class Row<T extends Model = Model> {
    protected _$owner: Collection<T>;
    protected _cellModule: string;

    protected _$columnItems: Cell[];
    protected _$colspanCallback: TColspanCallback;
    protected _$ladder: TLadderElement<ILadderConfig>;
    protected _$stickyLadder: TLadderElement<IStickyLadderConfig>;
    protected _$columnSeparatorSize: TColumnSeparatorSize;
    protected _$rowSeparatorSize: string;

    protected _$rowTemplate: TemplateFunction;
    protected _$rowTemplateOptions: object;
    protected _$columnsConfig: TColumns;
    protected _$gridColumnsConfig: TColumns;
    protected _$itemActionsPosition: 'inside' | 'outside' | 'custom';
    protected _$ladderMode: 'visibility' | 'display';
    protected _$backgroundStyle: TBackgroundStyle;
    protected _$hoverBackgroundStyle: TBackgroundStyle;
    protected _$isBottomSeparatorEnabled: boolean;
    protected _$isTopSeparatorEnabled: boolean;
    protected _$isTopSeparatorEnabledReact: boolean;
    protected _$isBottomSeparatorEnabledReact: boolean;
    protected _$roundBorder: IRoundBorder;
    protected _savedColumns: TColumns;
    protected _$useSpacingColumn: boolean;

    private readonly _cellsIterator: TCellsIterator;
    protected _rowProps: IRowProps | null;
    private _$getRowProps: TGetRowPropsCallback;

    protected constructor(options?: IOptions<T>) {
        Row.initMixin(this, options);
    }

    static initMixin<T>(instance, options?: IOptions<T>) {
        instance._rowProps = null;

        if (instance._$rowTemplate) {
            if (options.columns) {
                instance._savedColumns = options.columns;
            }

            instance._$columnsConfig = [
                {
                    template: instance._$rowTemplate,
                    templateOptions: instance._$rowTemplateOptions,
                },
            ];
        }

        instance._cellsIterator = (callback: TCellsIteratorCallback) => {
            const columns = instance.getColumns();

            if (!columns || !columns.length) {
                return;
            }

            instance.getColumns().forEach((...args: Parameters<TCellsIteratorCallback>) => {
                if (!args[0].isHidden()) {
                    callback(...args);
                }
            });
        };

        instance._updateRowProps();
    }

    // region RowProps

    getRowComponentProps(
        handlers?: IItemEventHandlers,
        actionHandlers?: IItemActionsHandler
    ): IRowComponentProps {
        return getRowComponentProps(this._rowProps || {}, this, handlers, actionHandlers);
    }

    setGetRowPropsCallback(getRowProps: TGetRowPropsCallback): void {
        this._$getRowProps = getRowProps;
        this._updateRowProps();
        this._nextVersion();
    }

    protected _updateRowProps(): void {
        this._rowProps =
            typeof this._$getRowProps === 'function'
                ? this._$getRowProps(this.getContents())
                : null;
    }

    // endregion RowProps

    getDefaultTemplate(): string {
        return DEFAULT_GRID_ROW_TEMPLATE;
    }

    getItemSpacing(): { left: string; right: string; row: string } {
        return {
            left: this._$owner.getLeftPadding().toLowerCase(),
            right: this._$owner.getRightPadding().toLowerCase(),
            row: this._$owner.getTopPadding().toLowerCase(),
        };
    }

    shouldWrapInScrollGroup(isStickied?: boolean): boolean {
        return isStickied !== false && this.isSticked() && this.isFullGridSupport();
    }

    protected _setVerticalSeparatorEnabledState(
        direction: 'Top' | 'Bottom',
        isReact: boolean,
        state: boolean
    ): boolean {
        // _$isTopSeparatorEnabled, _$isBottomSeparatorEnabled.
        if (this[`_$is${direction}SeparatorEnabled${isReact ? 'React' : ''}`] !== state) {
            this[`_$is${direction}SeparatorEnabled${isReact ? 'React' : ''}`] = state;
            this._reinitializeColumns();
            this._nextVersion();
            return true;
        }
        return false;
    }

    // region Аспект "Стилевое оформление. Классы и стили строки"
    getItemClasses(params: IItemTemplateParams): string {
        let itemClasses =
            `${this._getBaseItemClasses(params)} ` +
            `${this.getCursorClasses(params.cursor, params.clickable)} ` +
            `${this._getItemHighlightClasses(
                params.highlightOnHover,
                params.hoverBackgroundStyle
            )}`;

        if (params.showItemActionsOnHover !== false) {
            itemClasses += ' controls-ListView__item_showActions';
        }
        if (this.getMultiSelectVisibility() !== 'hidden') {
            itemClasses += ' controls-ListView__item_showCheckbox';
        }
        return itemClasses;
    }

    protected _getBaseItemClasses(params: IItemTemplateParams): string {
        let classes = `controls-ListView__itemV controls-Grid__row controls-Grid__row_${this.getStyle()}`;
        if (params.highlightOnHover !== false) {
            classes += ' controls-ListView__item_highlightOnHover';
        }
        if (this.isEditing()) {
            classes +=
                ' controls-List_DragNDrop__notDraggable js-controls-DragScroll__notDraggable';
            classes += ' js-controls-ListView__item_editing';
        }
        return classes;
    }

    protected _getItemHighlightClasses(
        highlightOnHover?: boolean,
        templateHoverBackgroundStyle?: TBackgroundStyle
    ): string {
        const hoverBackgroundStyle =
            templateHoverBackgroundStyle || this.getHoverBackgroundStyle() || this.getStyle();
        const isCellEditingMode = this.getEditingConfig()?.mode === 'cell';
        if (
            (!isCellEditingMode && highlightOnHover !== false && !this.isEditing()) ||
            (isCellEditingMode && highlightOnHover === true)
        ) {
            return `controls-hover-background-${hoverBackgroundStyle}`;
        }
        return '';
    }

    getMultiSelectClasses(
        backgroundColorStyle: string,
        cursor: string = 'pointer',
        templateHighlightOnHover: boolean = true
    ): string {
        // TODO должно быть super.getMultiSelectPosition, но мы внутри миксина
        const hoverBackgroundStyle = this.getHoverBackgroundStyle();
        const isCellEditingMode = this.getEditingConfig()?.mode === 'cell';
        const isRowEditingMode = this.isEditing() && !isCellEditingMode;

        let classes = 'js-controls-ListView__notEditable controls-List_DragNDrop__notDraggable';
        classes += ` js-controls-ListView__checkbox ${DRAG_SCROLL_JS_SELECTORS.NOT_DRAG_SCROLLABLE}`;
        classes += ' controls-CheckboxMarker_inList';
        if (this.isDragged()) {
            classes += ' controls-ListView__itemContent';
        }

        if (this.getMultiSelectVisibility() === 'onhover' && this.isSelected() === false) {
            classes += ' controls-ListView__checkbox-onhover';
        }

        if (
            (!isRowEditingMode && templateHighlightOnHover !== false && !isCellEditingMode) ||
            (templateHighlightOnHover === true && isCellEditingMode)
        ) {
            classes += ` controls-Grid__item_background-hover_${hoverBackgroundStyle}`;
            classes += ` controls-hover-background-${hoverBackgroundStyle}`;
        }

        classes += ' controls-GridView__checkbox controls-Grid__border-radius-inherit';

        if (!this.shouldWrapInScrollGroup()) {
            classes += ' controls-GridView__checkbox_relative';
        }

        classes += ` controls-GridView__checkbox_position-${this.getOwner().getMultiSelectPosition()}`;

        classes += this.getFadedClass();
        classes += this._getCheckboxCellPaddingClasses();

        return classes;
    }

    private _getCheckboxCellPaddingClasses(): string {
        const topPadding = this.getTopPadding();
        const bottomPadding = this.getBottomPadding();
        const style = this.getStyle();

        return (
            ` controls-Grid__row-checkboxCell_${style}_rowSpacingTop_${topPadding}` +
            ` controls-Grid__row-cell_${style}_rowSpacingBottom_${bottomPadding} `
        );
    }

    // endregion

    // region Аспект "Лесенка"
    getStickyLadderCellsCount(): number {
        const stickyProperties = this.getStickyLadderProperties(this._$gridColumnsConfig[0]);
        return stickyProperties ? stickyProperties.length : 0;
    }

    getStickyLadderProperties(column: IColumn): string[] {
        let stickyProperties = column && column.stickyProperty;
        if (stickyProperties && !(stickyProperties instanceof Array)) {
            stickyProperties = [stickyProperties];
        }
        return stickyProperties as string[];
    }

    shouldDrawLadderContent(ladderProperty: string, stickyProperty: string): boolean {
        const stickyLadder = this.getStickyLadder();
        const stickyProperties = this.getStickyLadderProperties(this._$columnsConfig[0]);

        if (!stickyLadder) {
            return true;
        }

        const index = stickyProperties.indexOf(stickyProperty);
        const hasMainCell = !!stickyLadder[stickyProperties[0]].ladderLength;

        const isFirstCell = (index === 0 && hasMainCell) || (index === 1 && !hasMainCell);
        if (
            !this.getOwner().getItemsDragNDrop() &&
            stickyProperty &&
            ladderProperty &&
            stickyProperty !== ladderProperty &&
            isFirstCell
        ) {
            return false;
        }
        return true;
    }

    getLadderWrapperClasses(ladderProperty: string, stickyProperty: string): string {
        let ladderWrapperClasses = 'controls-Grid__row-cell__ladder-content';
        const ladder = this.getLadder();
        const stickyLadder = this.getStickyLadder();
        const stickyProperties = this.getStickyLadderProperties(this._$columnsConfig[0]);
        const index = stickyProperties?.indexOf(stickyProperty);
        const hasMainCell = stickyLadder && !!stickyLadder[stickyProperties[0]].ladderLength;

        if (
            stickyProperty &&
            ladderProperty &&
            stickyProperty !== ladderProperty &&
            ((index === 1 && !hasMainCell) || (index === 0 && hasMainCell))
        ) {
            ladderWrapperClasses += ' controls-Grid__row-cell__ladder-content_displayNoneForLadder';
        }

        if (stickyProperty === ladderProperty && index === 1 && hasMainCell) {
            ladderWrapperClasses += ' controls-Grid__row-cell__ladder-content_additional-with-main';
        }

        const isVisibleForLadder =
            !ladder ||
            !ladder[ladderProperty] ||
            ((stickyProperty === ladderProperty || !stickyProperty) &&
                ladder[ladderProperty].ladderLength >= 1);
        if (!isVisibleForLadder) {
            if (this._$ladderMode === 'visibility') {
                ladderWrapperClasses += ' controls-Grid__row-cell__ladder-content_hiddenForLadder';
            } else if (this._$ladderMode === 'display') {
                ladderWrapperClasses +=
                    ' controls-Grid__row-cell__ladder-content_displayNoneForLadder';
            }
        }
        return ladderWrapperClasses;
    }

    protected _getStickyLadderStyle(column: IColumn, stickyProperty: string): string {
        const stickyLadder = this.getStickyLadder();
        return stickyLadder && stickyLadder[stickyProperty].headingStyle;
    }

    updateLadder(
        newLadder: TLadderElement<ILadderConfig>,
        newStickyLadder: TLadderElement<IStickyLadderConfig>
    ): void {
        if (this._$ladder !== newLadder) {
            const isLadderChanged = !isEqual(this._$ladder, newLadder);
            const isStickyLadderChanged = !isEqual(this._$stickyLadder, newStickyLadder);

            if (isLadderChanged || isStickyLadderChanged) {
                this._$ladder = newLadder;
                this._$stickyLadder = newStickyLadder;
                this._reinitializeColumns();
                this._notify('ladderChange', newLadder);
            }
        }
    }

    getLadder(): TLadderElement<ILadderConfig> {
        return this._$ladder;
    }

    getStickyLadder(): TLadderElement<IStickyLadderConfig> {
        return this._$stickyLadder;
    }

    isVisibleForLadder(property: string | number | symbol): boolean {
        const ladder = this.getLadder();
        return !ladder || !ladder[property] || ladder[property].ladderLength >= 1;
    }

    // endregion

    // region Аспект "Ячейки. Создание, обновление, перерисовка, colspan и т.д."
    protected _processStickyLadderCells(
        addEmptyCellsForStickyLadder: boolean = false,
        stickyLadderCellCtor: new (options) => StickyLadderCell = StickyLadderCell
    ): void {
        // todo Множественный stickyProperties можно поддержать здесь:
        const stickyLadderProperties = this.getStickyLadderProperties(
            this.getGridColumnsConfig()[0]
        );
        const stickyLadderCellsCount =
            (stickyLadderProperties && stickyLadderProperties.length) || 0;

        // Создание пустых ячеек, для строк, которые никогда не отображают лесенку, но обязаны выводить пустые ячейки
        // для поддержания работоспособности грида
        if (addEmptyCellsForStickyLadder) {
            if (stickyLadderCellsCount) {
                const params = { owner: this, isLadderCell: true, column: {} };
                this._$columnItems.splice(
                    1,
                    0,
                    new stickyLadderCellCtor({
                        ...params,
                        column: { ...this.getGridColumnsConfig()[0] },
                    })
                );
                if (stickyLadderCellsCount === 2) {
                    this._$columnItems = [
                        new stickyLadderCellCtor({
                            ...params,
                            column: { ...this.getGridColumnsConfig()[0] },
                        }),
                    ].concat(this._$columnItems);
                }
            }
            return;
        }

        const stickyLadderStyleForFirstProperty =
            stickyLadderProperties &&
            this._getStickyLadderStyle(this.getGridColumnsConfig()[0], stickyLadderProperties[0]);
        const stickyLadderStyleForSecondProperty =
            stickyLadderProperties &&
            stickyLadderProperties.length === 2 &&
            this._getStickyLadderStyle(this.getGridColumnsConfig()[0], stickyLadderProperties[1]);

        if (stickyLadderStyleForSecondProperty || stickyLadderStyleForFirstProperty) {
            this._$columnItems[0].setHiddenForLadder(true);
        }

        if (stickyLadderStyleForSecondProperty) {
            // Для выравнивания ячейки стики-лесенки подходит только заданная в px ширина колонки.
            let leftOffset =
                this.getGridColumnsConfig()[0].width.match('(([1-9][0-9]*px)|0px)')?.[0];
            if (this.shouldCalcOuterPadding(this.getGridColumnsConfig()[0].width)) {
                leftOffset = `calc(0px - var(--outer_padding, 0px) - ${leftOffset})`;
            } else {
                leftOffset = `-${leftOffset}`;
            }
            this._$columnItems.splice(
                1,
                0,
                new stickyLadderCellCtor({
                    ...this._getColumnFactoryParams(this.getGridColumnsConfig()[0], 0),
                    owner: this,
                    instanceId: `${this.key}_column_secondSticky`,
                    wrapperStyle: stickyLadderStyleForSecondProperty,
                    contentStyle: { left: leftOffset, right: 0 },
                    stickyProperty: stickyLadderProperties[1],
                    isFixed: this.hasColumnScroll() || this.hasColumnScrollReact(),
                    isPointerEventsDisabled: this._$itemActionsPosition === 'outside',
                    stickyHeaderZIndex: 1,
                })
            );
        } else if (stickyLadderCellsCount === 2) {
            // Заглушка, чтобы были "все" ячейки в строке. Это важно для работы колспана
            this._$columnItems.splice(
                1,
                0,
                new DataCell({
                    column: {},
                    colspan: 1,
                    isHidden: true,
                    owner: this,
                })
            );
        }

        if (stickyLadderStyleForFirstProperty) {
            // Для выравнивания ячейки стики-лесенки подходит только заданная в px ширина колонки.
            let rightOffset =
                this.getGridColumnsConfig()[0].width.match('(([1-9][0-9]*px)|0px)')?.[0];

            if (this.shouldCalcOuterPadding(this.getGridColumnsConfig()[0].width)) {
                rightOffset = `calc(0px - var(--outer_padding, 0px) - ${rightOffset})`;
            } else {
                rightOffset = `-${rightOffset}`;
            }
            this._$columnItems = (
                [
                    new stickyLadderCellCtor({
                        ...this._getColumnFactoryParams(this.getGridColumnsConfig()[0], 0),
                        owner: this,
                        instanceId: `${this.key}_column_firstSticky`,
                        wrapperStyle: stickyLadderStyleForFirstProperty,
                        contentStyle: stickyLadderStyleForSecondProperty
                            ? { left: 0, right: rightOffset }
                            : null,
                        stickyProperty: stickyLadderProperties[0],
                        isFixed: this.hasColumnScroll() || this.hasColumnScrollReact(),
                        isPointerEventsDisabled: this._$itemActionsPosition === 'outside',
                        stickyHeaderZIndex: 2,
                    }),
                ] as Cell[]
            ).concat(this._$columnItems);
        } else if (stickyLadderCellsCount >= 1) {
            // Заглушка, чтобы были "все" ячейки в строке. Это важно для работы колспана
            this._$columnItems = (
                [
                    new DataCell({
                        column: {},
                        colspan: 1,
                        isHidden: true,
                        owner: this,
                    }),
                ] as Cell[]
            ).concat(this._$columnItems);
        }
    }

    shouldCalcOuterPadding(width: string): boolean {
        return (
            this.getLeftPadding() !== 'null' &&
            width.indexOf('px') !== -1 &&
            width.indexOf('minmax') === -1
        );
    }

    getColumns(): Cell[] {
        if (!this._$columnItems) {
            this._initializeColumns();
        }
        return this._$columnItems;
    }

    getStickyGroupPosition(): StickyVerticalPosition {
        if (this.isSticked()) {
            return this.getColumns()[0].getVerticalStickyHeaderPosition();
        }
    }

    getCellsIterator(): TCellsIterator {
        return this._cellsIterator;
    }

    isReactView(): boolean {
        return this.getOwner().isReactView();
    }

    setGridColumnsConfig(columns: TColumns): void {
        this._$gridColumnsConfig = columns;
        this._reinitializeColumns(true);
    }

    getColumnsCount(): number {
        return this.getColumns().length;
    }

    setHoverBackgroundStyle(hoverBackgroundStyle: TBackgroundStyle): void {
        if (this._$hoverBackgroundStyle !== hoverBackgroundStyle) {
            this._$hoverBackgroundStyle = hoverBackgroundStyle;
            this._reinitializeColumns();
        }
    }

    setBackgroundStyle(backgroundStyle: TBackgroundStyle): void {
        this._$backgroundStyle = backgroundStyle;
        this._reinitializeColumns();
    }

    getBackgroundStyle(): TBackgroundStyle {
        return this._$backgroundStyle;
    }

    /**
     * Получить индекс ячейки в строке.
     * @param {Cell} cell - Ячейка таблицы.
     * @param {Boolean} [takeIntoAccountColspans=false] - Учитывать ли колспаны ячеек, расположенных до искомой.
     * @param {Boolean} [takeIntoHiddenColumns=false] - Учитывать ли при расчете индекса скрытые ячейки, расположенные до искомой.
     * @returns {Number} Индекс ячейки в строке.
     */
    getColumnIndex(
        cell: Cell<T, Row<T>>,
        takeIntoAccountColspans: boolean = false,
        takeIntoHiddenColumns: boolean = true
    ): number {
        const columnItems = this.getColumns();
        let columnItemIndexWithColspan = 0;

        // Ищем индекс ячейки, попутно считаем колспаны предыдущих.
        const columnItemIndex = columnItems.findIndex((columnItem) => {
            if (columnItem.config === cell.config) {
                return true;
            }
            columnItemIndexWithColspan += columnItem.getColspan();
            return false;
        });

        // Отлов внутренних ошибок коллекции.
        if (columnItemIndex === -1) {
            throw Error('Fatal error! Expected column missing in columnItems.');
        }

        let result = takeIntoAccountColspans ? columnItemIndexWithColspan : columnItemIndex;

        if (!takeIntoHiddenColumns) {
            let hiddenColumnsCount = 0;
            for (let i = columnItemIndex - 1; i >= 0; i--) {
                hiddenColumnsCount += +columnItems[i].isHidden();
            }
            result -= hiddenColumnsCount;
        }

        return result;
    }

    protected _redrawColumns(target: 'first' | 'last' | 'all'): void {
        if (this._$columnItems) {
            switch (target) {
                case 'first':
                    this._$columnItems[0].nextVersion();
                    break;
                case 'last':
                    this._$columnItems[this.getColumnsCount() - 1].nextVersion();
                    break;
                case 'all':
                    this._$columnItems.forEach((column) => {
                        return column.nextVersion();
                    });
                    break;
            }
        }
    }

    protected _reinitializeColumns(lazy: boolean = false): void {
        if (this._$columnItems) {
            this._$columnItems = null;
            if (!lazy) {
                this._initializeColumns();
            }
        }
        this._nextVersion();
    }

    private _$getColspan(column: IColumn, columnIndex: number): TColspanCallbackResult {
        if (this._$rowTemplate) {
            return 'end';
        }
        return this._getColspan(column, columnIndex);
    }

    protected _getColspan(column: IColumn, columnIndex: number): TColspanCallbackResult {
        const colspanCallback = this._$colspanCallback;
        if (colspanCallback) {
            return colspanCallback(this.getContents(), column, columnIndex, this.isEditing());
        }
        return undefined;
    }

    getColumnsFactory(
        staticOptions?: object
    ): (options: Partial<ICellOptions<T>>) => Cell<T, Row<T>> {
        if (!this._cellModule) {
            throw new Error('Controls/_display/Row:getColumnsFactory can not resolve cell module!');
        }

        const self = this;

        return function (options) {
            return create(self._cellModule, {
                owner: self,
                ...(staticOptions || {}),
                ...options,
                theme: self.getTheme(),
                style: self.getStyle(),
            } as ICellOptions<T>);
        };
    }

    protected _prepareColumnItems(
        columns: IColspanParams[],
        factory: (options: Partial<ICellOptions<T>>) => Cell<T, Row<T>>,
        shouldColspanWithMultiselect: boolean,
        prepareStickyLadderCellsStrategy: IInitializeColumnsOptions['prepareStickyLadderCellsStrategy'],
        skipColumns: boolean = false,
        preventSeparateColspanedRow: boolean = false,
        shouldAddSpacingCell: boolean = true
    ): Cell[] {
        const creatingColumnsParams = [];
        const hasSpacingColumn = this.getOwner().hasSpacingColumn();

        // TODO: Удалить в процессе выполнения задачи.
        //  https://online.sbis.ru/opendoc.html?guid=872a94e3-b3ec-4d02-a244-727eefb4dd9f&client=3
        //  Костыль из за размазанности работы с колонками и отсутствия на них реальных индексов
        //  (индексов по данным, без учета технических колонок).
        // Получить конфиг колонок без конфига колонки-заполнителя справа(spacing column).
        const gridColumnsConfig = this.getGridColumnsConfig();
        let stickyLadderCellsCount = 0;

        for (
            let columnIndex = 0, resultTotalLength = 0;
            columnIndex < columns.length &&
            (skipColumns ? true : resultTotalLength < gridColumnsConfig.length);
            columnIndex++
        ) {
            const column = columns[columnIndex];
            let extraColspanCount = 0;
            let isEndColspan = false;
            stickyLadderCellsCount = 0;
            let colspan = this._$getColspan(column, columnIndex);
            if (colspan === 'end') {
                colspan = gridColumnsConfig.length - columnIndex;
                isEndColspan = true;
            }
            if (this.hasMultiSelectColumn() && shouldColspanWithMultiselect) {
                extraColspanCount++;
                colspan++;
            }

            if (hasSpacingColumn && !shouldAddSpacingCell) {
                colspan++;
            }

            if (
                (prepareStickyLadderCellsStrategy === 'colspan' || colspan > 1) &&
                columnIndex === 0 &&
                this.isFullGridSupport() &&
                !this.getOwner().isDragging()
            ) {
                const stickyLadderProperties = this.getStickyLadderProperties(gridColumnsConfig[0]);
                stickyLadderCellsCount =
                    (stickyLadderProperties && stickyLadderProperties.length) || 0;
                colspan += stickyLadderCellsCount;
            }
            if (skipColumns) {
                if (colspan === 1) {
                    colspan = 0;
                }
                if (colspan) {
                    columnIndex += colspan - 1 - stickyLadderCellsCount;
                }
            } else {
                colspan = colspan || 1;
                resultTotalLength += colspan - extraColspanCount;
            }
            const isFixed =
                this.hasColumnScroll() || this.hasColumnScrollReact()
                    ? (skipColumns ? columnIndex : resultTotalLength - 1) <
                      this.getStickyColumnsCount()
                    : false;
            const isFixedToEnd = this.hasColumnScrollReact()
                ? columns.length - (skipColumns ? columnIndex : resultTotalLength - 1) <=
                  this.getEndStickyColumnsCount()
                : false;
            creatingColumnsParams.push({
                ...this._getColumnFactoryParams(column, columnIndex),
                instanceId: `${this.key}_column_${columnIndex}`,
                colspan: colspan as number,
                isFixed,
                isFixedToEnd,
                isEndColspan,
            });
        }

        if (creatingColumnsParams.length === 1 && this.getGridColumnsConfig().length > 1) {
            creatingColumnsParams[0].isActsAsRowTemplate = true;
            if (this.hasColumnScroll() || this.hasColumnScrollReact()) {
                creatingColumnsParams[0].isFixed = true;

                const hasResizer = this.getOwner().hasResizer();
                if (preventSeparateColspanedRow) {
                    if (hasResizer && this.hasColumnScrollReact()) {
                        creatingColumnsParams[0].colspan++;
                    }
                } else if (hasResizer) {
                    // TODO: Нужно переписать все колспаны на единый механизм,учесть, что в колонках
                    //  строки может быть разрыв, например под ресайзер(['1-2 колонка', '3-4 колонка']).
                    // Скрытая колонка под ресайзер, текущий механизм колспанов не предполагает что в колонках может
                    // быть разрыв. В таких случаях используются скрытые колонки.
                    if (hasResizer) {
                        creatingColumnsParams.push({
                            column: {},
                            colspan: 1,
                            isHidden: true,
                        });
                    }

                    creatingColumnsParams[0].isEndColspan = false;
                    const column = {};
                    creatingColumnsParams.push({
                        ...this._getColumnFactoryParams(column, this.getStickyColumnsCount()),
                        column,
                        colspan: creatingColumnsParams[0].colspan - this.getStickyColumnsCount(),
                        isEndColspan: true,
                    });
                    creatingColumnsParams[0].colspan = this.getStickyColumnsCount();
                }
            }
        }

        // isSingleColspanedCell определяется и ипользуется не так как задумывалась и называется.
        // Флаг должен указывать, что ячейка по своей сути является шаблоном всей строки.
        // При этом не должно играть роли, как прикладной разработчик определил шаблон строки:
        // через rowTemplate или растянув первую ячейку до конца. Сейчас isSingleColspanedCell
        // смотрит на количество колонок не в таблице, а в строке. Флаг стал использоваться неправильно
        // из-за спутаности css классов, сейчас не все классы общие и многие ячейки дублируют логику,
        // например пустое представления. Места использования и css классы будут поправлены по существующей задаче
        // Будет править https://online.sbis.ru/opendoc.html?guid=024784a6-cc47-4d1a-9179-08c897edcf72
        // FIXME: Используйте isActsAsRowTemplate, в случае, если нужно понять, является ли ячейка шаблоном всей строки.
        if (creatingColumnsParams.length === 1 && (this._$rowTemplate || columns.length > 1)) {
            creatingColumnsParams[0].isSingleColspanedCell = true;
            if (this.hasColumnScroll() || this.hasColumnScrollReact()) {
                creatingColumnsParams[0].isFixed = true;
            }

            if (prepareStickyLadderCellsStrategy === 'offset') {
                if (stickyLadderCellsCount === 1) {
                    creatingColumnsParams[0].colspan = creatingColumnsParams[0].colspan - 1;
                    creatingColumnsParams.unshift({
                        isFixed: true,
                        isHidden: true,
                        column: {},
                        colspan: 1,
                    });
                }
                if (stickyLadderCellsCount === 2) {
                    creatingColumnsParams[0].colspan = creatingColumnsParams[0].colspan - 3;
                    creatingColumnsParams.unshift(
                        {
                            isFixed: true,
                            isHidden: true,
                            column: {},
                            colspan: 1,
                        },
                        {
                            isFixed: true,
                            isHidden: true,
                            column: {},
                            colspan: 1,
                        },
                        {
                            isFixed: true,
                            isHidden: true,
                            column: {},
                            colspan: 1,
                        }
                    );
                }
            }
        }

        if (creatingColumnsParams.length > 0) {
            creatingColumnsParams[0].isFirstDataCell = true;
        }

        if (hasSpacingColumn && shouldAddSpacingCell) {
            const column = { editable: false };
            const lastCellParams = creatingColumnsParams[creatingColumnsParams.length - 1];
            creatingColumnsParams.push({
                column,
                instanceId: 'spacing_column',
                ...this._getColumnFactoryParams(column, creatingColumnsParams.length - 1),
                leftSeparatorSize: this._resolveColumnSeparatorSizeForSpacingColumn(
                    lastCellParams.column
                ),
                rightSeparatorSize: null,
            });
        }

        return creatingColumnsParams.map((params) => {
            return factory(params);
        });
    }

    setColumnsConfig(newColumns: TColumns): void {
        if (this._$rowTemplate) {
            // В данный момент строка выводит контент из rowTemplate. Он актуален, перестроение не требуется.
            // Однако, колонки сохраняются, чтобы при сбросе шаблона строки строка перерисовалась по ним.
            if (this._savedColumns !== newColumns) {
                this._savedColumns = newColumns;
                this._reinitializeColumns(true);
            }
        } else {
            if (this._$columnsConfig !== newColumns) {
                this._$columnsConfig = newColumns;
                this._reinitializeColumns(true);
            }
        }
    }

    resetColumns(): void {
        this._$columnItems = null;
        this._nextVersion();
    }

    setColspanCallback(colspanCallback: TColspanCallback): void {
        this._$colspanCallback = colspanCallback;
        this._reinitializeColumns();
    }

    setRoundBorder(roundBorder: IRoundBorder): void {
        if (!isEqual(this._$roundBorder, roundBorder)) {
            this._$roundBorder = roundBorder;
            this._reinitializeColumns();
            this._nextVersion();
        }
    }

    protected _getColumnFactoryParams(
        column: IColumn,
        columnIndex: number
    ): Partial<ICellOptions<T>> {
        return {
            column,
            theme: this.getTheme(),
            style: this.getStyle(),
            rowSeparatorSize: this._$rowSeparatorSize,
            leftSeparatorSize: this._getLeftSeparatorSizeForColumn(column, columnIndex),
            rightSeparatorSize: this._getRightSeparatorSizeForColumn(column, columnIndex),
            backgroundStyle: this._$backgroundStyle,
            isSticked: this.isSticked(),
            shadowVisibility: this.getShadowVisibility(),
            isTopSeparatorEnabled: this._$isTopSeparatorEnabled,
            isBottomSeparatorEnabled: this._$isBottomSeparatorEnabled,
            isTopSeparatorEnabledReact: this._$isTopSeparatorEnabledReact,
            isBottomSeparatorEnabledReact: this._$isBottomSeparatorEnabledReact,
            roundBorder: this._$roundBorder,
            useSpacingColumn: this._$useSpacingColumn,
            directionality: this.getDirectionality(),
        };
    }

    protected _initializeColumns(
        options: IInitializeColumnsOptions = {
            prepareStickyLadderCellsStrategy: 'add',
            shouldAddMultiSelectCell: true,
        }
    ): void {
        const prepareStickyLadderCellsStrategy = options.prepareStickyLadderCellsStrategy || 'add';
        if (this._$columnsConfig) {
            // Заполняем основные ячейки строки (данные), учитывая колспаны.
            this._$columnItems = this._prepareColumnItems(
                this._$columnsConfig,
                this.getColumnsFactory(),
                options.shouldAddMultiSelectCell === false,
                prepareStickyLadderCellsStrategy,
                options.colspanStrategy === 'skipColumns' || options.colspanStrategy === 'manual',
                !!(options.colspanStrategy === 'manual'),
                options.shouldAddSpacingCell !== false
            );

            // Заполняем ячейки для лесенки.
            // TODO: Не работает с колспаннутыми узлами. Нужно чтобы лесенка работала до колспана или сквозь него.
            if (
                prepareStickyLadderCellsStrategy === 'add' &&
                this.isFullGridSupport() &&
                this._$columnItems.length &&
                this._$columnItems[0].getColspan() === 1
            ) {
                this._processStickyLadderCells(
                    options.addEmptyCellsForStickyLadder,
                    options.extensionCellsConstructors?.stickyLadderCell
                );
            }

            // Ячейка под чекбокс множественного выбора.
            if (options.shouldAddMultiSelectCell !== false && this.hasMultiSelectColumn()) {
                const ctor = options.extensionCellsConstructors?.multiSelectCell || CheckboxCell;

                this._$columnItems[0].setLeftSeparatorSize('null', true);
                const columnConfig = {};
                if (this._$columnsConfig?.[0]?.getCellProps) {
                    columnConfig.getCellProps = () => {
                        const cellProps = this._$columnsConfig[0].getCellProps(this.getContents());
                        return {
                            className: cellProps.multiSelectClassName,
                        };
                    };
                }
                this._$columnItems.unshift(
                    new ctor({
                        owner: this,
                        isFixed: true,
                        instanceId: `${this.key}_column_checkbox`,
                        ...this._getColumnFactoryParams(columnConfig, 0),
                        leftSeparatorSize: 'null',
                        rightSeparatorSize: 'null',
                    }) as Cell[]
                );
            }

            // Ячейка под операции над записью при горизонтальном скролле.
            if (this.hasItemActionsSeparatedCell()) {
                const ctor =
                    options.extensionCellsConstructors?.separatedActionsCell || ItemActionsCell;

                this._$columnItems.push(
                    new ctor({
                        owner: this,
                        instanceId: `${this.key}_column_separated-actions`,
                        // FIXME: Ну как же ноль, если это последняя ячейка.
                        ...this._getColumnFactoryParams(null, 0),
                        column: {},
                    })
                );
            }
        }
    }

    // endregion

    setEditingConfig(): void {
        // Хранить конфиг пока нет необходимости до отказа от owner.
        // После отказа, конфиг будет хранится на строке/передаваться в опциях
        this._nextVersion();
    }

    // region TMP. Проброс от owner'a
    hasMultiSelectColumn(): boolean {
        return this._$owner.hasMultiSelectColumn();
    }

    getIndex(): number {
        return this._$owner.getRowIndex(this);
    }

    hasColumnScroll(): boolean {
        return this._$owner.hasColumnScroll();
    }

    setColumnScroll(columnScroll: boolean): void {
        this._reinitializeColumns(true);
    }

    getColumnScrollSelectors(): IGridSelectors {
        return this.getOwner().getColumnScrollSelectors();
    }

    hasColumnScrollReact(): boolean {
        return this.getOwner().hasColumnScrollReact();
    }

    getColumnScrollViewMode(): TColumnScrollViewMode {
        return this._$owner.getColumnScrollViewMode();
    }

    setColumnScrollViewMode(newColumnScrollViewMode: TColumnScrollViewMode): void {
        this._reinitializeColumns(true);
    }

    getStickyColumnsCount(): number {
        return this._$owner.getStickyColumnsCount();
    }

    getEndStickyColumnsCount(): number {
        return this._$owner.getEndStickyColumnsCount();
    }

    setStickyColumnsCount(): void {
        this._reinitializeColumns(true);
    }

    setEndStickyColumnsCount(): void {
        this._reinitializeColumns(true);
    }

    hasItemActionsSeparatedCell(): boolean {
        return this._$owner.hasItemActionsSeparatedCell();
    }

    isFullGridSupport(): boolean {
        return this._$owner.isFullGridSupport();
    }

    getGridColumnsConfig(): TColumns {
        return this._$owner.getGridColumnsConfig();
    }

    getHeaderConfig(): THeader {
        return this._$owner.getHeaderConfig();
    }

    getTopPadding(): string {
        return this._$owner.getTopPadding().toLowerCase();
    }

    getBottomPadding(): string {
        return this._$owner.getBottomPadding().toLowerCase();
    }

    getLeftPadding(): string {
        return this._$owner.getLeftPadding().toLowerCase();
    }

    getRightPadding(): string {
        return this._$owner.getRightPadding().toLowerCase();
    }

    getEditingBackgroundStyle(): string {
        return this._$owner.getEditingBackgroundStyle();
    }

    hasHeader(): boolean {
        return this._$owner.hasHeader();
    }

    hasResults(): boolean {
        return this._$owner.hasResults();
    }

    getResultsPosition(): TResultsPosition {
        return this._$owner.getResultsPosition();
    }

    getSearchValue(): string {
        return this.getOwner().getSearchValue();
    }

    editArrowIsVisible(item: EntityModel): boolean {
        return this._$owner.editArrowIsVisible(item);
    }

    // endregion

    // region Аспект "Разделители строк и колонок"
    getColumnSeparatorSize(): TColumnSeparatorSize {
        return this._$columnSeparatorSize;
    }

    setColumnSeparatorSize(columnSeparatorSize: TColumnSeparatorSize): void {
        const changed = this._$columnSeparatorSize !== columnSeparatorSize;
        this._$columnSeparatorSize = columnSeparatorSize;
        if (changed && this._$columnItems) {
            this._updateSeparatorSizeInColumns('Left');
            this._updateSeparatorSizeInColumns('Right');
        }
        this._nextVersion();
    }

    protected _updateSeparatorSizeInColumns(separatorName: 'Left' | 'Right' | 'Row'): void {
        const multiSelectOffset = this.hasMultiSelectColumn() ? 1 : 0;
        this._$columnItems.forEach((cell, cellIndex) => {
            const column = cell.config;
            const columnIndex = cellIndex - multiSelectOffset;
            cell[`set${separatorName}SeparatorSize`](
                this[`_get${separatorName}SeparatorSizeForColumn`](column, columnIndex)
            );
        });
    }

    protected _getLeftSeparatorSizeForColumn(
        column: IColumn,
        columnIndex: number
    ): TColumnSeparatorSize {
        if (columnIndex > 0) {
            const columns = this.getGridColumnsConfig();
            const previousColumn = columns[columnIndex - 1];
            return this._resolveColumnSeparatorSize(column, previousColumn);
        }
        return null;
    }

    protected _getRightSeparatorSizeForColumn(
        column: IColumn,
        columnIndex: number
    ): TColumnSeparatorSize {
        const columns = this.getGridColumnsConfig();
        if (columnIndex < columns.length - 1) {
            const nextColumn = columns[columnIndex + 1];
            return this._resolveColumnSeparatorSize(nextColumn, column);
        }
    }

    protected _getRowSeparatorSizeForColumn(column: IColumn, columnIndex: number): string {
        return this._$rowSeparatorSize;
    }

    protected _resolveColumnSeparatorSize(
        currentColumn: IColumn,
        previousColumn: IColumn
    ): TColumnSeparatorSize {
        let columnSeparatorSize: TColumnSeparatorSize = this.getColumnSeparatorSize();
        if (currentColumn?.columnSeparatorSize?.hasOwnProperty('left')) {
            columnSeparatorSize = currentColumn.columnSeparatorSize.left;
        } else if (previousColumn?.columnSeparatorSize?.hasOwnProperty('right')) {
            columnSeparatorSize = previousColumn.columnSeparatorSize.right;
        }
        return columnSeparatorSize;
    }

    protected _resolveColumnSeparatorSizeForSpacingColumn(
        lastColumn: IColumn
    ): TColumnSeparatorSize {
        let columnSeparatorSize: TColumnSeparatorSize = this.getColumnSeparatorSize();
        if (lastColumn?.columnSeparatorSize?.hasOwnProperty('right')) {
            columnSeparatorSize = lastColumn.columnSeparatorSize.right;
        }
        return columnSeparatorSize;
    }

    // endregion

    // region Аспект "Шаблон всей строки. Состояние, когда в строке одна ячейка, растянутая на все колонки"

    // todo https://online.sbis.ru/opendoc.html?guid=024784a6-cc47-4d1a-9179-08c897edcf72
    getRowTemplate(): TemplateFunction {
        return this._$rowTemplate;
    }

    setRowTemplate(rowTemplate: TemplateFunction): void {
        if (rowTemplate) {
            // Произошла установка шаблона стрки. Если строка рисовалась по колонкам, сохраним их,
            // чтобы при сбросе шаблона строки вернуться к ним.
            if (!this._$rowTemplate && this._$columnsConfig) {
                this._savedColumns = this._$columnsConfig;
            }
            this._$rowTemplate = rowTemplate;
            this._$columnsConfig = [
                {
                    template: this._$rowTemplate,
                    templateOptions: this._$rowTemplateOptions || {},
                },
            ];
        } else if (this._$rowTemplate) {
            this._$rowTemplate = rowTemplate;
            this._$columnsConfig = this._savedColumns ? this._savedColumns : null;
        } else {
            return;
        }

        this._reinitializeColumns(true);
    }

    getRowTemplateOptions(): object {
        return this._$rowTemplateOptions;
    }

    setRowTemplateOptions(rowTemplateOptions: object, shouldRebuildColumns: boolean = true): void {
        if (!isEqual(this._$rowTemplateOptions, rowTemplateOptions)) {
            this._$rowTemplateOptions = rowTemplateOptions;
            if (this._$rowTemplate && this._$columnsConfig) {
                this._$columnsConfig[this._$columnsConfig.length - 1].templateOptions =
                    this._$rowTemplateOptions;
            }

            if (shouldRebuildColumns) {
                this._reinitializeColumns(true);
            } else if (this._$columnItems) {
                this._$columnItems.forEach((item) => {
                    item.nextVersion();
                });
                this._nextVersion();
            }
        }
    }

    // endregion

    // region Абстрактные методы
    abstract getContents(): T;

    abstract getOwner(): Collection<T>;

    abstract getTheme(): string;

    abstract getStyle(): string;

    abstract getMultiSelectVisibility(): string;

    abstract getTemplate(): TemplateFunction | string;

    abstract isEditing(): boolean;

    abstract isSelected(): boolean;

    abstract isDragged(): boolean;

    abstract isSticked(): boolean;

    abstract getEditingConfig(): IEditingConfig;

    abstract getShadowVisibility(): string;

    abstract getHoverBackgroundStyle(): string;

    abstract getCursorClasses(cursor: string, clickable: boolean): string;

    protected abstract _nextVersion(): void;

    protected abstract _notify(event: string, ...args: any[]): any;

    abstract getFadedClass(): string;

    abstract getDirectionality(): string;

    // endregion
}

// Статические свойства базовой строки и опции, которые будут переписаны из опций в всойства строки
Object.assign(Row.prototype, {
    '[Controls/_display/grid/mixins/Row]': true,
    _cellModule: null,
    _$columnsConfig: null,
    _$gridColumnsConfig: null,
    _$getRowProps: null,
    _$rowTemplate: null,
    _$rowTemplateOptions: null,
    _$colspanCallback: null,
    _$columnSeparatorSize: null,
    _$backgroundStyle: 'default',
    _$hoverBackgroundStyle: 'default',
    _$itemActionsPosition: 'inside',
    _$ladderMode: 'visibility',
    _$isBottomSeparatorEnabled: null,
    _$isTopSeparatorEnabled: null,
    _$isTopSeparatorEnabledReact: false,
    _$isBottomSeparatorEnabledReact: false,
    _$editingColumnIndex: null,
    _$useSpacingColumn: false,
});
