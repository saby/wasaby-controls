/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
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
import { IColumn } from 'Controls/grid';
import { TColspanCallbackResult } from 'Controls/_grid/display/mixins/Grid';
import { IOptions as IGroupCellOptions } from 'Controls/_grid/display/GroupCell';
import { IItemTemplateParams } from 'Controls/_grid/display/mixins/Row';
import ItemActionsCell from 'Controls/_grid/display/ItemActionsCell';
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

    // Grid React
    protected _$groupRender: React.ReactElement;

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

        return {
            ...props,
            separatorVisible: groupProps.separatorVisible,
            textVisible: groupProps.textVisible,
            halign: groupProps.halign,
            expanded: this.isExpanded(),
            listElementName: this.listElementName,
            textRender: this.contents,
            isFirstItem: this.isFirstItem(),
            decorationStyle: this.getStyle(),
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
        return (
            `${this._getBaseItemClasses(params)} ` +
            `${this.getCursorClasses(params.cursor || 'default', params.clickable)} ` +
            `controls-ListView__group${this.isHiddenGroup() ? 'Hidden' : ''}`
        );
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
        if (
            !this._$colspanGroup &&
            this.hasColumnScroll() &&
            columnIndex < this.getStickyColumnsCount()
        ) {
            return this.getStickyColumnsCount();
        } else {
            return 'end';
        }
    }

    protected _initializeColumns(): void {
        // TODO: Перевезти на базовый механизм, аналогично подвалу, результатам и пустому представлению.
        //  Все методы уже есть для этого

        if (this._$columnsConfig) {
            this._$columnItems = this._prepareColumnItems(
                this._$columnsConfig,
                this.getColumnsFactory(),
                true,
                'colspan',
                true
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
            groupTemplate: this._$groupRender || this._groupTemplate,
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
    _$groupRender: undefined, // Grid React
    _$colspanGroup: true,
    _$task1184913014: false,
    _$metaResults: null,
});
