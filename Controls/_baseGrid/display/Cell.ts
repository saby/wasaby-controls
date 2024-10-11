/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { mixin } from 'Types/util';
import {
    DestroyableMixin,
    IInstantiable,
    IVersionable,
    Model,
    VersionableMixin,
} from 'Types/entity';
import { TemplateFunction } from 'UI/Base';

import { ICellPadding, IColspanParams, IColumn, TColumnSeparatorSize } from './interface/IColumn';

import {
    IEditingConfig,
    InitStateByOptionsMixin,
    InstantiableMixin,
    TItemActionsPosition,
    TMarkerSize,
    TRowSeparatorSize,
    TShadowVisibility,
} from 'Controls/display';
import { COLUMN_SCROLL_JS_SELECTORS, DRAG_SCROLL_JS_SELECTORS } from 'Controls/columnScroll';
import type { StickyMode, StickyVerticalPosition } from 'Controls/stickyBlock';

import Row from './Row';
import {
    IBorderProps,
    IGridPaddingProps,
    IRoundBorder,
    TBackgroundStyle,
    TFontColorStyle,
    TFontSize,
    TFontWeight,
    TGridHPaddingSize,
    TOverflow,
} from 'Controls/interface';
import * as React from 'react';
import type { IDataTypeRenderProps } from 'Controls/_baseGrid/display/interface/IDataTypeRenderProps';
import MoneyRender from 'Controls/_baseGrid/Render/types/MoneyRender';
import NumberRender from 'Controls/_baseGrid/Render/types/NumberRender';
import DateRender from 'Controls/_baseGrid/Render/types/DateRender';
import StringSearchRender from 'Controls/_baseGrid/Render/types/StringSearchRender';
import StringRender from 'Controls/_baseGrid/Render/types/StringRender';
import type {
    ICellComponentProps,
    ICellProps,
    IItemsContainerPadding,
    IRowComponentProps,
} from 'Controls/grid';
import type { IGridSelectors } from 'Controls/gridColumnScroll';
import { StickyHorizontalPosition } from 'Controls/_stickyBlock/types';
import { getCursor } from 'Controls/_baseGrid/cell/utils/props/Cursor';

const DEFAULT_CELL_TEMPLATE = 'Controls/grid:ColumnTemplate';

export interface IOptions<T extends Model = Model> extends IColspanParams {
    owner: Row<T>;
    theme: string;
    style: string;
    column: IColumn;
    instanceId?: string;
    isHiddenForLadder?: boolean;
    startColumn?: number;
    endColumn?: number;
    colspan?: number;
    isFixed?: boolean;
    isFixedToEnd?: boolean;
    isHidden?: boolean;
    isLadderCell?: boolean;
    leftSeparatorSize?: string;
    rightSeparatorSize?: string;
    backgroundStyle?: string;
    isSticked?: boolean;
    shadowVisibility?: string;
    rowSeparatorSize?: string;
    isFirstDataCell?: boolean;
    isTopSeparatorEnabled: boolean;
    isBottomSeparatorEnabled: boolean;
    isTopSeparatorEnabledReact: boolean;
    isBottomSeparatorEnabledReact: boolean;
    roundBorder: IRoundBorder;
    useSpacingColumn?: boolean;
    directionality?: string;
}

/**
 * Ячейка строки в таблице
 * @private
 */
