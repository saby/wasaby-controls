/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';
import { TemplateFunction } from 'UI/Base';
import { mixin } from 'Types/util';
import { Model as EntityModel } from 'Types/entity';

import {
    ExpandableMixin,
    IExpandableMixinOptions,
    ICollectionItemOptions as IBaseCollectionItemOptions,
    GridLadderUtil,
    groupConstants,
} from 'Controls/display';

import DataRow from './DataRow';
import DataCell from './DataCell';
import Collection from './Collection';
import type { IColumn } from 'Controls/grid';
import { TColspanCallbackResult } from './mixins/Grid';
import { IOptions as IGroupCellOptions } from './GroupCell';
import { IItemTemplateParams } from './mixins/Row';
import ItemActionsCell from './ItemActionsCell';
import type { IItemActionsHandler, IItemEventHandlers } from 'Controls/baseList';
import type {
    IGroupProps,
    IGroupRowComponentProps,
    TGetGroupPropsCallback,
} from 'Controls/gridReact';

const GROUP_Z_INDEX_DEFAULT = 3;
const GROUP_Z_INDEX_WITHOUT_HEADERS_AND_RESULTS = 3;

export interface IOptions<T extends EntityModel = EntityModel>
    extends IBaseCollectionItemOptions<T>,
        IExpandableMixinOptions {
    owner: Collection<T>;
    metaResults: EntityModel;
    task1184913014: boolean;
}

/**
 * Строка, отображающая название группы
 * @private
 */
export default class GroupRow<TContents extends EntityModel = EntityModel> extends mixin<
    DataRow<TContents>,
    ExpandableMixin
