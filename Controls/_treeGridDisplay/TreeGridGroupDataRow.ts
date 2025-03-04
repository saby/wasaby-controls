/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import TreeGridDataRow, { IOptions as ITreeGridDataRowOptions } from './TreeGridDataRow';
import { IColumn, IItemTemplateParams, IInitializeColumnsOptions } from 'Controls/gridDisplay';
import { Model } from 'Types/entity';
import { IGroupNode } from 'Controls/display';
import { ITreeGridGroupDataCell } from './TreeGridGroupDataCell';

export interface IOptions<T extends Model> extends ITreeGridDataRowOptions<T> {
    isHiddenGroup: boolean;
}

/**
 * Строка с данными, которая отображается в виде группы
 * @private
 */
export default class TreeGridGroupDataRow<T extends Model = Model>
    extends TreeGridDataRow<T>
    implements IGroupNode
{
    $TGGR: boolean = true;

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
                multiSelectCell: this.getColumnsFactory({ column: {} }),
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
    $TGGR: true, // TreeGridGroupRow
    _cellModule: 'Controls/treeGrid:TreeGridGroupDataCell',
    _moduleName: 'Controls/treeGrid:TreeGridGroupDataRow',
    _$searchValue: '',
    _$isHiddenGroup: false,
    _instancePrefix: 'tree-grid-group-row-',
});