export default class Cell<T extends Model = Model, TOwner extends Row<T> = Row<T>>
    extends mixin<DestroyableMixin, InitStateByOptionsMixin, InstantiableMixin, VersionableMixin>(
        DestroyableMixin,
        InitStateByOptionsMixin,
        InstantiableMixin,
        VersionableMixin
    )
    implements IInstantiable, IVersionable
{
    readonly '[Types/_entity/IInstantiable]': boolean;
    readonly DisplaySearchValue: boolean = false;

    get Markable(): boolean {
        return false;
    }

    readonly SupportItemActions: boolean = false;
    readonly Draggable: boolean = false;
    readonly TagCell: boolean = false;
    readonly LadderContentCell: boolean = false;

    get CheckBoxCell(): boolean {
        return false;
    }

    protected readonly _defaultCellTemplate: string = DEFAULT_CELL_TEMPLATE;
    protected readonly _$owner: TOwner;
    protected readonly _$column: IColumn;
    protected _$theme: string;
    protected _$style: string;
    protected _$isHiddenForLadder: boolean;
    protected _$instanceId: string;
    protected _$colspan: number;
    protected _$rowspan: number;
    protected _$isFixed: boolean;
    protected _$isFixedToEnd: boolean;
    protected _$isHidden: boolean;
    protected _$isSingleColspanedCell: boolean;
    protected _$isActsAsRowTemplate: boolean;
    protected _$isLadderCell: boolean;
    protected _$leftSeparatorSize: TColumnSeparatorSize;
    protected _$rightSeparatorSize: TColumnSeparatorSize;
    protected _$rowSeparatorSize: string;
    protected _$isFirstDataCell: boolean;
    protected _$isSticked: boolean;
    protected _$stickyCallback: Function;
    protected _$backgroundStyle: string;
    protected _$shadowVisibility?: string;
    protected _$isTopSeparatorEnabled?: string;
    protected _$isBottomSeparatorEnabled?: string;
    protected _$isTopSeparatorEnabledReact: boolean;
    protected _$isBottomSeparatorEnabledReact: boolean;
    protected _$roundBorder?: IRoundBorder;
    protected _$useSpacingColumn?: boolean;
    protected _$directionality: string;
    protected _$itemsContainerPadding?: IItemsContainerPadding;

    protected _cellProps: ICellProps | null = null;

    readonly listInstanceName: string = 'controls-Grid';

    readonly listElementName: string = 'cell';

    constructor(options?: IOptions<T>) {
        super();
        InitStateByOptionsMixin.initMixin(this, options);
        this.updateCellProps();
    }

    get shadowVisibility(): string {
        return this._$shadowVisibility;
    }

    get key(): string {
        return this._$column?.key || this.getDisplayProperty() + '_' + this.columnIndex;
    }

    getTemplate(): TemplateFunction | string | React.Component {
        return this._$column?.template || this._defaultCellTemplate;
    }

    getTemplateOptions(): { [key: string]: unknown } {
        return this._$column?.templateOptions;
    }

    hasCellContentRender(): boolean {
        return (
            !!this._$column &&
            Boolean(
                this._$column.displayType ||
                    this._$column.textOverflow ||
                    this._$column.fontColorStyle ||
                    this._$column.fontSize ||
                    this.getSearchValue()
            )
        );
    }

    getCellContentRender(): React.FunctionComponent<IDataTypeRenderProps<unknown>> {
        // Подсветку значения поддерживают декораторы number и date.
        // Декоратор money подсветку не поддерживает т.к. его реализация слишком сложная для добавления подсветки.
        // И так как досихпор никто не обращался с проблемой подсветки значения в колонках с типом money,
        // то она там никому и не нужна.
        switch (this._$column.displayType) {
            case 'money':
                return MoneyRender;
            case 'number':
                return NumberRender;
            case 'date':
                return DateRender;
            default: {
                if (
                    this.getHighlightedValue().length &&
                    this.getDisplayValue() &&
                    this._$column.displayTypeOptions?.searchHighlight !== false
                ) {
                    return StringSearchRender;
                }

                return StringRender;
            }
        }
    }

    shouldDisplayItemActions(): boolean {
        if (this._$owner.hasItemActionsSeparatedCell()) {
            return false;
        }
        return this.isLastColumn() && this._$owner.shouldDisplayItemActions();
    }

    isSwiped(): boolean {
        return this._$owner.isSwiped();
    }

    getItemActionsPosition(): TItemActionsPosition {
        return this.getOwner().getItemActionsPosition();
    }

    nextVersion(): void {
        this._nextVersion();
    }

    getOwner(): TOwner {
        return this._$owner;
    }

    getStyle(): string {
        return this._$style;
    }

    getTheme(): string {
        return this._$theme;
    }

    /**
     * @deprecated Используйте getHighlightedValue
     */
    getSearchValue(): string {
        return this.getOwner().getSearchValue();
    }

    getHighlightedValue(): string | string[] {
        if (this.getOwner().getOwner().isThinInteractor()) {
            return this.getOwner().getHighlightedValues();
        }
        return this.getSearchValue();
    }

    getRowSeparatorSize(): string {
        return this._$rowSeparatorSize;
    }

    isEditing(): boolean {
        return false;
    }

    /**
     * Может ли данная ячейка редактироваться
     */
    isEditable(): boolean {
        return false;
    }

    getEditingConfig(): IEditingConfig {
        return this._$owner.getEditingConfig();
    }

    getDirectionality(): string {
        return this._$directionality;
    }

    getColumnScrollSelectors(): IGridSelectors {
        return this.getOwner().getColumnScrollSelectors();
    }

    hasColumnScrollReact(): boolean {
        return this.getOwner().hasColumnScrollReact();
    }

    isActsAsRowTemplate(): boolean {
        return this._$isActsAsRowTemplate;
    }

    // region Аспект "Colspan. Объединение ячеек по горизонтали"

    /**
     * Получить значение колспана для данной ячейки.
     * @return {Number} значение колспана для данной ячейки.
     */
    getColspan(): number {
        return this._$colspan || 1;
    }

    /**
     * Получить индексы начальной и конечной границы ячайки строки в контексте CssGridLayout.
     * @remark В CssGridLayout индексы границ начинаются с единицы.
     * @return {IColspanParams} индексы начальной и конечной границы ячайки.
     */
    // TODO: Нужно либо переименовать(чтобы было понятно что только для CssGrid),
    //  либо изменить метод(чтобы валидно работал для всех браузеров).
    getColspanParams(): IColspanParams {
        if (this._$colspan) {
            const startColumn = this.getColumnIndex(true) + 1;
            const endColumn = startColumn + this._$colspan;
            return {
                startColumn,
                endColumn,
            };
        }
    }

    /**
     * Получить стиль для колспана ячейки в CSSGridLayout.
     * @remark Для браузеров, не поддерживающих CSS Grid Layout, где Controls/grid:View для отрисовки использует HTMLTable,
     * метод возвращает пустую строку. В таком случае, для растягивания ячеек следует использовать метод {@link getColspan}.
     * @return {String} Стиль для колспана ячейки. Формат строки: gridColumn: x / y;
     * @see getColspan
     */
    getColspanStyles(): string {
        if (!this._$owner.isFullGridSupport()) {
            return '';
        }
        const colspanParams = this.getColspanParams();
        if (!colspanParams) {
            return '';
        }
        return `grid-column: ${colspanParams.startColumn} / ${colspanParams.endColumn};`;
    }

    // endregion

    // region Rowspan

    getRowspan(): number {
        return this._$rowspan || 1;
    }

    getRowspanStyles(): string {
        return '';
    }

    // endregion Rowspan

    // region Аспект "Лесенка"
    setHiddenForLadder(value: boolean): void {
        this._$isHiddenForLadder = value;
    }

    getHiddenForLadder(): boolean {
        return this._$isHiddenForLadder;
    }

    // endregion

    // region Аспект "Отображение данных"
    getDisplayProperty(): string | number {
        if (!this.getColumnConfig()) {
            return '';
        }
        if (!this.getColumnConfig().hasOwnProperty('displayProperty')) {
            return '';
        }

        return this.getColumnConfig().displayProperty;
    }

    getDisplayValue(): string | number | Date {
        return this.getContents().get(this.getDisplayProperty());
    }

    getTooltipProperty(): string {
        return this._$column.tooltipProperty;
    }

    getDisplayType(): string {
        return this._$column.displayType;
    }

    getContents(): T {
        return this._$owner?.getContents?.();
    }

    get contents(): T {
        return this._$owner?.getContents?.();
    }

    isHidden(): boolean {
        return !!this._$isHidden;
    }

    // endregion

    // region Аспект "Стилевое оформление. Классы и стили"
    getWrapperClasses(
        backgroundColorStyle?: TBackgroundStyle,
        templateHighlightOnHover?: boolean,
        templateHoverBackgroundStyle?: TBackgroundStyle
    ): string {
        const hasColumnScroll = this._$owner.hasColumnScroll();
        const hoverBackgroundStyle =
            this._$column.hoverBackgroundStyle ||
            templateHoverBackgroundStyle ||
            this._$owner.getHoverBackgroundStyle();

        let wrapperClasses = '';

        if (this._$isHidden && this._$owner.isFullGridSupport()) {
            return 'ws-hidden';
        }

        wrapperClasses += this._getWrapperBaseClasses(templateHighlightOnHover);
        wrapperClasses += this._getWrapperSeparatorClasses();

        if (!hasColumnScroll) {
            wrapperClasses += ' controls-Grid__cell_fit';
        }

        if (this.getColspan() > 1) {
            wrapperClasses += ' js-controls-Grid__cell_colspaned';
        }

        if (this.isEditing()) {
            wrapperClasses += ' controls-Grid__row-cell-editing';
            if (this._$owner.getEditingConfig()?.mode === 'cell') {
                wrapperClasses += ' controls-Grid__row-cell-editing_singleCellEditable';
            }
        }

        if (this._$owner.getAnimation?.()) {
            wrapperClasses += ` controls-ListView__item_animated_${this._$owner.getAnimation()} `;
        }

        const backgroundColorWrapperClasses = this._getBackgroundColorWrapperClasses(
            backgroundColorStyle,
            templateHighlightOnHover,
            hoverBackgroundStyle
        );
        wrapperClasses += ` ${backgroundColorWrapperClasses}`;

        if (this._$owner.hasColumnScroll()) {
            wrapperClasses += ` ${this._getColumnScrollWrapperClasses()}`;
        }

        wrapperClasses += ' js-controls-ListView__measurableContainer';

        return wrapperClasses;
    }

    protected _getBackgroundColorWrapperClasses(
        backgroundColorStyle?: TBackgroundStyle,
        templateHighlightOnHover?: boolean,
        hoverBackgroundStyle?: TBackgroundStyle
    ): string {
        let wrapperClasses = '';

        const isCellEditMode = this._$owner.getEditingConfig()?.mode === 'cell';
        const isRowEditingMode = this.isEditing() && !isCellEditMode;

        if (isRowEditingMode) {
            const editingBackgroundStyle = this._$owner.getEditingBackgroundStyle();
            return ` controls-Grid__row-cell-background-editing_${editingBackgroundStyle} `;
        } else if (
            hoverBackgroundStyle !== 'transparent' &&
            ((templateHighlightOnHover !== false && !isCellEditMode) ||
                (templateHighlightOnHover === true && isCellEditMode))
        ) {
            wrapperClasses += this._getHoverBackgroundClasses(hoverBackgroundStyle);
            wrapperClasses += ` controls-Grid__row-cell-background-hover-${hoverBackgroundStyle} `;
        }

        // backgroundColorStyle имеет наивысший приоритет после isEditing
        if (backgroundColorStyle && backgroundColorStyle !== 'default') {
            // Если на списке есть скролл колонок или ячейка застикана, то ей надо выставить backgroundStyle
            // Сюда же попадаем, если backgroundColorStyle = default
            wrapperClasses += ` controls-background-${backgroundColorStyle}`;
        } else if (
            this.getOwner().hasColumnScroll() ||
            this.isVerticalStickied() ||
            (this.getOwner().isMarked() && this.getStyle() === 'master')
        ) {
            wrapperClasses += this._getControlsBackgroundClass(backgroundColorStyle);
        }
        return wrapperClasses;
    }

    // Вынес в отдельный метод, чтобы не проверять editing для header/footer/results
    protected _getControlsBackgroundClass(backgroundColorStyle: TBackgroundStyle): string {
        let wrapperClasses = '';
        if (backgroundColorStyle) {
            wrapperClasses += ` controls-background-${backgroundColorStyle}`;
        } else if (this._$backgroundStyle === 'default' && this.getStyle() !== 'default') {
            wrapperClasses += ` controls-background-${this.getStyle()}`;
        } else {
            const style = this._$backgroundStyle || this.getStyle();
            wrapperClasses += ` controls-background-${style}${
                style === 'default' ? '-sticky' : ''
            }`;
        }
        return wrapperClasses;
    }

    protected _getRoundBorder(): IRoundBorder {
        const roundBorder: IRoundBorder = {
            tl: null,
            tr: null,
            br: null,
            bl: null,
        };
        if (this._$roundBorder && this.isFirstColumn()) {
            roundBorder.tl = this._$roundBorder.tl;
            roundBorder.bl = this._$roundBorder.bl;
        }
        if (this._$roundBorder && this.isLastColumn()) {
            roundBorder.tr = this._$roundBorder.tr;
            roundBorder.br = this._$roundBorder.br;
        }
        return roundBorder;
    }

    protected _getRoundBorderClasses(): string {
        let classes = '';
        const roundBorder = this._getRoundBorder();
        if (roundBorder.tl) {
            classes += ` controls-ListView__item_roundBorder_topLeft_${roundBorder.tl}`;
        }
        if (roundBorder.bl) {
            classes += ` controls-ListView__item_roundBorder_bottomLeft_${roundBorder.bl}`;
        }
        if (roundBorder.tr) {
            classes += ` controls-ListView__item_roundBorder_topRight_${roundBorder.tr}`;
        }
        if (roundBorder.br && this.getItemActionsPosition() !== 'outside') {
            classes += ` controls-ListView__item_roundBorder_bottomRight_${roundBorder.br}`;
        }
        return classes;
    }

    // В StickyBlock надо передавать корректный backgroundStyle в зависимости от style
    getStickyBackgroundStyle(): string {
        return this._$backgroundStyle === 'default' && this.getStyle() !== 'default'
            ? this.getStyle()
            : this._$backgroundStyle || this.getStyle();
    }

    // Only for partial grid support
    getRelativeCellWrapperClasses(): string {
        const rowSeparatorSize = this._$rowSeparatorSize;

        // Единственная ячейка с данными сама формирует высоту строки
        // и не нужно применять хак для растягивания контента ячеек по высоте ячеек.
        // Подробнее искать по #grid_relativeCell_td.
        const shouldFixAlignment =
            this._$owner.getColumns().length === (this._$owner.hasMultiSelectColumn() ? 2 : 1);

        return (
            'controls-Grid__table__relative-cell-wrapper ' +
            `controls-Grid__table__relative-cell-wrapper_rowSeparator-${rowSeparatorSize} ` +
            (shouldFixAlignment ? 'controls-Grid__table__relative-cell-wrapper_singleCell' : '')
        );
    }

    // Only for partial grid support
    getRelativeCellWrapperStyles(): React.CSSProperties {
        let styles: React.CSSProperties = {};
        if (this._$owner.hasColumnScroll() && this._$isFixed && this.config) {
            const width = this.config.compatibleWidth || this.config.width || '';
            if (width.endsWith('px')) {
                styles = { maxWidth: width };
            }
        }
        return styles;
    }

    getWrapperStyles(): string {
        let styles = '';
        if (this._$owner.isFullGridSupport()) {
            styles += this.getColspanStyles();
        }
        return styles;
    }

    getContentClasses(
        backgroundColorStyle: TBackgroundStyle = this._$column.backgroundColorStyle,
        cursor: string = 'pointer',
        templateHighlightOnHover: boolean,
        tmplIsEditable?: boolean,
        templateHoverBackgroundStyle?: TBackgroundStyle
    ): string {
        const hoverBackgroundStyle =
            this._$column.hoverBackgroundStyle ||
            templateHoverBackgroundStyle ||
            this._$owner.getHoverBackgroundStyle();
        const isSingleCellEditing = this._$owner.getEditingConfig()?.mode === 'cell';
        const isRowEditingMode = this.isEditing() && !isSingleCellEditing;

        // TODO: Убрать js-controls-ListView__editingTarget' по задаче
        //  https://online.sbis.ru/opendoc.html?guid=deef0d24-dd6a-4e24-8782-5092e949a3d9
        let contentClasses = 'controls-Grid__row-cell__content js-controls-ListView__editingTarget';
        if (this.getOwner().isDragged()) {
            contentClasses += ' controls-ListView__itemContent';
        } else {
            contentClasses += ` controls-Grid__row-cell_cursor-${cursor}`;
        }

        contentClasses += ' controls-Grid__row-cell__content_baseline_default';

        contentClasses += this._getHorizontalPaddingClasses(this._$column.cellPadding);
        contentClasses += this._getVerticalPaddingClasses();

        contentClasses += ' controls-Grid__row-cell_withoutRowSeparator_size-null';

        contentClasses += this._getContentAlignClasses();

        if (this._$isHiddenForLadder) {
            contentClasses += ' controls-Grid__row-cell__content_hiddenForLadder';

            // Для лесенки критична установка этого стиля именно в Content.
            // В отчётах в серой теме необходимо автоматически перекрашивать фон default в серый.
            // Это настроено для controls-background-default-sticky
            contentClasses +=
                ` controls-background-${this._$backgroundStyle}` +
                `${this._$backgroundStyle === 'default' ? '-sticky' : ''}`;
        }

        if (this.getOwner().getStickyLadder()) {
            // Во время днд отключаем лесенку, а контент отображаем принудительно с помощью visibility: visible
            contentClasses += ' controls-Grid__row-cell__content_ladderHeader';
        }

        if (backgroundColorStyle) {
            contentClasses += ` controls-background-${backgroundColorStyle}`;
        }

        if (
            !isRowEditingMode &&
            hoverBackgroundStyle !== 'transparent' &&
            ((templateHighlightOnHover !== false && !isSingleCellEditing) ||
                (templateHighlightOnHover === true && isSingleCellEditing))
        ) {
            contentClasses += ` controls-Grid__item_background-hover_${templateHoverBackgroundStyle}`;
            contentClasses += this._getHoverBackgroundClasses(templateHoverBackgroundStyle);
        }

        contentClasses += this.getOwner().getFadedClass();

        if (this._$owner.isEditing()) {
            contentClasses += this._getRoundBorderClasses();

            if (this._$owner.hasColumnScroll()) {
                contentClasses += ` ${DRAG_SCROLL_JS_SELECTORS.NOT_DRAG_SCROLLABLE}`;
            }
        }

        return contentClasses;
    }

    protected _getHoverBackgroundClasses(templateHoverBackgroundStyle?: TBackgroundStyle): string {
        const hoverBackgroundStyle =
            this._$column?.hoverBackgroundStyle ||
            templateHoverBackgroundStyle ||
            this._$owner.getHoverBackgroundStyle();
        let classes = '';
        if (hoverBackgroundStyle !== 'transparent') {
            classes += ` controls-hover-background-${hoverBackgroundStyle}`;
        }
        return classes;
    }

    /**
     * Добавляет CSS классы для стилизации текста в ячейке грида.
     * Настройки из конфига колонок имеют бОльший приоритет
     * @param templateFontColorStyle Цвет шрифта
     * @param templateFontSize Размер шрифта
     * @param templateFontWeight Насыщенность шрифта
     */
    getContentTextStylingClasses(
        templateFontColorStyle?: TFontColorStyle,
        templateFontSize?: TFontSize,
        templateFontWeight?: TFontWeight
    ): string {
        const fontColorStyle = this.config.fontColorStyle || templateFontColorStyle;
        const fontSize = this.config.fontSize || templateFontSize;
        const fontWeight = this.config.fontWeight || templateFontWeight;
        let contentClasses = '';
        if (fontColorStyle) {
            contentClasses += ` controls-text-${fontColorStyle}`;
        }
        if (fontSize) {
            contentClasses += ` controls-fontsize-${fontSize}`;
        }
        if (fontWeight) {
            contentClasses += ` controls-fontweight-${fontWeight}`;
        }
        return contentClasses;
    }

    getContentStyles(): string {
        return '';
    }

    isStickied(tmplIsStickied?: boolean): boolean {
        return (
            tmplIsStickied !== false &&
            (this.isVerticalStickied() || this.isHorizontalStickied()) &&
            this._$owner.isFullGridSupport()
        );
    }

    isVerticalStickied(): boolean {
        return this.getOwner().isSticked();
    }

    isHorizontalStickied(): boolean {
        return false;
    }

    isNeedSubPixelArtifactFix(tmplSubPixelArtifactFixOption?: boolean): boolean {
        if (tmplSubPixelArtifactFixOption === undefined) {
            return !this.isLastColumn();
        }
        return tmplSubPixelArtifactFixOption;
    }

    getStickyHeaderPosition(): StickyHorizontalPosition | undefined {
        if (this.isHorizontalStickied()) {
            return this.getHorizontalStickyHeaderPosition();
        }
    }

    getVerticalStickyHeaderPosition(): StickyVerticalPosition {
        return this.getOwner().getVerticalStickyHeaderPosition();
    }

    getHorizontalStickyHeaderPosition(): StickyHorizontalPosition {
        return 'left';
    }

    getStickyHeaderMode(): StickyMode {
        if (this.isHorizontalStickied()) {
            return 'stackable';
        } else {
            return this.getOwner().isSticked() || this._$stickyCallback
                ? 'replaceable'
                : 'notsticky';
        }
    }

    getZIndex(): number {
        // 3 - чтобы маркер соседней записи был под застиканной записью
        return 3;
    }

    setBackgroundStyle(backgroundStyle: TBackgroundStyle): void {
        this._$backgroundStyle = backgroundStyle;
    }

    setLeftSeparatorSize(columnSeparatorSize: TColumnSeparatorSize, silent?: boolean): void {
        this._$leftSeparatorSize = columnSeparatorSize;
        if (!silent) {
            this._nextVersion();
        }
    }

    getLeftSeparatorSize(): TColumnSeparatorSize {
        return this._convertColumnSeparatorValue(this._$leftSeparatorSize);
    }

    setRightSeparatorSize(columnSeparatorSize: TColumnSeparatorSize): void {
        this._$rightSeparatorSize = columnSeparatorSize;
        this._nextVersion();
    }

    getRightSeparatorSize(): TColumnSeparatorSize {
        return this._convertColumnSeparatorValue(this._$rightSeparatorSize);
    }

    setRowSeparatorSize(rowSeparatorSize: string): void {
        this._$rowSeparatorSize = rowSeparatorSize;
        this._nextVersion();
    }

    _convertColumnSeparatorValue(value: unknown): TColumnSeparatorSize {
        if (typeof value === 'string') {
            const lower = value.toLowerCase();

            if (lower === 'null' || lower === 's' || lower === 'bold') {
                return lower;
            }
        }
        return 'null';
    }

    isActive(): boolean {
        return this._$owner.isActive() && !this.isEditing();
    }

    getMinHeightClasses(): string {
        const topPadding = this._$owner.getTopPadding();
        const bottomPadding = this._$owner.getBottomPadding();
        const style =
            topPadding === 'default' && bottomPadding === 'default' ? this.getStyle() : 'default';
        const size = topPadding === 'null' && bottomPadding === 'null' ? 'small' : 'default';
        return ` controls-Grid__row-cell_${size}_style-${style}_min_height`;
    }

    protected _getWrapperBaseClasses(templateHighlightOnHover: boolean): string {
        let classes = '';

        const isEditing = this.isEditing();
        const isSingleCellEditing = this._$owner.getEditingConfig()?.mode === 'cell';
        const isDragged = this._$owner.isDragged();
        const editingBackgroundStyle = this._$owner.getEditingBackgroundStyle();

        classes += ` controls-Grid__row-cell controls-Grid__cell_${this.getStyle()}`;
        classes += ' js-controls-Grid__row-cell';
        classes += ' js-controls-GridReact__cell';
        classes += ' controls-ListView__item_contentWrapper';
        classes += ` controls-Grid__row-cell_${this.getStyle()}`;

        if (!this.isStickied()) {
            classes += ' controls-Grid__row-cell_relative';
        }

        if (isEditing && !isSingleCellEditing) {
            classes += ' controls-ListView__item_editing';
            classes += ` controls-background-editing_${editingBackgroundStyle}`;
        }

        if (isDragged) {
            classes += ' controls-ListView__item_dragging';
        }

        if (this.isActive() && templateHighlightOnHover !== false) {
            classes += ' controls-GridView__item_active';
        }

        classes += this.getMinHeightClasses();

        classes += this._getRoundBorderClasses();

        return classes;
    }

    // @TODO https://online.sbis.ru/opendoc.html?guid=907731fd-b8a8-4b58-8958-61b5c8090188
    protected _getWrapperSeparatorClasses(): string {
        const rowSeparatorSize = this._$rowSeparatorSize;
        let classes = '';

        if (rowSeparatorSize) {
            if (this._$isTopSeparatorEnabled) {
                classes += ` controls-Grid__row-cell_withRowSeparator_size-${rowSeparatorSize}`;
                classes += ` controls-Grid__rowSeparator_size-${rowSeparatorSize}`;
            }

            if (this._$isBottomSeparatorEnabled) {
                classes += ` controls-Grid__rowSeparator_bottom_size-${rowSeparatorSize}`;
            }
        }
        if (!rowSeparatorSize || !this._$isTopSeparatorEnabled) {
            // Вспомогательные классы, вешаются на ячейку. Обеспечивают отсутствие "скачков" при смене rowSeparatorSize.
            classes += ' controls-Grid__no-rowSeparator';
            classes += ' controls-Grid__row-cell_withRowSeparator_size-null';
        }

        classes += this._getColumnSeparatorClasses();
        return classes;
    }

    protected _getColumnSeparatorClasses(): string {
        if (this.getColumnIndex() > (this._$owner.hasMultiSelectColumn() ? 1 : 0)) {
            const columnSeparatorSize =
                typeof this._$leftSeparatorSize === 'string'
                    ? this._$leftSeparatorSize.toLowerCase()
                    : null;
            return ` controls-Grid__columnSeparator_size-${columnSeparatorSize}`;
        }
        return '';
    }

    protected _getColumnScrollWrapperClasses(): string {
        if (this.hasColumnScrollReact()) {
            return '';
        }
        if (this._$isFixed) {
            let classes = 'controls-GridView__cell_fixed';
            classes += ` ${COLUMN_SCROLL_JS_SELECTORS.FIXED_ELEMENT}`;
            classes += ` ${DRAG_SCROLL_JS_SELECTORS.NOT_DRAG_SCROLLABLE}`;
            return classes;
        }
        return ` ${COLUMN_SCROLL_JS_SELECTORS.SCROLLABLE_ELEMENT}`;
    }

    protected _getHorizontalPaddingClasses(cellPadding: ICellPadding): string {
        let classes = '';

        if (
            this.getOwner()?.isReactView?.() &&
            this.getOwner().getMultiSelectVisibility() === 'hidden'
        ) {
            return '';
        }

        const leftPadding = this._$owner.getLeftPadding();
        const rightPadding = this._$owner.getRightPadding();
        const isFirstColumnAfterCheckbox =
            this.getColumnIndex(false, false) === 1 && this._$owner.hasMultiSelectColumn();

        if (!this._$owner.hasMultiSelectColumn() && this.isFirstColumn()) {
            classes += ` controls-Grid__cell_spacingFirstCol_${leftPadding}`;
        } else if (!this.isFirstColumn() && !isFirstColumnAfterCheckbox) {
            classes += ' controls-Grid__cell_spacingLeft';
            if (cellPadding?.left) {
                classes += `_${cellPadding.left.toLowerCase()}`;
            }
        }

        if (!this.isLastColumn()) {
            classes += ' controls-Grid__cell_spacingRight';
            if (cellPadding?.right) {
                classes += `_${cellPadding.right.toLowerCase()}`;
            }
        } else {
            classes += ` controls-Grid__cell_spacingLastCol_${rightPadding}`;
        }

        return classes;
    }

    protected _getVerticalPaddingClasses(): string {
        if (
            this.getOwner()?.isReactView?.() &&
            this.getOwner().getMultiSelectVisibility() === 'hidden'
        ) {
            return '';
        }
        const topPadding = this._$owner.getTopPadding();
        const bottomPadding = this._$owner.getBottomPadding();
        const style = this.getStyle();

        // top <-> bottom
        return (
            ` controls-Grid__row-cell_${style}_rowSpacingTop_${topPadding}` +
            ` controls-Grid__row-cell_${style}_rowSpacingBottom_${bottomPadding}`
        );
    }

    protected _getContentAlignClasses(): string {
        let classes = '';
        if (this._$column?.align) {
            classes += ` controls-Grid__row-cell__content_halign_${this._$column.align}`;
        }

        if (this._$column?.valign) {
            classes += ` controls-Grid__cell_valign_${this._$column.valign} controls-Grid__cell-content_full-height`;
        }
        return classes;
    }

    protected _getShadowClasses(shadowVisibility: TShadowVisibility = 'hidden'): string {
        if (this.getOwner().isDragged()) {
            shadowVisibility = 'dragging';
        }

        if (shadowVisibility && shadowVisibility !== 'hidden') {
            return ` controls-ListView__item_shadow_${shadowVisibility}`;
        }

        return '';
    }

    // endregion

    // region Аспект "Ячейка"

    get config(): IColumn {
        return this._$column;
    }

    getColumnConfig(): IColumn {
        return this.config;
    }

    /**
     * Получить индекс данной ячейки в строке.
     * @param {Boolean} [takeIntoAccountColspans=false] - Учитывать ли колспаны ячеек, расположенных перед данной в строке.
     * @param {Boolean} [takeIntoHiddenColumns=false] - Учитывать ли при расчете индекса скрытые ячейки, расположенные до искомой.
     * @returns {Number} Индекс ячейки в строке.
     */
    getColumnIndex(
        takeIntoAccountColspans: boolean = false,
        takeIntoHiddenColumns: boolean = true
    ): number {
        return this._$owner.getColumnIndex(this, takeIntoAccountColspans, takeIntoHiddenColumns);
    }

    get columnIndex(): number {
        return this.getColumnIndex();
    }

    get isSingleColspanedCell(): boolean {
        return this._$isSingleColspanedCell;
    }

    isLadderCell(): boolean {
        return false;
    }

    isFirstColumn(): boolean {
        return this.getColumnIndex(false, false) === 0;
    }

    isLastColumn(): boolean {
        return this.getColumnIndex() === this._getLastColumnIndex();
    }

    protected _getLastColumnIndex(): number {
        let dataColumnsCount = this._$owner.getColumnsCount() - 1;
        if (this._$owner.hasItemActionsSeparatedCell()) {
            dataColumnsCount -= 1;
        }
        if (this._$useSpacingColumn) {
            dataColumnsCount -= 1;
        }
        return dataColumnsCount;
    }

    // endregion

    // region Аспект "Множественный выбор"
    isMultiSelectColumn(): boolean {
        return this._$owner.hasMultiSelectColumn() && this.isFirstColumn();
    }

    // endregion

    // region Аспект "Маркер"

    // По умолчанию для абстрактной ячейки маркер отключен.
    shouldDisplayMarker(marker: boolean): boolean {
        return false;
    }

    getMarkerClasses(
        markerSize: TMarkerSize = 'content-xs',
        addVerticalPaddings: boolean = true
    ): string {
        let classes = this.getOwner().getMarkerClasses(markerSize, addVerticalPaddings);
        classes += ' controls-Grid__row-cell__content_baseline_default';
        return classes;
    }

    // endregion

    // region Аспект "Тег"

    /**
     * Возвращает флаг, что надо или не надо показывать тег
     * @param tagStyle
     */
    shouldDisplayTag(tagStyle?: string): boolean {
        return false;
    }

    // endregion

    // region Аспект "Кнопка редактирования"

    shouldDisplayEditArrow(contentTemplate?: React.Component | React.FunctionComponent): boolean {
        return false;
    }

    getInstanceId(): string {
        return this._$instanceId || super.getInstanceId();
    }

    // endregion

    // region CellProps

    protected calculationMinHeightClass(rowProps: IRowComponentProps): string {
        if (rowProps.paddingTop === 'grid_null' && rowProps.paddingBottom === 'grid_null') {
            return 'controls-GridReact__minHeight_without_padding';
        }
        return 'controls-GridReact__minHeight-data';
    }

    protected calculationCellPaddingLeft(rowProps: IRowComponentProps) {
        const cellProps = this._cellProps;
        const cellPadding = this.getColumnConfig()?.cellPadding;
        const isFirstColumnAfterCheckbox =
            this.getColumnIndex() === 1 && this._$owner.hasMultiSelectColumn();

        if (isFirstColumnAfterCheckbox) {
            return 'grid_null';
        }

        if (cellPadding?.left) {
            return `grid_${cellPadding.left}`;
        }

        if (cellProps?.padding?.left) {
            return `grid_${cellProps.padding.left}`;
        }

        if (this.isFirstColumn()) {
            if (rowProps.paddingLeft) {
                return rowProps.paddingLeft;
            }

            return 'list_default';
        }

        return 'grid_m';
    }

    protected calculationCellPaddingRight(rowProps: IRowComponentProps) {
        const cellProps = this._cellProps;
        const cellPadding = this.getColumnConfig()?.cellPadding;

        if (cellPadding?.right) {
            return `grid_${cellPadding?.right}`;
        }

        if (cellProps?.padding?.right) {
            return `grid_${cellProps.padding.right}`;
        }

        if (this.isLastColumn()) {
            if (rowProps.paddingRight) {
                return rowProps.paddingRight;
            }

            return 'list_default';
        }

        return 'grid_m';
    }

    protected calculationCellPadding(rowProps: IRowComponentProps): IGridPaddingProps {
        return {
            paddingLeft: this.calculationCellPaddingLeft(rowProps) as TGridHPaddingSize,
            paddingRight: this.calculationCellPaddingRight(rowProps) as TGridHPaddingSize,
            paddingTop: rowProps.paddingTop,
            paddingBottom: rowProps.paddingBottom,
        };
    }

    getCellEditorProps<
        T extends {
            editing: ICellComponentProps['editing'];
            editable: ICellComponentProps['editable'];
            backgroundStyle: ICellComponentProps['backgroundStyle'];
            hoverBackgroundStyle: ICellComponentProps['hoverBackgroundStyle'];
            borderVisibility: ICellComponentProps['borderVisibility'];
            borderStyle: ICellComponentProps['borderStyle'];
            borderMode: ICellComponentProps['borderMode'];
            className: ICellComponentProps['className'];
        },
    >(props: T): T {
        return props;
    }

    getRecordTypeClasses(): string {
        return '';
    }

    getCellComponentProps(rowProps: IRowComponentProps): ICellComponentProps {
        const cellProps = this._cellProps;
        const columnConfig = this.config;

        const getInheritableCellProp = <T extends keyof ICellProps>(
            name: T,
            defaultValue?: ICellProps[T]
        ): ICellProps[T] =>
            this._cellProps?.[name] ||
            ((rowProps as ICellProps)[name] === 'default'
                ? // todo defaultValue тут явно неправильно. фиксированная шапка не того цвета
                  defaultValue
                : (columnConfig as ICellProps)?.[name] || (rowProps as ICellProps)[name]);

        const isColumnScrollFixedCell =
            this.hasColumnScrollReact() && (this._$isFixed || this._$isFixedToEnd);

        const editing = this.isEditing(); // editing - флаг редактируемой строки, а не редактируемой ячейки

        let backgroundStyle = getInheritableCellProp(
            'backgroundStyle',
            isColumnScrollFixedCell ? 'default' : undefined
        );
        const hoverBackgroundStyle = getInheritableCellProp(
            'hoverBackgroundStyle',
            columnConfig.hoverBackgroundStyle
        );

        const markerVisible = this.shouldDisplayMarker(rowProps.markerVisible);

        const stickied = rowProps.stickied && this.isStickied(true);
        let stickiedBackgroundStyle;
        if (stickied) {
            stickiedBackgroundStyle = this.getStickyBackgroundStyle();

            // Нужно проксировать фон,
            // т.к. stickiedBackgroundStyle нужно задавать только если он отличается от backgroundStyle
            if (
                backgroundStyle &&
                (!stickiedBackgroundStyle || stickiedBackgroundStyle === 'default')
            ) {
                stickiedBackgroundStyle = backgroundStyle;
            }
        }

        // по умолчанию фон должен быть прозрачным.
        // Но у застиканных элементов и во время редактирования он обязательно должен быть.
        if (
            backgroundStyle === this.getStyle() &&
            !isColumnScrollFixedCell &&
            !stickied &&
            !editing
        ) {
            backgroundStyle = undefined;
        }

        // Установленный в itemTemplateOptions.backgroundColorStyle
        // имеет наивысший приоритет после isEditing.
        // В новом гриде от этого свойства нужно уходить в пользу backgroundStyle
        if (
            rowProps.backgroundColorStyle ||
            columnConfig?.backgroundColorStyle ||
            cellProps?.backgroundColorStyle
        ) {
            backgroundStyle =
                rowProps.backgroundColorStyle ||
                columnConfig.backgroundColorStyle ||
                cellProps?.backgroundColorStyle;
        }

        // Ячейка становится активной, когда с ней производится какое-либо действие (меню, свайп etc)
        // При этом запись должна отмечаться цветом по ховеру (стандарт).
        // Но при редактировании по месту свой цвет.
        if (rowProps.isActive && !editing && rowProps.highlightOnHover) {
            backgroundStyle = `${hoverBackgroundStyle || 'default'}_active`;
        }

        const padding = this.calculationCellPadding(rowProps);

        const colspanParams = this.getColspanParams();

        const borderVisibility: IBorderProps['borderVisibility'] = getInheritableCellProp(
            'borderVisibility',
            'hidden'
        );

        let borderMode: 'row' | 'cell' | undefined;
        let borderStyle: IBorderProps['borderStyle'] | undefined;

        if (borderVisibility !== 'hidden') {
            borderMode = this._cellProps?.borderVisibility ? 'cell' : 'row';
            borderStyle = getInheritableCellProp('borderStyle', 'default');
        }

        let className: string = 'js-controls-GridReact__cell ';

        if (cellProps?.className) {
            className += `${cellProps?.className}`;
        }

        if (this.hasColumnScrollReact()) {
            const selectors = this.getColumnScrollSelectors();

            // Добавляем всем ячейкам класс от механизма абстрактного горизонтального скролла областей.
            // С помощью них реализованы базовые принципы скроллирования.
            // Также добавляем на ячейки детализирующие селекторы, определенные нами на уровне табличного горизонтального скролла.
            // Они нужны для мобильной адаптации и оптимизации, а так же для серверного рендеринга с изначальным смещением.
            if (this._$isFixed) {
                className += ` ${selectors.FIXED_ELEMENT} ${selectors.FIXED_CELL} ${selectors.FIXED_START_CELL}`;
            } else if (this._$isFixedToEnd) {
                className += ` ${selectors.FIXED_TO_RIGHT_EDGE_ELEMENT} ${selectors.FIXED_CELL} ${selectors.FIXED_END_CELL}`;
            } else {
                className += ` ${selectors.SCROLLABLE_ELEMENT} ${selectors.SCROLLABLE_CELL}`;
            }

            if (
                // Проверка на ресайзер нужна, только из за неправильно написанной генерации колонок.
                // Оба флага будут true, даже когда строка разбита на колонки.
                !this.getOwner().getOwner().hasResizer() &&
                (this._$isSingleColspanedCell || this._$isActsAsRowTemplate)
            ) {
                className += ` controls-GridReact__cell_fullColspan_columnScroll ${selectors.STRETCHED_TO_VIEWPORT_ELEMENT}`;
            }
        }

        if (this.getHiddenForLadder()) {
            className += ' controls-Grid__ladder_sticky_background_cell';
        }

        let topSeparatorSize: TRowSeparatorSize = 'null';
        let bottomSeparatorSize: TRowSeparatorSize = 'null';
        let topSeparatorStyle;
        let bottomSeparatorStyle;

        // TODO существует утилита ColumnSeparator, которая позже пересчитывает разделители.
        //  значит тут вроде вообще логика rightSeparatorSize ни к чему.
        const rightSeparatorSize = this.getRightSeparatorSize();

        // TODO существует утилита RowSeparator, которая позже пересчитывает разделители.
        //  значит тут вроде вообще логика rowSeparatorSize ни к чему.
        const rowSeparatorSize = (this._$rowSeparatorSize || 'null') as TRowSeparatorSize;
        if (rowSeparatorSize !== 'null') {
            if (this._$isTopSeparatorEnabledReact) {
                topSeparatorSize = rowSeparatorSize;
                if (this.getOwner().isFirstItem()) {
                    topSeparatorStyle = 'bold';
                }
            }

            if (this._$isBottomSeparatorEnabledReact) {
                bottomSeparatorSize = rowSeparatorSize;
                if (this.getOwner().isLastItem()) {
                    bottomSeparatorStyle = 'bold';
                }
            }
        }

        const roundBorder = this._getRoundBorder();

        const isScrollable =
            (this.getOwner().hasColumnScroll() || this.hasColumnScrollReact()) && !this._$isFixed;
        const cursor = getCursor(cellProps?.cursor || rowProps?.cursor || 'pointer', isScrollable);

        return {
            className,

            cellInputBackgroundVisible: cellProps?.inputBackgroundVisibility ?? true,
            isFirstCell: this.isFirstColumn(),
            isHasStickyProperty: this.getColumnConfig().stickyProperty !== undefined,
            isStickyLadderCell: Boolean(this['[Controls/_display/StickyLadderCell]']),
            isHiddenForLadder: this.getHiddenForLadder(),
            isMarked: rowProps.isMarked,

            isLastCell: this.isLastColumn(),

            fontSize: getInheritableCellProp('fontSize'),
            fontWeight: getInheritableCellProp('fontWeight'),
            fontColorStyle: getInheritableCellProp('fontColorStyle'),
            cursor,
            tooltip: cellProps?.tooltip,
            highlightOnHover: rowProps?.highlightOnHover,
            fadedClass: this.getOwner().getFadedClass() ?? '',

            markerVisible,
            marker: rowProps.marker ?? true,
            markerSize: markerVisible ? rowProps.markerSize : undefined,
            markerClassName: markerVisible ? rowProps.markerClassName : '',

            ...padding,
            marginLeft: this._$itemsContainerPadding?.left,
            marginRight: this._$itemsContainerPadding?.right,

            minHeight: cellProps?.minHeight ? 'null' : 'default',

            hoverMode: rowProps.hoverMode,

            backgroundStyle,
            hoverBackgroundStyle,
            backgroundColorStyle: columnConfig?.backgroundColorStyle,

            actionsVisibility: 'hidden',

            halign: cellProps?.halign || columnConfig?.align || rowProps.halign,
            valign: cellProps?.valign || columnConfig?.valign || rowProps.valign,
            baseline: cellProps?.baseline,

            startColspanIndex: colspanParams?.startColumn,
            endColspanIndex: colspanParams?.endColumn,
            colspan: this.getColspan(),

            topSeparatorSize,
            topSeparatorStyle,
            bottomSeparatorSize,
            bottomSeparatorStyle,
            leftSeparatorSize: 'null',
            rightSeparatorSize,

            borderVisibility,
            borderMode,
            borderStyle,

            shadowVisibility: rowProps.shadowVisibility,
            tagStyle: cellProps?.tagStyle || this?.item?.get?.(this.config?.tagStyleProperty), // this?.item может быть ID группы
            tagPosition:
                cellProps?.tagPosition ||
                (rightSeparatorSize && rightSeparatorSize !== 'null' ? 'border' : 'content'),

            editable: this.isEditable(),
            editing,
            cellUnderline: cellProps?.cellUnderline ?? false,

            stickied,
            stickyPosition: stickied && this.getStickyHeaderPosition(),
            stickyMode: stickied && this.getStickyHeaderMode(),
            stickiedBackgroundStyle,
            fixedBackgroundStyle: rowProps.fixedBackgroundStyle,
            textOverflow: cellProps?.textOverflow || columnConfig?.textOverflow,
            topLeftBorderRadius: cellProps?.topLeftBorderRadius || roundBorder.tl,
            topRightBorderRadius: cellProps?.topRightBorderRadius || roundBorder.tr,
            bottomRightBorderRadius: cellProps?.bottomRightBorderRadius || roundBorder.br,
            bottomLeftBorderRadius: cellProps?.bottomLeftBorderRadius || roundBorder.bl,
            pixelRatioBugFix: rowProps.pixelRatioBugFix,
            subPixelArtifactFix: rowProps.subPixelArtifactFix,
            actionsClassName:
                rowProps?.itemActionsClass && rowProps?.actionsClassName
                    ? rowProps?.actionsClassName + ` ${rowProps?.itemActionsClass}`
                    : rowProps?.actionsClassName,
            groupViewMode: rowProps?.groupViewMode,
            isDragged: this._$owner.isDragged(),
            markerPosition: rowProps?.markerPosition,
            href: rowProps.href,
        };
    }

    updateCellProps(): void {
        if (this.config?.getCellProps) {
            let contents = this.getOwner().getContents();
            contents = contents instanceof Array ? contents[contents.length - 1] : contents;
            this._cellProps = this.config.getCellProps(contents);
        } else {
            this._cellProps = null;
        }
    }

    getTextOverflow(): TOverflow {
        return this._cellProps?.textOverflow || this.config?.textOverflow;
    }

    // endregion CellProps
}

