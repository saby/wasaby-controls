/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
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
import { TBackgroundStyle, TTagStyle } from 'Controls/interface';
import type { TItemActionsVisibility } from 'Controls/itemActions';
import * as React from 'react';
import type { ICellComponentProps, IRowComponentProps } from 'Controls/gridRender';
import { loadSync } from 'WasabyLoader/ModulesLoader';

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

    // TODO Used in LadderCell
    getWrapperClasses(): string {
        return '';
    }

    // region Аспект "Рендер"

    getCellContentRender(clean: boolean = false): React.FunctionComponent {
        if (!clean && this.ladder && this.ladder[this.getDisplayProperty()]) {
            return loadSync<typeof import('Controls/grid:TypesLadderWrapper')>(
                'Controls/grid:TypesLadderWrapper'
            );
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

    getTextOverflowTitle(): string | number {
        return this.config.textOverflow && !this.config.template && !this.config.tooltipProperty
            ? this.getDefaultDisplayValue()?.toString()
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

    getCellEditorProps<
        T extends {
            editing: ICellComponentProps['editing'];
            editable: ICellComponentProps['editable'];
            editingMode?: ICellComponentProps['editingMode'];
            backgroundStyle: ICellComponentProps['backgroundStyle'];
            stickiedBackgroundStyle: ICellComponentProps['stickiedBackgroundStyle'];
            hoverBackgroundStyle: ICellComponentProps['hoverBackgroundStyle'];
            borderVisibility: ICellComponentProps['borderVisibility'];
            borderStyle: ICellComponentProps['borderStyle'];
            borderMode: ICellComponentProps['borderMode'];
            className: ICellComponentProps['className'];
            hoverMode: ICellComponentProps['hoverMode'];
            highlightOnHover: ICellComponentProps['highlightOnHover'];
        },
    >(config: T): T {
        const editingConfig = this.getEditingConfig();
        const editableBackgroundStyle = 'list_singleCellEditable';
        const notEditableBackgroundStyle = 'list_singleCellNotEditable';

        config.editingMode = editingConfig?.mode;

        if (editingConfig?.mode === 'cell') {
            config.borderMode = 'cell';

            if (config.editing) {
                config.hoverBackgroundStyle = 'none';
                config.borderVisibility = 'visible';
                config.borderStyle = 'singleCellEditing';
            } else {
                if (config.editable !== false) {
                    if (config.hoverMode !== 'row' && config.hoverBackgroundStyle === 'none') {
                        config.hoverBackgroundStyle = editableBackgroundStyle;
                    }
                    config.borderVisibility = 'onhover';
                    config.borderStyle = 'singleCellEditable';
                    config.highlightOnHover = true;
                } else {
                    if (config.hoverMode !== 'row' && config.hoverBackgroundStyle === 'none') {
                        config.hoverBackgroundStyle = notEditableBackgroundStyle;
                    }
                    config.borderVisibility = 'hidden';
                    config.highlightOnHover = true;
                }
            }
        } else if (config.editing) {
            config.backgroundStyle = `editing_${this._$owner.getEditingBackgroundStyle()}`;
            config.hoverBackgroundStyle = 'none';
            config.stickiedBackgroundStyle = config.backgroundStyle;
        }
        return config;
    }

    // region CellProps
    getCellComponentProps(rowProps: IRowComponentProps): ICellComponentProps {
        const superProps = super.getCellComponentProps(rowProps);
        const actionsVisibility = this.getActionsVisibility(rowProps.actionsVisibility);
        const actionsVisible = actionsVisibility !== 'hidden';

        const cellEditorProps = this.getCellEditorProps({
            backgroundStyle: superProps.backgroundStyle,
            stickiedBackgroundStyle: superProps.stickiedBackgroundStyle,
            hoverBackgroundStyle: superProps.hoverBackgroundStyle,
            borderVisibility: superProps.borderVisibility,
            borderStyle: superProps.borderStyle,
            borderMode: superProps.borderMode,
            className: superProps.className,
            editing: superProps.editing,
            editable: superProps.editable,
            hoverMode: superProps.hoverMode,
            highlightOnHover: rowProps.highlightOnHover,
        });

        let actionsClassName: string | undefined =
            rowProps.actionsClassName || superProps.actionsClassName;

        if (
            actionsVisible &&
            this.getOwner().hasColumnScroll() &&
            !this._$isSingleColspanedCell &&
            !this._$isFixedToEnd
        ) {
            const selectors = this.getColumnScrollSelectors();
            actionsClassName =
                (actionsClassName || 'controls-itemActionsV_position_bottomRight') +
                ` ${selectors.FIXED_TO_RIGHT_EDGE_ELEMENT}`;
        }

        return {
            ...superProps,
            ...cellEditorProps,

            actionsVisibility,
            actionHandlers: actionsVisible ? rowProps.actionHandlers : undefined,
            actionsClassName,
            actionsPosition: this.getItemActionsPosition(),
            draggingItemsCount: this.shouldDisplayDraggingCounter() && this.getDraggedItemsCount(),
            minHeightClassName: this.calculationMinHeightClass(rowProps),
        };
    }

    isEditable(): boolean {
        const editingConfig = this.getEditingConfig();
        const hasEditingConfig = !!editingConfig;
        // Используется "чистый" реакт рендер
        const isReactEIP =
            (!!this.config?.key ||
                !!this.config?.render ||
                !!this.config?.editorRender ||
                !!this.config?.getCellProps) &&
            !this.config?.template &&
            !this.config?.editorTemplate;

        // Ячейка:
        // содержит шаблон редактирования и (?)
        // не отмечена как нередактируемая, значит редатируется.
        const isCellEditableByReactConfig =
            isReactEIP &&
            (!!this.config?.editorRender || !!this.config?.dynamicCellEditorRender) &&
            this._cellProps?.editable !== false;

        // Ячейка:
        // не отмечена как нередактируемая, значит редатируется.
        const isCellEditableByCompatibleConfig = !isReactEIP && this.config?.editable !== false;

        return (
            hasEditingConfig && (isCellEditableByReactConfig || isCellEditableByCompatibleConfig)
        );
    }

    // endregion CellProps
}

Object.assign(DataCell.prototype, {
    $GDC: true, // GridDataCell
    _moduleName: 'Controls/grid:GridDataCell',
    _$searchValue: '',
    _instancePrefix: 'grid-data-cell-',
});
