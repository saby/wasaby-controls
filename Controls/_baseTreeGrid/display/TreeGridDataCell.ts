/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import * as React from 'react';
import { Model } from 'Types/entity';

import { GridDataCell, IGridDataCellOptions } from 'Controls/baseGrid';
import {
    isFullGridSupport,
    TBorderVisibility,
    TShadowVisibility,
    TBorderStyle,
} from 'Controls/display';
import { ITreeItemOptions, IExpanderProps } from 'Controls/baseTree';
import { TFontSize } from 'Controls/interface';

import TreeGridDataRow from './TreeGridDataRow';
import {
    default as CellRenderWithExpander,
    ITreeCellComponentProps,
    ITreeRowComponentProps,
} from '../renderReact/CellRenderWithExpander';
import { IItemsContainerPadding } from 'Controls/grid';

export interface ITreeGridDataCellOptions<T extends Model>
    extends IGridDataCellOptions<T>,
        ITreeItemOptions<T> {
    isDragTargetNode?: boolean;
}

/**
 * Ячейка иерархической коллекции, в которой отображаются данные из RecordSet-а
 * @private
 */
export default class TreeGridDataCell<T extends Model> extends GridDataCell<T, TreeGridDataRow<T>> {
    readonly '[Controls/treeGrid:TreeGridDataCell]': boolean;

    protected _$owner: TreeGridDataRow<T>;

    private _$isDragTargetNode: boolean;

    readonly listInstanceName: string = 'controls-TreeGrid';

    readonly listElementName: string = 'cell';

    getWrapperClasses(
        backgroundColorStyle: string,
        templateHighlightOnHover?: boolean,
        templateHoverBackgroundStyle?: string,
        shadowVisibility: TShadowVisibility = 'hidden',
        borderVisibility: TBorderVisibility = 'hidden',
        borderStyle: TBorderStyle = 'default',
        itemsContainerPadding?: IItemsContainerPadding
    ): string {
        let classes = super.getWrapperClasses(
            backgroundColorStyle,
            templateHighlightOnHover,
            templateHoverBackgroundStyle,
            shadowVisibility,
            borderVisibility,
            borderStyle
        );

        if (this._$owner.isDragTargetNode()) {
            classes += ' controls-TreeGridView__dragTargetNode';
            if (this.isFirstColumn()) {
                classes += ' controls-TreeGridView__dragTargetNode_first';
            }

            if (this.isLastColumn()) {
                classes += ' controls-TreeGridView__dragTargetNode_last';
            }

            // controls-Grid__no-rowSeparator перебивает стили dragTargetNode
            classes = classes.replace('controls-Grid__no-rowSeparator', '');
        }
        if (itemsContainerPadding) {
            if (this.isFirstColumn() && itemsContainerPadding.left) {
                classes += ` controls-TreeGridView__itemsContainerPadding_left-${itemsContainerPadding.left}`;
            }
            if (this.isLastColumn() && itemsContainerPadding.right) {
                classes += ` controls-TreeGridView__itemsContainerPadding_right-${itemsContainerPadding.right}`;
            }
        }

        return classes;
    }

    getRelativeCellWrapperClasses(): string {
        let classes = super.getRelativeCellWrapperClasses();

        if (!isFullGridSupport()) {
            classes = 'controls-TreeGridView__row-cell_innerWrapper ' + classes;
        }

        return classes;
    }

    getContentClasses(
        backgroundColorStyle: string = this._$column.backgroundColorStyle,
        cursor: string = 'pointer',
        templateHighlightOnHover: boolean,
        tmplIsEditable: boolean = true,
        templateHoverBackgroundStyle?: string
    ): string {
        let classes = super.getContentClasses(
            backgroundColorStyle,
            cursor,
            templateHighlightOnHover,
            tmplIsEditable,
            templateHoverBackgroundStyle
        );

        if (!this._$owner.hasMultiSelectColumn() && this.isFirstColumn() && isFullGridSupport()) {
            classes += ` controls-Grid__cell_spacingFirstCol_${this._$owner.getLeftPadding()}`;
        }
        return classes;
    }

