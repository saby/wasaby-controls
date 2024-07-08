/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { Model } from 'Types/entity';
import { TOffsetSize, TVisibility } from 'Controls/interface';
import { IColumn, IInitializeColumnsOptions, TColspanCallbackResult } from 'Controls/baseGrid';
import TreeGridDataRow, { IOptions } from './TreeGridDataRow';
import { SpaceCollectionItem } from 'Controls/display';

export interface ITreeGridSpaceRowOptions<T extends Model = Model> extends IOptions<T> {
    itemsSpacing?: TOffsetSize;
}

export default class TreeGridSpaceRow<T extends Model = Model> extends TreeGridDataRow<T> {
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

    // В explorer записи TreeGrid рендерятся через шаблон Controls/list:ItemTemplate
    getWrapperClasses(): string {
        let result = super.getWrapperClasses(false, 'default');
        result += ' controls-List__SpaceItem';
        return result;
    }

    // В explorer записи TreeGrid рендерятся через шаблон Controls/list:ItemTemplate
    getContentClasses(): string {
        return SpaceCollectionItem.buildVerticalSpacingClass(this.getItemsSpacing());
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

    protected _getColspan(column: IColumn, columnIndex: number): TColspanCallbackResult {
        if (this.hasColumnScrollReact()) {
            if (columnIndex < this.getStickyColumnsCount()) {
                return this.getStickyColumnsCount();
            } else {
                return 'end';
            }
        }
        return 'end';
    }

    protected _initializeColumns(options?: IInitializeColumnsOptions): void {
        super._initializeColumns({
            ...options,
            colspanStrategy: 'consistently',
            shouldAddMultiSelectCell: false,
        });
    }

    protected getMultiSelectVisibility(): TVisibility {
        return 'hidden';
    }

    protected getMultiSelectPosition(): string {
        return 'custom';
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
