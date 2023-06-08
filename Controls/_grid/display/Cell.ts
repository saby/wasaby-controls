/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
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
    TItemActionsPosition,
    TMarkerSize,
    TShadowVisibility,
    InstantiableMixin,
    TRowSeparatorSize,
} from 'Controls/display';
import { COLUMN_SCROLL_JS_SELECTORS, DRAG_SCROLL_JS_SELECTORS } from 'Controls/columnScroll';
import type { StickyMode, StickyVerticalPosition } from 'Controls/stickyBlock';

import Row from './Row';
import {
    IRoundBorder,
    TBackgroundStyle,
    TFontColorStyle,
    TFontSize,
    TFontWeight,
    TOverflow,
    IBorderProps,
} from 'Controls/interface';
import * as React from 'react';
import { IDataTypeRenderProps } from '../Render/types/interface';
import MoneyRender from '../Render/types/MoneyRender';
import NumberRender from '../Render/types/NumberRender';
import DateRender from '../Render/types/DateRender';
import StringSearchRender from '../Render/types/StringSearchRender';
import StringRender from '../Render/types/StringRender';
import type { ICellProps, ICellComponentProps, IRowComponentProps } from 'Controls/gridReact';
import type { IGridSelectors } from 'Controls/gridColumnScroll';
import { StickyHorizontalPosition } from '../../_stickyBlock/types';

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
        return this._$column?.key || this.getDisplayProperty();
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
                    this.getSearchValue() &&
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

    getSearchValue(): string {
        return this.getOwner().getSearchValue();
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
    protected _getColspanParams(): IColspanParams {
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
        const colspanParams = this._getColspanParams();
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
            wrapperClasses += ` ontrols-ListView__item_animated_${this._$owner.getAnimation()} `;
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

    protected _getRoundBorderClasses(): string {
        let classes = '';
        if (this._$roundBorder && this.isFirstColumn()) {
            classes += ` controls-ListView__item_roundBorder_topLeft_${
                this._$roundBorder?.tl || 'default'
            }`;
            classes += ` controls-ListView__item_roundBorder_bottomLeft_${
                this._$roundBorder?.bl || 'default'
            }`;
        }
        if (this._$roundBorder && this.isLastColumn()) {
            classes += ` controls-ListView__item_roundBorder_topRight_${
                this._$roundBorder?.tr || 'default'
            }`;
            // Если операции над записью должны показаться под записью,
            // то не нужно скругление правого нижнего уголка последней ячейки
            if (this.getItemActionsPosition() !== 'outside') {
                classes += ` controls-ListView__item_roundBorder_bottomRight_${
                    this._$roundBorder?.br || 'default'
                }`;
            }
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
        }

        contentClasses += ' controls-Grid__row-cell__content_baseline_default';
        contentClasses += ` controls-Grid__row-cell_cursor-${cursor}`;

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

    isNeedSubPixelArtifactFix(tmplSubPixelArtifactFixOption: boolean): boolean {
        if (tmplSubPixelArtifactFixOption === undefined) {
            return this.getColumnIndex() !== 0;
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

            if (lower === 'null' || lower === 's') {
                return lower;
            }
        }
        return 'null';
    }

    isActive(): boolean {
        return this._$owner.isActive() && !this.isEditing();
    }

    protected _getWrapperBaseClasses(templateHighlightOnHover: boolean): string {
        let classes = '';

        const topPadding = this._$owner.getTopPadding();
        const bottomPadding = this._$owner.getBottomPadding();
        const isEditing = this.isEditing();
        const isSingleCellEditing = this._$owner.getEditingConfig()?.mode === 'cell';
        const isDragged = this._$owner.isDragged();
        const editingBackgroundStyle = this._$owner.getEditingBackgroundStyle();

        classes += ` controls-Grid__row-cell controls-Grid__cell_${this.getStyle()}`;
        classes += ' js-controls-Grid__row-cell';
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

        if (topPadding === 'null' && bottomPadding === 'null') {
            classes += ' controls-Grid__row-cell_small_min_height';
        } else {
            classes += ' controls-Grid__row-cell_default_min_height';
        }

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
        let classes = '';

        const topPadding = this._$owner.getTopPadding();
        const bottomPadding = this._$owner.getBottomPadding();

        // top <-> bottom
        classes += ` controls-Grid__row-cell_rowSpacingTop_${topPadding}`;
        classes += ` controls-Grid__row-cell_rowSpacingBottom_${bottomPadding}`;

        return classes;
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

    getCellComponentProps(
        rowProps: IRowComponentProps,
        render: React.ReactElement
    ): ICellComponentProps {
        const cellProps = this._cellProps;

        const getInheritableCellProp = <T extends keyof ICellProps>(
            name: T,
            defaultValue?: ICellProps[T]
        ): ICellProps[T] =>
            this._cellProps?.[name] || (rowProps as ICellProps)[name] || defaultValue;

        const backgroundStyle = getInheritableCellProp('backgroundStyle');

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

        const isFirstColumnAfterCheckbox =
            this.getColumnIndex() === 1 && this._$owner.hasMultiSelectColumn();
        const paddingLeft = isFirstColumnAfterCheckbox
            ? 'null'
            : cellProps?.padding?.left || (this.isFirstColumn() && 'm') || undefined;
        const paddingRight = cellProps?.padding?.right || (this.isLastColumn() && 'm') || undefined;

        const colspanParams = this._getColspanParams();

        // Border не наследуется от строки.
        const borderVisibility: IBorderProps['borderVisibility'] =
            cellProps?.borderVisibility || 'hidden';
        const borderStyle: IBorderProps['borderStyle'] =
            borderVisibility !== 'hidden'
                ? getInheritableCellProp('borderStyle', 'default')
                : undefined;

        let className: string = '';

        if (this.hasColumnScrollReact()) {
            const selectors = this.getColumnScrollSelectors();
            className += this._$isFixed
                ? `${selectors.FIXED_ELEMENT} ${selectors.FIXED_CELL}`
                : `${selectors.SCROLLABLE_ELEMENT} ${selectors.SCROLLABLE_CELL}`;

            if (this._$isSingleColspanedCell) {
                className += ` controls-GridReact__cell_fullColspan_columnScroll ${selectors.STRETCHED_TO_VIEWPORT_ELEMENT}`;
            }
        }

        let topSeparatorSize: TRowSeparatorSize = 'null';
        let bottomSeparatorSize: TRowSeparatorSize = 'null';
        let topSeparatorStyle;
        let bottomSeparatorStyle;

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

        return {
            render,
            className,

            isFirstCell: this.isFirstColumn(),
            isLastCell: this.isLastColumn(),

            fontSize: getInheritableCellProp('fontSize'),
            fontWeight: getInheritableCellProp('fontWeight'),
            fontColorStyle: getInheritableCellProp('fontColorStyle'),
            cursor: getInheritableCellProp('cursor'),
            tooltip: cellProps?.tooltip,

            markerVisible,
            markerSize: markerVisible ? rowProps.markerSize : undefined,
            markerClassName: markerVisible ? rowProps.markerClassName : '',

            paddingLeft,
            paddingRight,
            paddingTop: rowProps.paddingTop,
            paddingBottom: rowProps.paddingBottom,

            backgroundStyle,
            hoverBackgroundStyle: getInheritableCellProp('hoverBackgroundStyle'),

            actionsVisibility: 'hidden',

            halign: cellProps?.halign,
            valign: cellProps?.valign,

            startColspanIndex: colspanParams?.startColumn,
            endColspanIndex: colspanParams?.endColumn,

            topSeparatorSize,
            topSeparatorStyle,
            bottomSeparatorSize,
            bottomSeparatorStyle,
            leftSeparatorSize: 'null',
            rightSeparatorSize: this.getRightSeparatorSize(),

            borderVisibility,
            borderStyle,

            shadowVisibility: rowProps.shadowVisibility,
            tagStyle: cellProps?.tagStyle,
            tagPosition: cellProps?.tagPosition || 'border',

            editable: this.isEditable(),
            editing: this.isEditable() && this.isEditing(),

            stickied,
            stickyPosition: stickied && this.getStickyHeaderPosition(),
            stickyMode: stickied && this.getStickyHeaderMode(),
            stickiedBackgroundStyle,
            showEditArrow: this.shouldDisplayEditArrow(this.config?.render),
            textOverflow: cellProps?.textOverflow,
        };
    }

    updateCellProps(): void {
        this._cellProps = this.config?.getCellProps
            ? this.config.getCellProps(this.getOwner().getContents())
            : null;
    }

    getTextOverflow(): TOverflow {
        return this._cellProps?.textOverflow;
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
});
