/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { mixin } from 'Types/util';
import { Model } from 'Types/entity';
import { factory } from 'Types/chain';

import { IGroupNode } from 'Controls/display';
import type { IItemActionsHandler, IItemEventHandlers } from 'Controls/baseList';
import { ITreeItemOptions, TreeItem } from 'Controls/baseTree';
import { TSize } from 'Controls/interface';
import {
    IGridRowOptions,
    GridRowMixin,
    IDisplaySearchValue,
    IDisplaySearchValueOptions,
    TColumns,
    GridDataRow,
    IItemTemplateParams,
    getRowComponentProps,
    IColumn,
    IInitializeColumnsOptions,
} from 'Controls/baseGrid';

import TreeGridCollection from './TreeGridCollection';
import TreeCheckboxCell from './TreeCheckboxCell';
import { ITreeGridDataCellOptions } from './TreeGridDataCell';
import {
    ITreeRowComponentProps,
    ITreeRowProps,
} from 'Controls/_baseTreeGrid/renderReact/CellRenderWithExpander';

export interface IOptions<T extends Model>
    extends IGridRowOptions<T>,
        ITreeItemOptions<T>,
        IDisplaySearchValueOptions {
    owner: TreeGridCollection<T>;
}

/**
 * Строка иерархической коллекции, в которой отображаются данные из RecordSet-а
 * @private
 */
