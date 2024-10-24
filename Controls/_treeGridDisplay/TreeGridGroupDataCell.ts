/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import {
    IGridRowOptions,
    DEFAULT_GROUP_CELL_Z_INDEX,
    FIXED_GROUP_CELL_Z_INDEX,
} from 'Controls/gridDisplay';
import type { ICellComponentProps } from 'Controls/gridReact';
import TreeGridDataCell, { ITreeGridDataCellOptions } from './TreeGridDataCell';
import type { IGroupNodeColumn } from 'Controls/_treeGrid/interface/IGroupNodeColumn';
import type { ITreeRowComponentProps } from 'Controls/treeGrid';
import { IGroupContentProps } from 'Controls/baseList';

export interface ITreeGridGroupDataCell extends ITreeGridDataCellOptions<Model> {
    isExpanded: boolean;
}

/**
 * Ячейка строки с данными, которая отображается в виде группы
 * @private
 */
export default class TreeGridGroupDataCell<T extends Model = Model> extends TreeGridDataCell<T> {
    readonly '[Controls/treeGrid:TreeGridGroupDataCell]': boolean;

    protected readonly _$column: IGroupNodeColumn;
    readonly _$isExpanded: boolean;

    readonly listInstanceName: string = 'controls-TreeGrid__group';

    constructor(options?: IGridRowOptions<T>) {
        super(options);
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
