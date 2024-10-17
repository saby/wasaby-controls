/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import { mixin } from 'Types/util';
import { GroupMixin } from 'Controls/display';
import {
    IGridRowOptions,
    DEFAULT_GROUP_CELL_Z_INDEX,
    FIXED_GROUP_CELL_Z_INDEX,
} from 'Controls/baseGrid';
import type { ICellComponentProps } from 'Controls/gridReact';
import TreeGridDataCell, { ITreeGridDataCellOptions } from './TreeGridDataCell';
import type { IGroupNodeColumn } from 'Controls/_treeGrid/interface/IGroupNodeColumn';
import { ITreeRowComponentProps } from 'Controls/_baseTreeGrid/renderReact/CellRenderWithExpander';
import { IGroupContentProps } from 'Controls/baseList';

const GROUP_CELL_TEMPLATE = 'Controls/treeGrid:GroupColumnTemplate';

export interface ITreeGridGroupDataCell extends ITreeGridDataCellOptions<Model> {
    isExpanded: boolean;
}

/**
 * Ячейка строки с данными, которая отображается в виде группы
 * @private
 */
export default class TreeGridGroupDataCell<T extends Model = Model> extends mixin<
    TreeGridDataCell<T>,
    GroupMixin
>(TreeGridDataCell, GroupMixin) {
    readonly '[Controls/treeGrid:TreeGridGroupDataCell]': boolean;

    protected readonly _$column: IGroupNodeColumn;
    readonly _$isExpanded: boolean;

    readonly listInstanceName: string = 'controls-TreeGrid__group';

    constructor(options?: IGridRowOptions<T>) {
        super(options);
    }

    getTemplate(): TemplateFunction | string {
        const isFirstDataColumn =
            this.getColumnIndex() === (this._$owner.hasMultiSelectColumn() ? 1 : 0);
        if (this._$column?.groupNodeConfig || isFirstDataColumn) {
            return GROUP_CELL_TEMPLATE;
        }
        return this._$column?.template || this._defaultCellTemplate;
    }

    getWrapperClasses(
        backgroundColorStyle: string,
        templateHighlightOnHover?: boolean,
        templateHoverBackgroundStyle?: string
    ): string {
        let wrapperClasses = '';

        wrapperClasses += ` controls-Grid__row-cell controls-Grid__cell_${this.getStyle()}`;
        wrapperClasses += ` controls-Grid__row-cell_${this.getStyle()}`;
        wrapperClasses += ' controls-Grid__no-rowSeparator';
        wrapperClasses += ' controls-Grid__row-cell_withRowSeparator_size-null';
        wrapperClasses += ' controls-ListView__GroupContentWrapper';

        if (this.isFirstColumn()) {
            wrapperClasses += ' controls-ListView__GroupContentWrapper_first';
        }
        if (this.isLastColumn()) {
            wrapperClasses += ' controls-ListView__GroupContentWrapper_last';
        }

        if (this._$owner.hasColumnScroll()) {
            wrapperClasses += ` ${this._getColumnScrollWrapperClasses()}`;
        }

        return wrapperClasses;
    }

    getContentClasses(): string {
        let classes = '';
        classes += this._getHorizontalPaddingClasses(this._$column?.cellPadding);
        if (this._$owner.hasMultiSelectColumn() && this.isFirstColumn()) {
            classes += ` controls-Grid__cell_spacingFirstCol_${this._$owner.getLeftPadding()}`;
        }
        classes += this._getContentAlignClasses();
        classes += ' controls-ListView__groupContent controls-ListView__groupContent_height';
        // На ячейке, а не на шаблоне группы, т.к. тут отступы должны быть
        // одинаковыми для ячейки с заголовком группы и для ячеек с данными
        const groupNodePadding = this._$column?.groupNodeConfig?.padding;
        classes += ' controls-padding_top-' + (groupNodePadding?.top || 's');
        classes += ' controls-padding_bottom-' + (groupNodePadding?.bottom || '2xs');
        return classes;
    }

    // region Аспект "Ячейка группы"

    isExpanded(): boolean {
        return this._$isExpanded;
    }

    // endregion Аспект "Ячейка группы"

    getZIndex(): number {
        const defaultZIndex = DEFAULT_GROUP_CELL_Z_INDEX;
        return this._$isFixed ? Math.max(FIXED_GROUP_CELL_Z_INDEX, defaultZIndex) : defaultZIndex;
    }

    getVerticalStickyHeaderPosition(): string {
        return 'top';
    }

    getStickyHeaderMode(): string {
        return 'replaceable';
    }

    isNeedSubPixelArtifactFix(tmplSubPixelArtifactFixOption: boolean = false): boolean {
        return tmplSubPixelArtifactFixOption;
    }

    getCellComponentProps(rowProps: ITreeRowComponentProps): ICellComponentProps {
        const cellProps = super.getCellComponentProps(rowProps);

        let renderProps: IGroupContentProps = {};

        if (this.column.groupNodeConfig) {
            renderProps = {
                // TODO Оставить в 6100 только синтаксис paddingTop / paddingBottom и опубликовать новость
                paddingTop:
                    this.column.groupNodeConfig.padding?.top ||
                    this.column.groupNodeConfig.paddingTop ||
                    's',
                paddingBottom:
                    this.column.groupNodeConfig.padding?.bottom ||
                    this.column.groupNodeConfig.paddingBottom ||
                    '2xs',
                separatorVisible: this.column.groupNodeConfig.separatorVisibility,
                textVisible: this.column.groupNodeConfig.textVisible,
                halign: this.column.groupNodeConfig.textAlign,
                textRender: this.column.groupNodeConfig.render || this.getDefaultDisplayValue(),
                fontSize:
                    this.column.groupNodeConfig.fontSize ||
                    this._cellProps?.fontSize ||
                    cellProps?.fontSize,
                fontWeight:
                    this.column.groupNodeConfig.fontWeight ||
                    this._cellProps?.fontWeight ||
                    cellProps?.fontWeight,
                fontColorStyle:
                    this.column.groupNodeConfig.fontColorStyle ||
                    this._cellProps?.fontColorStyle ||
                    cellProps?.fontColorStyle,
                textTransform: this.column.groupNodeConfig.textTransform,
                expanderVisible: this.column.groupNodeConfig.expanderVisible,
                expanderPosition:
                    this.column.groupNodeConfig.expanderPosition ||
                    this.column.groupNodeConfig.expanderAlign,
                expanded: this.isExpanded(),
                iconStyle: this.column.groupNodeConfig.iconStyle,
                iconSize: this.column.groupNodeConfig.iconSize,
                decorationStyle: this.getStyle(),
            };

            // compatibility. В правильном случае в прикладной render не приходит никаких опций.
            // Прикладник может использовать useItemData.
            if (this.column.groupNodeConfig.contentTemplate) {
                renderProps.customTemplateProps = {
                    item: this.getOwner(),
                    itemData: this.getOwner(),
                    column: this,
                };
            }
        } else {
            // Настройка отступов для группы должна происходить только череез groupNodeConfig
            // По умолчанию все отсупы должны быть равны значениям из стандарта и не должны браться для грида
            renderProps.paddingTop = 's';
            renderProps.paddingBottom = '2xs';
            renderProps.expanderPosition = 'left';
        }

        delete cellProps.fixedBackgroundStyle;

        return {
            ...cellProps,
            ...renderProps,
            cursor: rowProps.cursor,
            // В разных ячейках может быть разный шрифт, но выравнивание настраивается одинаковое для всей строки
            baseline: rowProps.fontSize,
            groupNodeConfig: this.column.groupNodeConfig,
            markerVisible: false,
            // Вертикальное выравнивание в ячейке группы - всегда по центру, но контент внутри выравнивается по единой базовой линии.
            // См. getDirtyCellComponentContentRender в treeGrid.
            valign: 'center',
            minHeightClassName: 'controls-ListView__groupContent_height',
            hoverBackgroundStyle:
                cellProps.hoverBackgroundStyle !== undefined
                    ? cellProps.hoverBackgroundStyle
                    : 'default',
        };
    }
}

Object.assign(TreeGridGroupDataCell.prototype, {
    '[Controls/treeGrid:TreeGridGroupDataCell]': true,
    _moduleName: 'Controls/treeGrid:TreeGridGroupDataCell',
    _instancePrefix: 'tree-grid-group-data-cell-',
    _$isExpanded: null,
});
