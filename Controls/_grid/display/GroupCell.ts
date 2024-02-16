/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import * as React from 'react';
import { TemplateFunction } from 'UI/Base';
import { Model as EntityModel } from 'Types/entity';
import { mixin } from 'Types/util';

import { IColumn } from './interface/IColumn';
import { GroupMixin } from 'Controls/display';

import DataCell from './DataCell';
import GroupRow from './GroupRow';
import type { TGetGroupPropsCallback, IGroupComponentProps } from 'Controls/gridReact';
import { IGroupRowComponentProps } from 'Controls/gridReact';
import { GroupContentComponent } from 'Controls/baseList';

export interface IOptions<T> {
    owner: GroupRow<T>;
    column: IColumn;
    columnsLength: number;
    contents: string;
    groupTemplate: TemplateFunction | string;
    zIndex?: number;
    metaResults: EntityModel;
    colspanGroup?: boolean;
    task1184913014?: boolean;
    getGroupProps?: TGetGroupPropsCallback;
}

export const DEFAULT_GROUP_CELL_Z_INDEX = 3;
export const FIXED_GROUP_CELL_Z_INDEX = 4;

const DEFAULT_GROUP_RENDER = 'Controls/grid:GroupTemplate';

/**
 * Ячейка строки, отображающей название группы
 * @private
 */
export default class GroupCell<TContents extends EntityModel = EntityModel> extends mixin<
    DataCell<TContents, GroupRow<TContents>>,
    GroupMixin
>(DataCell, GroupMixin) {
    protected _$columnsLength: number;
    protected _$contents: string;
    protected _$zIndex: number;
    protected _$groupTemplate: TemplateFunction | string;
    protected _$metaResults: EntityModel;
    protected _$colspanGroup: EntityModel;

    // До https://online.sbis.ru/opendoc.html?guid=75486181-2f75-4fa6-bd74-79e475f618b9
    protected _$task1184913014: boolean;

    readonly listInstanceName: string = 'controls-Grid__group';

    getCellComponentProps(
        rowProps: IGroupRowComponentProps,
        render: React.ReactElement
    ): IGroupComponentProps {
        const cellProps = super.getCellComponentProps(rowProps, render);
        const GroupCellRender = this._$groupTemplate || GroupContentComponent;

        cellProps.render = React.createElement(GroupCellRender, {
            ...rowProps,
            textVisible: rowProps.textVisible !== false && this.isContentCell(),
            rightPaddingClassName: this.getGroupPaddingClasses('right'),
            leftPaddingClassName: this.getGroupPaddingClasses('left'),
            rightTemplateCondition: !this.isContentCell() || rowProps.colspanGroup,
        });

        delete cellProps.fontSize;
        delete cellProps.fontWeight;
        delete cellProps.fontColorStyle;

        cellProps.valign = 'center';
        cellProps.paddingTop = null;
        cellProps.paddingBottom = null;
        cellProps.minHeightClassName = 'controls-ListView__groupContent_height';
        cellProps.hoverBackgroundStyle = 'none';
        return cellProps;
    }

    // region overrides

    getWrapperStyles(): string {
        let style = this.getColspanStyles();
        if (this._$task1184913014) {
            style += ` z-index: ${this.getZIndex()};`;
        }
        return style.trim();
    }

    getZIndex(): number {
        const defaultZIndex =
            this._$zIndex || (this._$task1184913014 ? DEFAULT_GROUP_CELL_Z_INDEX : 2);
        return this._$isFixed ? Math.max(FIXED_GROUP_CELL_Z_INDEX, defaultZIndex) : defaultZIndex;
    }

    getContentStyles(): string {
        return 'display: contents;';
    }

    getTemplate(): TemplateFunction | string {
        return this._$groupTemplate || DEFAULT_GROUP_RENDER;
    }

    // endregion overrides

    // region Аспект "Рендер"

    getDefaultDisplayValue(): string {
        return this._$contents;
    }

    // endregion Аспект "Рендер"

    // region Аспект "Ячейка группы"

    getMetaResults(): EntityModel {
        return this._$metaResults;
    }

    isExpanded(): boolean {
        return this._$owner.isExpanded();
    }

    getWrapperClasses(backgroundColorStyle?: string): string {
        let classes = super.getWrapperClasses(backgroundColorStyle, false);
        if (this.isStickied()) {
            classes = classes.replace('controls-background-transparent', '');
        }
        return classes;
    }

    protected _getWrapperSeparatorClasses(): string {
        let classes = ' controls-Grid__no-rowSeparator';
        classes += ' controls-Grid__row-cell_withRowSeparator_size-null';
        return classes;
    }

    protected _getWrapperBaseClasses(templateHighlightOnHover: boolean): string {
        let classes = ` controls-Grid__row-cell controls-Grid__cell_${this.getStyle()}`;
        classes += ` controls-Grid__row-cell_${this.getStyle()}`;
        return classes;
    }

    isContentCell(): boolean {
        const hasColumnScroll =
            this._$owner.hasColumnScroll() || this._$owner.hasColumnScrollReact();
        return !(hasColumnScroll && !this._$isFixed);
    }

    getGroupPaddingClasses(side: 'left' | 'right'): string {
        let classes = '';
        if (side === 'left' && this.isFirstColumn()) {
            classes += ` controls-Grid__cell_spacingFirstCol_${this._$owner.getLeftPadding()}`;
        }
        if (side === 'right' && this.isLastColumn()) {
            classes += ` controls-Grid__cell_spacingLastCol_${this._$owner.getRightPadding()}`;
        }
        return classes;
    }

    // endregion Аспект "Ячейка группы"

    getVerticalStickyHeaderPosition(): string {
        return 'top';
    }

    getStickyHeaderMode(): string {
        return 'replaceable';
    }
}

Object.assign(GroupCell.prototype, {
    '[Controls/_display/grid/GroupCell]': true,
    _moduleName: 'Controls/grid:GridGroupCell',
    _instancePrefix: 'grid-group-cell-',
    _$owner: null,
    _$columnsLength: null,
    _$task1184913014: false,
    _$zIndex: null,
    _$colspanGroup: true,
    _$contents: null,
    _$groupTemplate: undefined,
    _$metaResults: null,
});