export default class TreeGridDataRow<T extends Model = Model>
    extends mixin<TreeItem<T>, GridRowMixin<T>>(TreeItem, GridRowMixin)
    implements IDisplaySearchValue, IGroupNode
{
    readonly '[Controls/_display/grid/Row]': boolean;
    readonly '[Controls/treeGrid:TreeGridDataRow]': boolean;

    readonly EditableItem: boolean = true;
    readonly DisplayItemActions: boolean = true;
    readonly DisplaySearchValue: boolean = true;

    get Markable(): boolean {
        return true;
    }

    readonly VirtualEdgeItem: boolean = true;
    readonly Fadable: boolean = true;
    readonly SelectableItem: boolean = true;
    readonly EnumerableItem: boolean = true;
    readonly EdgeRowSeparatorItem: boolean = true;
    readonly LadderSupport: boolean = true;
    readonly DraggableItem: boolean = true;
    protected _$searchValue: string;
    protected _$hasStickyGroup: boolean;

    readonly listInstanceName: string = 'controls-TreeGrid';

    readonly listElementName: string = 'row';

    constructor(options: IOptions<T>) {
        super(options);
        GridRowMixin.initMixin(this, options);
    }

    setGridColumnsConfig(columns: TColumns): void {
        this.setColumnsConfig(columns);
    }

    // TODO duplicate code with GridRow. Нужно придумать как от него избавиться.
    //  Проблема в том, что mixin не умеет объединять одинаковые методы, а логику Grid мы добавляем через mixin
    // region overrides

    protected _getBaseItemClasses(params: IItemTemplateParams): string {
        return super._getBaseItemClasses(params) + ' js-controls-Grid__data-row';
    }

    _hasCheckBoxCell(): boolean {
        return (
            this.getMultiSelectVisibility() !== 'hidden' &&
            this.getMultiSelectPosition() !== 'custom'
        );
    }

    setMultiSelectVisibility(multiSelectVisibility: string): boolean {
        const hadCheckBoxCell = this._hasCheckBoxCell();
        const isChangedMultiSelectVisibility = super.setMultiSelectVisibility(
            multiSelectVisibility
        );
        if (isChangedMultiSelectVisibility) {
            this._reinitializeColumns();
        }
        if (this.isEditing() && this.getEditingConfig()?.mode === 'cell') {
            if (isChangedMultiSelectVisibility) {
                const hasCheckBoxCell = this._hasCheckBoxCell();
                if (hadCheckBoxCell !== hasCheckBoxCell) {
                    this._$editingColumnIndex += hasCheckBoxCell ? 1 : -1;
                }
            }
        }
        return isChangedMultiSelectVisibility;
    }

    setEditing(
        editing: boolean,
        editingContents?: T,
        silent?: boolean,
        columnIndex?: number
    ): void {
        super.setEditing(editing, editingContents, silent, columnIndex);
        this.setRowTemplate(editing ? this._$owner.getItemEditorTemplate() : undefined);
        this.setRowTemplateOptions(
            editing ? this._$owner.getItemEditorTemplateOptions() : undefined
        );
        const colspanCallback = this._$owner.getColspanCallback();
        if (colspanCallback || this.getEditingConfig()?.mode === 'cell') {
            this._reinitializeColumns(true);
        }
    }

    setRowSeparatorSize(rowSeparatorSize: string): boolean {
        const changed = super.setRowSeparatorSize(rowSeparatorSize);
        if (changed && this._$columnItems) {
            this._updateSeparatorSizeInColumns('Row');
        }
        return changed;
    }

    setMarked(marked: boolean, silent?: boolean): void {
        const changed = marked !== this.isMarked();
        super.setMarked(marked, silent);
        if (changed) {
            this._redrawColumns('first');
        }
    }

    setDragTargetNode(isTarget: boolean): void {
        const changed = isTarget !== this.isDragTargetNode();
        super.setDragTargetNode(isTarget);
        if (changed) {
            this.getColumns().forEach((it) => {
                if (it['[Controls/treeGrid:TreeGridDataCell]']) {
                    it.setDragTargetNode(isTarget);
                }
            });
        }
    }

    protected _getColumnFactoryParams(
        column: IColumn,
        columnIndex: number
    ): Partial<ITreeGridDataCellOptions<T>> {
        return {
            ...super._getColumnFactoryParams(column, columnIndex),
            searchValue: this._$searchValue,
            isDragTargetNode: this.isDragTargetNode(),
        };
    }

    setSearchValue(searchValue: string): void {
        this._$searchValue = searchValue;
        if (this._$columnItems) {
            this._$columnItems.forEach((cell, cellIndex) => {
                if (cell.DisplaySearchValue) {
                    (cell as unknown as GridDataRow).setSearchValue(searchValue);
                }
            });
        }
        this._nextVersion();
    }

    getSearchValue(): string {
        return this._$searchValue;
    }

    setSelected(selected: boolean | null, silent?: boolean): void {
        const changed = this._$selected !== selected;
        super.setSelected(selected, silent);
        if (changed) {
            this._redrawColumns('first');
        }
    }

    setActive(active: boolean, silent?: boolean): void {
        const changed = active !== this.isActive();
        super.setActive(active, silent);
        if (changed) {
            this._redrawColumns('all');
        }
    }

    setHasStickyGroup(hasStickyGroup: boolean): void {
        if (this._$hasStickyGroup !== hasStickyGroup) {
            this._$hasStickyGroup = hasStickyGroup;
            this._nextVersion();
        }
    }

    hasStickyGroup(): boolean {
        return this._$hasStickyGroup;
    }

    // region RowProps

    getRowComponentProps(
        handlers?: IItemEventHandlers,
        actionHandlers?: IItemActionsHandler
    ): ITreeRowComponentProps {
        const rowProps: ITreeRowProps = this._rowProps || {};
        return {
            ...getRowComponentProps(rowProps, this, handlers, actionHandlers),

            expanderSize: this.getExpanderSize(rowProps.expanderSize),
            expanderIcon: this.getExpanderIcon(rowProps.expanderIcon),
            expanderIconSize: this.getExpanderIconSize(rowProps.expanderIconSize),
            expanderIconStyle: this.getExpanderIconStyle(rowProps.expanderIconStyle),
            expanderPaddingVisibility: rowProps.expanderPaddingVisibility,
            withoutExpanderPadding: this.getWithoutExpanderPadding(
                rowProps.withoutExpanderPadding,
                rowProps.expanderSize
            ),
            levelIndentSize: rowProps.levelIndentSize,
            withoutLevelPadding: this.getWithoutLevelPadding(rowProps.withoutLevelPadding),
            ['data-qa']: this.listElementName,
        };
    }

    // endregion RowProps

    // endregion overrides

    isGroupNode(): boolean {
        return false;
    }

    // Убираем ExpanderPadding для подуровней TreeGridGroupRow
    getWithoutExpanderPadding(withoutExpanderPadding: boolean, expanderSize?: TSize): boolean {
        const without = super.getWithoutExpanderPadding(withoutExpanderPadding, expanderSize);
        if (without) {
            return true;
        }

        const group = this.getParent();
        const parentIsInRoot = group.getParent()?.isRoot();
        if (group.GroupNodeItem && parentIsInRoot) {
            const childNodes = factory(group.getChildren())
                .toArray()
                .filter((it) => {
                    return it.isNode() !== null;
                });
            const hasChildNode = !!childNodes.length;
            const hasChildNodeWithChildren = childNodes.some((it) => {
                return it.getHasChildrenProperty() ? it.hasChildren() : it.hasChildrenByRecordSet();
            });
            const allowByChilds =
                this.getOwner().getExpanderVisibility() === 'hasChildren'
                    ? hasChildNodeWithChildren
                    : hasChildNode;
            return without || !allowByChilds;
        }

        return false;
    }

    protected _initializeColumns(options?: IInitializeColumnsOptions): void {
        super._initializeColumns({
            colspanStrategy: options?.colspanStrategy || 'skipColumns',
            extensionCellsConstructors: {
                multiSelectCell: TreeCheckboxCell,
            },
            ...options,
        });
    }
}

Object.assign(TreeGridDataRow.prototype, {
    '[Controls/treeGrid:TreeGridDataRow]': true,
    '[Controls/_display/grid/Row]': true,
    '[Controls/_display/TreeItem]': true,
    _cellModule: 'Controls/treeGrid:TreeGridDataCell',
    _moduleName: 'Controls/treeGrid:TreeGridDataRow',
    _$searchValue: '',
    _instancePrefix: 'tree-grid-row-',
    _$hasStickyGroup: false,
});
