/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import { mixin } from 'Types/util';
import { Model } from 'Types/entity';

import {
    getBorderClassName,
    ILadderConfig,
    IMarkable,
    TBorderStyle,
    TBorderVisibility,
    TLadderElement,
    TShadowVisibility,
} from 'Controls/display';

import { IDisplaySearchValue, IDisplaySearchValueOptions } from './interface/IDisplaySearchValue';

import ITagCell from './interface/ITagCell';
import ILadderContentCell from './interface/ILadderContentCell';
import IItemActionsCell from './interface/IItemActionsCell';
import Cell, { IOptions as ICellOptions } from './Cell';
import DataRow from './DataRow';
import DataCellCompatibility from './compatibility/DataCell';
import {
    IFontColorStyleOptions,
    IFontSizeOptions,
    IFontWeightOptions,
    ISearchValueOptions,
    TBackgroundStyle,
    TFontColorStyle,
    TFontSize,
    TFontWeight,
    TTagStyle,
} from 'Controls/interface';
import type { TItemActionsVisibility } from 'Controls/itemActions';
import { IColumn, IDisplayTypeOptions } from 'Controls/_grid/display/interface/IColumn';
import * as React from 'react';
import LadderWrapper from 'Controls/_grid/Render/types/LadderWrapper';
import type { ICellComponentProps, IRowComponentProps } from 'Controls/gridReact';

interface IContentRenderOptions
    extends IFontColorStyleOptions,
        IFontSizeOptions,
        IFontWeightOptions,
        ISearchValueOptions {
    displayTypeOptions: IDisplayTypeOptions;
    value: string | number | Date;
}

export interface IOptions<T extends Model = Model>
    extends ICellOptions<T>,
        IDisplaySearchValueOptions {}

/**
 * Ячейка строки таблицы, которая отображает данные из RecordSet-а
 * @private
 */