Object.assign(Cell.prototype, {
    '[Controls/_display/grid/Cell]': true,
    _moduleName: 'Controls/grid:GridCell',
    _instancePrefix: 'grid-cell-',
    _$owner: null,
    _$column: null,
    _$theme: 'default',
    _$style: 'default',
    _$colspan: null,
    _$rowspan: null,
    _$instanceId: null,
    _$isFirstDataCell: false,
    _$rowSeparatorSize: null,
    _$leftSeparatorSize: null,
    _$rightSeparatorSize: null,
    _$backgroundStyle: 'default',
    _$isSticked: null,
    _$shadowVisibility: 'visible',
    _$roundBorder: null,
    _$isFixed: null,
    _$isFixedToEnd: null,
    _$isHidden: null,
    _$isSingleColspanedCell: null,
    _$isActsAsRowTemplate: null,
    _$isLadderCell: null,
    _$isHiddenForLadder: null,
    _$isTopSeparatorEnabled: false,
    _$isBottomSeparatorEnabled: false,
    _$isTopSeparatorEnabledReact: false,
    _$isBottomSeparatorEnabledReact: false,
    _$stickyCallback: undefined,
    _$useSpacingColumn: false,
    _$directionality: 'ltr',
    _$itemsContainerPadding: null,
});
