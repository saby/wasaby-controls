/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import TreeGridDataRow, {
    IOptions as ITreeGridDataRowOptions,
} from 'Controls/_treeGrid/display/TreeGridDataRow';
import {IColumn, GridCell, IItemTemplateParams, IInitializeColumnsOptions} from 'Controls/grid';
import {Model} from 'Types/entity';
import {IGroupNode, TExpanderPaddingVisibility} from 'Controls/display';
import {ITreeGridGroupDataCell} from './TreeGridGroupDataCell';

export interface IOptions<T extends Model> extends ITreeGridDataRowOptions<T> {
    isHiddenGroup: boolean;
}

/**
 * Строка с данными, которая отображается в виде группы
 * @private
 */
export default class TreeGridGroupDataRow<T extends Model = Model>
    extends TreeGridDataRow<T>
    implements IGroupNode {
    '[Controls/treeGrid:TreeGridGroupDataRow]': boolean = true;

    get Markable(): boolean {
        return false;
    }

    readonly Fadable: boolean = false;
    readonly SelectableItem: boolean = false;
    readonly EnumerableItem: boolean = false;
    readonly EdgeRowSeparatorItem: boolean = true;
    readonly DraggableItem: boolean = false;
    readonly LadderSupport: boolean = false;
    readonly SupportItemActions: boolean = true;
    readonly GroupNodeItem: boolean = true;

    protected _$isHiddenGroup: boolean;

    readonly listElementName: string = 'group';

    constructor(options: IOptions<T>) {
        super(options);
    }

    // region overrides

    getItemClasses(params: IItemTemplateParams): string {
        let classes = super.getItemClasses({
            ...params,
            clickable: false
        });
        classes += ` controls-ListView__group${
            this.isHiddenGroup() ? 'Hidden' : ''
        } controls-TreeGrid__groupNode`;
        return classes;
    }

    setExpanded(expanded: boolean, silent?: boolean): void {
        super.setExpanded(expanded, silent);
        this._reinitializeColumns();
    }

    isHiddenGroup(): boolean {
        return this._$isHiddenGroup;
    }

    setIsHiddenGroup(isHiddenGroup: boolean): void {
        if (this._$isHiddenGroup !== isHiddenGroup) {
            this._$isHiddenGroup = isHiddenGroup;
            this._nextVersion();
        }
    }

    isSticked(): boolean {
        return this.getOwner().isStickyGroup() && !this.isHiddenGroup();
    }

    // TODO Убрать после https://online.sbis.ru/opendoc.html?guid=b8c7818f-adc8-4e9e-8edc-ec1680f286bb
    isIosZIndexOptimized(): boolean {
        return false;
    }

    protected _getBaseItemClasses(params: IItemTemplateParams): string {
        let itemClasses = 'controls-ListView__itemV';
        if (!this.isHiddenGroup()) {
            itemClasses += ` controls-Grid__row controls-Grid__row_${this.getStyle()}`;
        }
        return itemClasses;
    }

    protected _getColumnFactoryParams(
        column: IColumn,
        columnIndex: number
    ): Partial<ITreeGridGroupDataCell> {
        return {
            ...super._getColumnFactoryParams(column, columnIndex),
            isExpanded: this.isExpanded(),
        };
    }

    protected _initializeColumns(options?: IInitializeColumnsOptions): void {
        super._initializeColumns({
            shouldAddMultiSelectCell: true,
            prepareStickyLadderCellsStrategy: 'colspan',
            extensionCellsConstructors: {
                multiSelectCell: this.getColumnsFactory({column: {}}),
            },
        });
    }

    getItemActionPositionClasses(itemActionsPosition: string, itemActionsClass: string): string {
        return itemActionsClass || 'controls-itemActionsV_position_bottomRight';
    }

    getLevel(): number {
        const level = super.getLevel();
        return level - 1;
    }

    isGroupNode(): boolean {
        return true;
    }

    // endregion overrides
}

Object.assign(TreeGridGroupDataRow.prototype, {
    'Controls/treeGrid:TreeGridGroupDataRow': true,
    _cellModule: 'Controls/treeGrid:TreeGridGroupDataCell',
    _moduleName: 'Controls/treeGrid:TreeGridGroupDataRow',
    _$searchValue: '',
    _$isHiddenGroup: false,
    _instancePrefix: 'tree-grid-group-row-',
});
