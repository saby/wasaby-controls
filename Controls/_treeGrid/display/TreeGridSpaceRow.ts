/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { Model } from 'Types/entity';
import { TOffsetSize } from 'Controls/interface';
import {
    IColumn,
    IInitializeColumnsOptions,
    TColspanCallbackResult,
} from 'Controls/grid';
import TreeGridDataRow, {
    IOptions,
} from 'Controls/_treeGrid/display/TreeGridDataRow';

export interface ITreeGridSpaceRowOptions<T extends Model = Model>
    extends IOptions<T> {
    itemsSpacing?: TOffsetSize;
}

export default class TreeGridSpaceRow<
    T extends Model = Model
> extends TreeGridDataRow<T> {
    readonly '[Controls/_display/grid/Row]': boolean;
    readonly '[Controls/treeGrid:TreeGridDataRow]': boolean;

    readonly EditableItem: boolean = false;
    readonly DisplayItemActions: boolean = false;
    readonly SupportItemActions: boolean = false;
    readonly DisplaySearchValue: boolean = false;
    get Markable(): boolean {
        return false;
    }
    readonly Fadable: boolean = false;
    readonly SelectableItem: boolean = false;
    readonly EnumerableItem: boolean = false;
    readonly EdgeRowSeparatorItem: boolean = false;
    readonly LadderSupport: boolean = false;
    readonly DraggableItem: boolean = false;

    readonly listElementName: string = 'space-item';

    protected _$itemsSpacing: TOffsetSize;

    constructor(options: ITreeGridSpaceRowOptions<T>) {
        super(options);
    }

    /**
     * Возвращает текущую высоту записи-отступа
     */
    getItemsSpacing(): TOffsetSize {
        return this._$itemsSpacing;
    }

    /**
     * Задает высоту записи-отступа
     */
    setItemsSpacing(itemsSpacing: TOffsetSize): void {
        this._$itemsSpacing = itemsSpacing;
        this._nextVersion();
    }

    protected _getColspan(
        column: IColumn,
        columnIndex: number
    ): TColspanCallbackResult {
        return 'end';
    }

    protected _initializeColumns(options?: IInitializeColumnsOptions): void {
        super._initializeColumns({
            ...options,
            shouldAddMultiSelectCell: false,
        });
    }
}

Object.assign(TreeGridSpaceRow.prototype, {
    '[Controls/_display/SpaceCollectionItem]': true,
    '[Controls/treeGrid:TreeGridSpaceRow]': true,
    '[Controls/_display/grid/Row]': true,
    '[Controls/_display/TreeItem]': true,
    _cellModule: 'Controls/grid:SpaceCell',
    _moduleName: 'Controls/treeGrid:TreeGridSpaceRow',
    _instancePrefix: 'tree-grid-row-',
    _$itemsSpacing: null,
});
