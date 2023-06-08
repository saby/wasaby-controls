/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import { TemplateFunction } from 'UI/Base';
import { Model as EntityModel } from 'Types/entity';
import { mixin } from 'Types/util';

import { IColumn } from './interface/IColumn';
import { GroupMixin } from 'Controls/display';

import DataCell from './DataCell';
import GroupRow from './GroupRow';
import { TIconSize, TIconStyle } from 'Controls/interface';

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
}

export const DEFAULT_GROUP_CELL_Z_INDEX = 3;
export const FIXED_GROUP_CELL_Z_INDEX = 4;

/**
 * Ячейка строки, отображающей название группы
 * @private
 */
export default class GroupCell<
    TContents extends EntityModel = EntityModel
> extends mixin<DataCell<TContents, GroupRow<TContents>>, GroupMixin>(
    DataCell,
    GroupMixin
) {
    protected _$columnsLength: number;
    protected _$contents: string;
    protected _$zIndex: number;
    protected _$groupTemplate: TemplateFunction | string;
    protected _$metaResults: EntityModel;
    protected _$colspanGroup: EntityModel;

    // До https://online.sbis.ru/opendoc.html?guid=75486181-2f75-4fa6-bd74-79e475f618b9
    protected _$task1184913014: boolean;

    readonly listInstanceName: string = 'controls-Grid__group';

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
            this._$zIndex ||
            (this._$task1184913014 ? DEFAULT_GROUP_CELL_Z_INDEX : 2);
        return this._$isFixed
            ? Math.max(FIXED_GROUP_CELL_Z_INDEX, defaultZIndex)
            : defaultZIndex;
    }

    getContentStyles(): string {
        return 'display: contents;';
    }

    getTemplate(): TemplateFunction | string {
        return this._$groupTemplate;
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

    getExpanderClasses(
        expanderVisible: boolean = true,
        expanderAlign: 'right' | 'left' = 'left',
        iconSize: TIconSize,
        iconStyle: TIconStyle
    ): string {
        let classes = super.getExpanderClasses(
            expanderVisible,
            expanderAlign,
            iconSize,
            iconStyle
        );
        if (expanderVisible !== false) {
            classes += ' js-controls-Tree__row-expander';
        }
        return classes;
    }

    getWrapperClasses(backgroundColorStyle?: string): string {
        return super.getWrapperClasses(backgroundColorStyle, false);
    }

    protected _getWrapperSeparatorClasses(): string {
        let classes = ' controls-Grid__no-rowSeparator';
        classes += ' controls-Grid__row-cell_withRowSeparator_size-null';
        return classes;
    }

    protected _getWrapperBaseClasses(
        templateHighlightOnHover: boolean
    ): string {
        let classes = ` controls-Grid__row-cell controls-Grid__cell_${this.getStyle()}`;
        classes += ` controls-Grid__row-cell_${this.getStyle()}`;
        return classes;
    }

    isContentCell(): boolean {
        return !(
            (this._$owner.hasColumnScroll() ||
                this._$owner.hasNewColumnScroll()) &&
            !this._$isFixed
        );
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
    _$groupTemplate: 'Controls/grid:GroupTemplate',
    _$metaResults: null,
});