>(DataRow, ExpandableMixin) {
    readonly EditableItem: boolean = false;
    readonly '[Controls/_display/GroupItem]': true;

    get Markable(): boolean {
        return false;
    }

    readonly VirtualEdgeItem: boolean = false;
    readonly Fadable: boolean = false;
    readonly SelectableItem: boolean = false;
    readonly EnumerableItem: boolean = false;
    readonly EdgeRowSeparatorItem: boolean = true;
    readonly DisplayItemActions: boolean = false;
    readonly DraggableItem: boolean = false;
    readonly LadderSupport: boolean = false;
    readonly SupportItemActions: boolean = false;
    readonly ActivatableItem: boolean = !this.isHiddenGroup();
    readonly '[Controls/_display/grid/GroupRow]': true;

    protected _$columnItems: DataCell[];
    protected _groupTemplate: TemplateFunction | string;
    protected _$metaResults: EntityModel;
    protected _$colspanGroup: boolean;

    // До https://online.sbis.ru/opendoc.html?guid=75486181-2f75-4fa6-bd74-79e475f618b9
    protected _$task1184913014: boolean;

    protected _$getGroupProps: TGetGroupPropsCallback;

    readonly listElementName: string = 'group';

    constructor(options?: IOptions<TContents>) {
        super(options);
        ExpandableMixin.initMixin(this);
    }

    get key(): TContents {
        return this._$contents;
    }

    isHiddenGroup(): boolean {
        return this._$contents === groupConstants.hiddenGroup;
    }

    getRowComponentProps(
        handlers?: IItemEventHandlers,
        actionHandlers?: IItemActionsHandler
    ): IGroupRowComponentProps {
        const groupProps: IGroupProps = this._rowProps || {};
        const props = super.getRowComponentProps(handlers, actionHandlers);

        props.className =
            (props.className ? `${props.className} ` : '') +
            `controls-ListView__group${this.isHiddenGroup() ? 'Hidden' : ''}`;
        if (!this.isExpanded()) {
            props.className += ' controls-ListView__group_collapsed';
        }

        return {
            ...props,
            separatorVisible: groupProps.separatorVisible,
            textVisible: groupProps.textVisible,
            halign: groupProps.halign,
            expanded: this.isExpanded(),
            listElementName: this.listElementName,
            textRender: this.contents,
            isFirstItem: this.isFirstItem(),
            fontSize: groupProps.fontSize || props?.fontSize,
            fontWeight: groupProps.fontWeight || props?.fontWeight,
            fontColorStyle: groupProps.fontColorStyle || props?.fontColorStyle,
            textTransform: groupProps.textTransform,
            expanderVisible: groupProps.expanderVisible,
            expanderPosition: groupProps.expanderPosition,
            iconStyle: groupProps.iconStyle,
            iconSize: groupProps.iconSize,
            colspanGroup: this.getColspanGroup(),
            rightTemplate: groupProps.rightTemplate,
            paddingTop: groupProps.paddingTop,
            paddingBottom: groupProps.paddingBottom,
        };
    }

    protected _updateRowProps(): void {
        this._rowProps =
            typeof this._$getGroupProps === 'function'
                ? (this._$getGroupProps(this.getContents()) as IGroupProps)
                : null;
    }

    setGetGroupPropsCallback(getGroupProps: TGetGroupPropsCallback): void {
        this._$getGroupProps = getGroupProps;
        this._updateRowProps();
        this._nextVersion();
    }

    // FIXME: перебитие метода с другой сигнатурой + сайд эффект в виде установки шаблона при вызове метода getSmth
    getTemplate(
        itemTemplateProperty: string,
        userItemTemplate: TemplateFunction | string,
        userGroupTemplate?: TemplateFunction | string
    ): TemplateFunction | string {
        if (userGroupTemplate) {
            this._groupTemplate = userGroupTemplate;
        } else {
            this._groupTemplate = null;
        }
        return 'Controls/grid:ItemTemplate';
    }

    isSticked(): boolean {
        return this._$owner.isStickyGroup() && !this.isHiddenGroup();
    }

    // TODO Убрать после https://online.sbis.ru/opendoc.html?guid=b8c7818f-adc8-4e9e-8edc-ec1680f286bb
    isIosZIndexOptimized(): boolean {
        return false;
    }

    getStickyColumn(): GridLadderUtil.IStickyColumn {
        return this._$owner.getStickyColumn();
    }

    getItemClasses(params: IItemTemplateParams): string {
        let classes =
            `${this._getBaseItemClasses(params)} ` +
            `${this.getCursorClasses(params.cursor || 'default', params.clickable)} ` +
            `controls-ListView__group${this.isHiddenGroup() ? 'Hidden' : ''}`;
        if (!this.isExpanded()) {
            classes += ' controls-ListView__group_collapsed';
        }
        return classes;
    }

    protected _getBaseItemClasses(params: IItemTemplateParams): string {
        let itemClasses = 'controls-ListView__itemV';
        if (!this.isHiddenGroup()) {
            itemClasses += ` controls-Grid__row controls-Grid__row_${this.getStyle()}`;
        }
        return itemClasses;
    }

    getItemTemplateOptions(): object {
        const itemTemplateOptions = { ...super.getItemTemplateOptions() };
        if (itemTemplateOptions && this.getGroupViewMode() !== 'titledBlocks') {
            delete itemTemplateOptions.backgroundColorStyle;
        }
        return itemTemplateOptions;
    }

    getStickyHeaderZIndex(): number {
        return this.hasHeader() || this.getResultsPosition()
            ? GROUP_Z_INDEX_DEFAULT
            : GROUP_Z_INDEX_WITHOUT_HEADERS_AND_RESULTS;
    }

    setExpanded(expanded: boolean, silent?: boolean): void {
        super.setExpanded(expanded, silent);
        this._nextVersion();
    }

    setMetaResults(metaResults: EntityModel): void {
        this._$metaResults = metaResults;
        this._nextVersion();
    }

    getMetaResults(): EntityModel {
        return this._$metaResults;
    }

    getColspanGroup(): boolean {
        return this._$colspanGroup;
    }

    setColspanGroup(colspanGroup: boolean): void {
        if (this._$colspanGroup !== colspanGroup) {
            this._$colspanGroup = colspanGroup;
            this._reinitializeColumns();
        }
    }

    protected _getColspan(column: IColumn, columnIndex: number): TColspanCallbackResult {
        const hasColumnScroll = this.hasColumnScroll() || this.hasColumnScrollReact();
        if (!this._$colspanGroup && hasColumnScroll && columnIndex < this.getStickyColumnsCount()) {
            return this.getStickyColumnsCount();
        } else {
            return 'end';
        }
    }

    _$getColspan(column, columnIndex) {
        return this._getColspan(column, columnIndex);
    }

    protected _initializeColumns(): void {
        // TODO: Перевезти на базовый механизм, аналогично подвалу, результатам и пустому представлению.
        //  Все методы уже есть для этого

        if (this._$columnsConfig) {
            const prepareColumnItemsParams = {
                columns: this._$columnsConfig,
                factory: this.getColumnsFactory(),
                shouldColspanWithMultiselect: true,
                prepareStickyLadderCellsStrategy: 'colspan',
                skipColumns: true,
                preventSeparateColspanedRow: false,
                shouldAddSpacingCell: true,

                // Костыль для старого скролла колонок, при котором в случае shouldColspanWithMultiselect
                // будет считаться, что из-за multiSelect число закреплённых колонок увеличилось на 1,
                // В GridReact надо сделать расчёт без костылей
                shiftFixedColumnIndexWhenMultiselect: this.hasMultiSelectColumn(),
            };
            this._$columnItems = this._prepareColumnItems(
                prepareColumnItemsParams.columns,
                prepareColumnItemsParams.factory,
                prepareColumnItemsParams.shouldColspanWithMultiselect,
                prepareColumnItemsParams.prepareStickyLadderCellsStrategy,
                prepareColumnItemsParams.skipColumns,
                prepareColumnItemsParams.preventSeparateColspanedRow,
                prepareColumnItemsParams.shouldAddSpacingCell,
                prepareColumnItemsParams.shiftFixedColumnIndexWhenMultiselect
            );

            if (this.hasItemActionsSeparatedCell()) {
                this._$columnItems.push(
                    new ItemActionsCell({
                        owner: this,
                        instanceId: `${this.key}_column_separated-actions`,
                        // FIXME: Ну как же ноль, если это последняя ячейка.
                        ...this._getColumnFactoryParams({}, 0),
                        column: {},
                    })
                );
            }
        }
    }

    protected _getColumnFactoryParams(
        column: IColumn,
        columnIndex: number
    ): Partial<IGroupCellOptions<TContents>> {
        return {
            ...super._getColumnFactoryParams(column, columnIndex),
            columnsLength: this._$columnsConfig.length,
            column: {},
            contents: this.getContents(),
            zIndex: this.getStickyHeaderZIndex(),
            metaResults: this.getMetaResults(),
            groupTemplate: this._groupTemplate,
            colspanGroup: this._$colspanGroup,
            task1184913014: this._$task1184913014,
        };
    }
}

Object.assign(GroupRow.prototype, {
    '[Controls/_display/GroupItem]': true,
    '[Controls/_display/grid/GroupRow]': true,
    _moduleName: 'Controls/grid:GridGroupRow',
    _cellModule: 'Controls/grid:GridGroupCell',
    _instancePrefix: 'grid-group-item-',
    _$getGroupProps: undefined,
    _$colspanGroup: true,
    _$task1184913014: false,
    _$metaResults: null,
});
