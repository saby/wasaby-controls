/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { TemplateFunction } from 'UI/Base';
import { Model as EntityModel } from 'Types/entity';

import { IColumn } from './interface/IColumn';

import DataCell from './DataCell';
import GroupRow from './GroupRow';
import type { TGetGroupPropsCallback } from 'Controls/gridReact';

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

/**
 * Ячейка строки, отображающей название группы
 * @private
 */
export default class GroupCell<TContents extends EntityModel = EntityModel> extends DataCell<
    TContents,
    GroupRow<TContents>
> {
    protected _$columnsLength: number;
    protected _$contents: string;
    protected _$zIndex: number;
    protected _$groupTemplate: TemplateFunction | string;
    protected _$metaResults: EntityModel;
    protected _$colspanGroup: EntityModel;
    readonly '[Controls/_display/grid/GroupCell]': boolean;

    // До https://online.sbis.ru/opendoc.html?guid=75486181-2f75-4fa6-bd74-79e475f618b9
    protected _$task1184913014: boolean;

    readonly listInstanceName: string = 'controls-Grid__group';

    // region overrides

    getZIndex(): number {
        const defaultZIndex =
            this._$zIndex || (this._$task1184913014 ? DEFAULT_GROUP_CELL_Z_INDEX : 2);
        return this._$isFixed ? Math.max(FIXED_GROUP_CELL_Z_INDEX, defaultZIndex) : defaultZIndex;
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

    isContentCell(): boolean {
        const hasColumnScroll =
            this._$owner.hasColumnScroll() || this._$owner.hasColumnScrollReact();
        return !(hasColumnScroll && !this._$isFixed);
    }

    getDisplayValue(): string | number | Date {
        if (!this.getContents().get) {
            return this.getContents();
        }
        return super.getDisplayValue();
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