export default class DataCell<T extends Model = Model, TOwner extends DataRow<T> = DataRow<T>>
    extends mixin<Cell<T, TOwner>, DataCellCompatibility<T>>(Cell, DataCellCompatibility)
    implements IMarkable, ITagCell, IItemActionsCell, ILadderContentCell, IDisplaySearchValue
{
    readonly DisplaySearchValue: boolean = true;
    get Markable(): boolean {
        return true;
    }
    readonly Draggable: boolean = true;
    readonly TagCell: boolean = true;
    readonly SupportItemActions: boolean = true;
    readonly LadderContentCell: boolean = true;

    protected _$searchValue: string;

    constructor(options: IOptions) {
        super(options);
    }

    // region Ladder

    get ladder(): TLadderElement<ILadderConfig> {
        return this.getOwner()?.getLadder?.();
    }

    shouldDrawLadderContent(ladderProperty: string, stickyProperty: string): boolean {
        return this.getOwner().shouldDrawLadderContent(ladderProperty, stickyProperty);
    }

    getLadderWrapperClasses(ladderProperty: string, stickyProperty: string): boolean {
        return this.getOwner().getLadderWrapperClasses(ladderProperty, stickyProperty);
    }

    // endregion Ladder

    setSearchValue(searchValue: string): void {
        this._$searchValue = searchValue;
        this._nextVersion();
    }

    getContentClasses(
        backgroundColorStyle: TBackgroundStyle = this._$column.backgroundColorStyle,
        cursor: string = 'pointer',
        templateHighlightOnHover?: boolean,
        tmplIsEditable: boolean = true,
        templateHoverBackgroundStyle?: TBackgroundStyle
    ): string {
        let classes = super.getContentClasses(
            backgroundColorStyle,
            cursor,
            templateHighlightOnHover,
            tmplIsEditable,
            templateHoverBackgroundStyle
        );

        if (this._$owner.isAnimatedForSelection()) {
            classes += ' controls-ListView__item_rightSwipeAnimation';
        }

        if (this._$owner.getEditingConfig()?.mode === 'cell') {
            classes += ' controls-Grid__row-cell_editing-mode-single-cell';

            if (this.isFirstColumn()) {
                classes += ' controls-Grid__row-cell_editing-mode-single-cell_first';
            }

            if (this.isLastColumn()) {
                classes += ' controls-Grid__row-cell_editing-mode-single-cell_last';
            }

            if (this.isEditing()) {
                classes += ' controls-Grid__row-cell_single-cell_editing';
            } else {
                if (this.config.editable !== false && tmplIsEditable !== false) {
                    classes += ' controls-Grid__row-cell_single-cell_editable';
                } else {
                    classes +=
                        ' js-controls-ListView__notEditable controls-Grid__row-cell_single-cell_not-editable';
                }
            }
        }

        return classes;
    }

    /**
     * Предоставляет набор опций для декоратора,
     * если контент колонки выводится через декоратор
     * @param templateFontColorStyle Цвет шрифта
     * @param templateFontSize Размер шрифта
     * @param templateFontWeight Насыщенность шрифта
     */
    getCellContentRenderOptions(
        templateFontColorStyle?: TFontColorStyle,
        templateFontSize?: TFontSize,
        templateFontWeight?: TFontWeight
    ): IContentRenderOptions {
        const columnConfig: IColumn = this.getColumnConfig();
        const displayValue = this.getDisplayValue();
        return {
            displayTypeOptions: columnConfig.displayTypeOptions,
            fontColorStyle: columnConfig.fontColorStyle || templateFontColorStyle,
            fontSize: columnConfig.fontSize || templateFontSize,
            fontWeight: columnConfig.fontWeight || templateFontWeight,
            value: displayValue,
            title: displayValue,
            highlightedValue: this.getSearchValue(),
        };
    }

    getWrapperClasses(
        backgroundColorStyle: string,
        templateHighlightOnHover?: boolean,
        templateHoverBackgroundStyle?: string,
        shadowVisibility: TShadowVisibility = 'hidden',
        borderVisibility: TBorderVisibility = 'hidden',
        borderStyle: TBorderStyle = 'default'
    ): string {
        let classes = super.getWrapperClasses(
            backgroundColorStyle,
            templateHighlightOnHover,
            templateHoverBackgroundStyle
        );

        if (this.isFirstColumn()) {
            classes += ` controls-Grid__row-cell__first-${this.getStyle()}`;
        }
        if (this.isLastColumn()) {
            classes += ` controls-Grid__row-cell__last-${this.getStyle()}`;
        }

        // нужен shouldDisplayMarker именно для всего элемента, т.к. эти стили навешиваются на все ячейки для текста
        if (this.getOwner().shouldDisplayMarker()) {
            classes += ` controls-Grid__row-cell_selected controls-Grid__row-cell_selected-${this.getStyle()}`;

            if (this.isFirstColumn()) {
                classes += ` controls-Grid__row-cell_selected__first-${this.getStyle()}`;
            }
            if (this.isLastColumn()) {
                classes += ' controls-Grid__row-cell_selected__last';
                classes += ` controls-Grid__row-cell_selected__last-${this.getStyle()}`;
            }
        }

        if (this._$isFixed && this._$owner.getEditingConfig()?.mode === 'cell') {
            classes += ' controls-Grid__row-cell_single-cell-editable_fixed';
        }

        classes += getBorderClassName(
            borderVisibility,
            borderStyle,
            this.isFirstColumn(),
            this.isLastColumn()
        );
        classes += this._getShadowClasses(shadowVisibility);

        return classes;
    }

    // region Аспект "Рендер"

    hasCellContentRender(): boolean {
        return Boolean(
            (this.ladder && this.ladder[this.getDisplayProperty()]) || super.hasCellContentRender()
        );
    }

    getCellContentRender(clean: boolean = false): React.FunctionComponent {
        if (!clean && this.ladder && this.ladder[this.getDisplayProperty()]) {
            return LadderWrapper;
        } else {
            return super.getCellContentRender();
        }
    }

    getDefaultDisplayValue(): string | number {
        const itemModel = this._$owner.getContents();
        let result;
        if (itemModel instanceof Model) {
            result = itemModel.get(this.getDisplayProperty());
        } else {
            result = itemModel[this.getDisplayProperty()];
        }
        if (
            result !== undefined &&
            result !== null &&
            typeof result !== 'string' &&
            typeof result !== 'number'
        ) {
            result = result.toString();
        }
        return result;
    }

    getTooltip(): string {
        const itemModel = this._$owner.getContents();

        if (itemModel instanceof Model) {
            return itemModel.get(this.getTooltipProperty());
        } else {
            return itemModel[this.getTooltipProperty()];
        }
    }

    // endregion

    // region Аспект "Маркер"
    shouldDisplayMarker(marker?: boolean): boolean {
        return (
            marker !== false &&
            this._$owner.isMarked() &&
            !this.isEditing() &&
            !this._$owner.hasMultiSelectColumn() &&
            this._$isFirstDataCell
        );
    }

    // endregion

    // region Аспект "Тег"

    /**
     * Возвращает флаг, что надо или не надо показывать тег
     * @param tagStyle
     */
    shouldDisplayTag(tagStyle?: TTagStyle): boolean {
        return !!this.getTagStyle(tagStyle);
    }

    /**
     * Возвращает tagStyle для текущей колонки
     * @param tagStyle параметр, переданный напрямую в шаблон прикладниками
     */
    getTagStyle(tagStyle?: TTagStyle): TTagStyle {
        if (tagStyle) {
            return tagStyle;
        }
        const contents: Model = this._$owner.getContents() as undefined as Model;
        return this._$column?.tagStyleProperty && contents.get(this._$column.tagStyleProperty);
    }

    /**
     * Возвращает CSS класс для передачи в шаблон tag
     */
    getTagClasses(tagStyle: TTagStyle): string {
        let classes =
            'controls__tag_light controls-Grid__cell_tag' +
            ` controls__tag_light_style-${this.getTagStyle(tagStyle)}`;
        let tagPosition = 'content';
        if (
            (this._$rightSeparatorSize && this._$rightSeparatorSize.toLowerCase() !== 'null') ||
            (this._$leftSeparatorSize &&
                this._$leftSeparatorSize.toLowerCase() !== 'null' &&
                this.isLastColumn())
        ) {
            tagPosition = 'border';
        }
        classes += ` controls-Grid__cell_tag_position_${tagPosition}`;
        return classes;
    }

    // endregion

    // region Аспект "Редактирование по месту"

    isEditing(): boolean {
        if (this.getOwner().getEditingConfig()?.mode === 'cell') {
            return (
                this.getOwner().isEditing() &&
                this.getOwner().getEditingColumnIndex() === this.getColumnIndex()
            );
        } else {
            return this.getOwner().isEditing();
        }
    }

    // endregion

    // region Аспект "Кнопка редактирования"

    /**
     * Логика установки стиля фона для стрелки шеврона:
     * 1. Если прикладник явно указал стрелке backgroundStyle, то ставится backgroundStyle. Это необходимо, когда
     *    прикладник подсветку области строки и мы не можем самостоятельно определить, какой должен быть цвет у стрелки.
     *    backgroundStyle имеет значение независимо от состояния ховера на строке.
     * 2. Если включен поячеечный режим редактирования и ячейка не является редактируемой (не отмечена editable) и
     *    в шаблоне строки отключен ховер, ставится стиль single-cell.
     * 3. Если в шаблоне строки отключен ховер, то будет задан цвет фона записи в состоянии без ховера. Честный
     *    прозрачный фон сделать нельзя, т.к. у стрелки есть градиент.
     * 4. Для master добавлено специальное значение master
     * 5. Во всех остальных слуаях цвет равен hoverBackgroundStyle, который может быть установлен на списке, строке
     *    или ячейке.
     * @param backgroundStyle
     * @param templateHighlightOnHover
     * @param templateHoverBackgroundStyle
     * @param templateIsEditable
     */
    getEditArrowBackgroundStyle(
        backgroundStyle?: string,
        templateHighlightOnHover?: boolean,
        templateHoverBackgroundStyle?: string,
        templateIsEditable?: boolean
    ): string {
        if (backgroundStyle) {
            return backgroundStyle;
        }
        if (
            !templateHighlightOnHover &&
            this._$owner.getEditingConfig()?.mode === 'cell' &&
            (this.config.editable === false || templateIsEditable === false)
        ) {
            return 'single-cell';
        }
        if (templateHighlightOnHover === false) {
            return 'transparent';
        }
        if (this.getStyle() === 'master') {
            return 'master';
        }
        return (
            this._$column.hoverBackgroundStyle ||
            templateHoverBackgroundStyle ||
            this._$owner.getHoverBackgroundStyle()
        );
    }

    shouldDisplayEditArrow(contentTemplate?: React.Component | React.FunctionComponent): boolean {
        if (
            !!contentTemplate ||
            this.getColumnIndex() > (this._$owner.hasMultiSelectColumn() ? 1 : 0)
        ) {
            return false;
        }
        return this._$owner.editArrowIsVisible(this._$owner.getContents());
    }

    // endregion

    // region Аспект "Обрезка текста по многоточию"

    getTextOverflowClasses(): string {
        let classes = `controls-Grid__cell_${this.config.textOverflow || 'none'}`;

        // Для правильного отображения стрелки редактирования рядом с текстом, который
        // обрезается нужно повесить на контейнер с этим текстом специальные CSS классы
        if (this.config.textOverflow && this.shouldDisplayEditArrow(null)) {
            classes += ' controls-Grid__editArrow-cellContent';
            classes += ` controls-Grid__editArrow-overflow-${this.config.textOverflow}`;
        }
        return classes;
    }

    getTooltipOverflowClasses(): string {
        return this.hasCellContentRender()
            ? `controls-Grid__cell_tooltip_${this.config.textOverflow || 'none'}`
            : '';
    }

    getTextOverflowTitle(): string | number {
        return this.config.textOverflow && !this.config.template && !this.config.tooltipProperty
            ? this.getDefaultDisplayValue()
            : '';
    }

    // endregion

    // region Drag-n-drop

    shouldDisplayDraggingCounter(): boolean {
        return this.isLastColumn() && this.getOwner().shouldDisplayDraggingCounter();
    }

    getDraggedItemsCount(): number {
        return this.getOwner().getDraggedItemsCount();
    }

    // endregion Drag-n-drop

    // region Actions

    getActionsVisibility(actionsVisibility: TItemActionsVisibility): TItemActionsVisibility {
        return actionsVisibility !== 'hidden' && this.isLastColumn() ? actionsVisibility : 'hidden';
    }

    // endregion Actions

    // region CellProps

    getCellComponentProps(
        rowProps: IRowComponentProps,
        render: React.ReactElement
    ): ICellComponentProps {
        const superProps = super.getCellComponentProps(rowProps, render);
        const actionsVisibility = this.getActionsVisibility(rowProps.actionsVisibility);
        const actionsVisible = actionsVisibility !== 'hidden';

        let hoverBackgroundStyle = superProps.hoverBackgroundStyle;
        let borderVisibility = superProps.borderVisibility;
        let borderStyle = superProps.borderStyle;
        let className = superProps.className;

        const editingConfig = this.getEditingConfig();

        if (editingConfig?.mode === 'cell') {
            if (superProps.editing) {
                hoverBackgroundStyle = 'none';
                borderVisibility = 'visible';
                borderStyle = 'singleCellEditing';
            } else {
                if (superProps.editable !== false) {
                    hoverBackgroundStyle = 'list_singleCellEditable';
                    borderVisibility = 'onhover';
                    borderStyle = 'singleCellEditable';
                } else {
                    hoverBackgroundStyle = 'list_singleCellNotEditable';
                    borderVisibility = 'hidden';
                    className += ' js-controls-ListView__notEditable';
                }
            }
        }

        let actionsClassName: string | undefined = actionsVisible
            ? rowProps.actionsClassName
            : undefined;

        if (actionsVisible) {
            if (this.hasColumnScrollReact() && !this._$isSingleColspanedCell) {
                const selectors = this.getColumnScrollSelectors();
                actionsClassName =
                    (rowProps.actionsClassName || 'controls-itemActionsV_position_bottomRight') +
                    ` ${selectors.FIXED_TO_RIGHT_EDGE_ELEMENT}`;
            } else {
                actionsClassName = rowProps.actionsClassName;
            }
        }

        return {
            ...superProps,

            hoverBackgroundStyle,
            borderVisibility,
            borderStyle,
            className,

            actionsVisibility,
            actionHandlers: actionsVisible ? rowProps.actionHandlers : undefined,
            actionsClassName,
            draggingItemsCount: this.shouldDisplayDraggingCounter() && this.getDraggedItemsCount(),
            minHeightClassName: 'controls-GridReact__minHeight-data',
        };
    }

    isEditable(): boolean {
        return (
            !!this.config?.editorRender &&
            !!this.getEditingConfig() &&
            this._cellProps?.editable !== false
        );
    }

    // endregion CellProps
}

Object.assign(DataCell.prototype, {
    '[Controls/_display/grid/DataCell]': true,
    _moduleName: 'Controls/grid:GridDataCell',
    _$searchValue: '',
    _instancePrefix: 'grid-data-cell-',
});