    isDragTargetNode(): boolean {
        return this._$isDragTargetNode;
    }

    setDragTargetNode(isTarget: boolean): void {
        if (this._$isDragTargetNode !== isTarget) {
            this._$isDragTargetNode = isTarget;
            this._nextVersion();
        }
    }

    getCellComponentProps(
        rowProps: ITreeRowComponentProps,
        render: React.ReactElement
    ): ITreeCellComponentProps {
        const cellProps = super.getCellComponentProps(rowProps, render);

        const columnIndex = this.getColumnIndex(false, false);
        const hasMultiSelect = this.getOwner().hasMultiSelectColumn();
        const isFirstDataCell =
            (columnIndex === 0 && !hasMultiSelect) || (columnIndex === 1 && hasMultiSelect);

        const shouldDisplayExpander =
            this.getOwner().shouldDisplayExpanderBlock(rowProps.expanderPaddingVisibility) &&
            isFirstDataCell;

        /*
         * Если не меняются пропсы, CellRenderWithExpander не будет изменяться.
         * При этом, hasChildren - явно изменяемое динамически свойство, оно должно перерисовывать ячейку.
         */
        const expanderProps: IExpanderProps = {
            expanderSize: rowProps.expanderSize,
            expanderIcon: rowProps.expanderIcon,
            expanderIconSize: rowProps.expanderIconSize,
            expanderIconStyle: rowProps.expanderIconStyle,
            expanderPaddingVisibility: rowProps.expanderPaddingVisibility,
            withoutExpanderPadding: rowProps.withoutExpanderPadding,
            levelIndentSize: rowProps.levelIndentSize,
            withoutLevelPadding: rowProps.withoutLevelPadding,
            expanderPosition: this.getOwner().getExpanderPosition(),
            hasChildren: this.getOwner().getHasChildrenProperty()
                ? this.getOwner().hasChildren()
                : this.getOwner().hasChildrenByRecordSet(),
        };

        const fontSize = this._resolveFontSize(cellProps.fontSize);
        return {
            ...cellProps,
            fontSize,
            render: shouldDisplayExpander && cellProps.render
                ? React.createElement(CellRenderWithExpander, {
                      ...cellProps,
                      ...expanderProps,
                      fontSize,
                      expanded: this.getOwner().isExpanded(),
                  })
                : cellProps.render,
        };
    }

    private _resolveFontSize(fontSize: TFontSize): TFontSize {
        if (fontSize) {
            return fontSize;
        }
        // См controls-Grid__row-cell_master
        //    controls-Grid__row-cell_selected-master
        if (this.getStyle() === 'master') {
            return 'l';
        }
        if (this._$owner.isGroupNode()) {
            return null;
        }
        if (this._$owner.isNode()) {
            return '2xl';
        }
        if (this._$owner.isNode() === false) {
            return 'xl';
        }
        return null;
    }

    protected _getWrapperBaseClasses(templateHighlightOnHover: boolean): string {
        let classes = super._getWrapperBaseClasses(templateHighlightOnHover);
        classes += ` controls-TreeGrid__row-cell controls-TreeGrid__row-cell_${this.getStyle()}`;

        if (this._$owner.isNode()) {
            classes += ' controls-TreeGrid__row-cell__node';
        } else if (this._$owner.isNode() === false) {
            classes += ' controls-TreeGrid__row-cell__hiddenNode';
        } else {
            classes += ' controls-TreeGrid__row-cell__item';
        }

        return classes;
    }
}

Object.assign(TreeGridDataCell.prototype, {
    '[Controls/treeGrid:TreeGridDataCell]': true,
    _moduleName: 'Controls/treeGrid:TreeGridDataCell',
    _instancePrefix: 'tree-grid-data-cell-',
    _$isDragTargetNode: false,
});
