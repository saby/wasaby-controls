/**
 * @kaizen_zone ba2b1294-cc16-4bec-aaf4-e4f0bc5bd89b
 */
import { CrudEntityKey } from 'Types/source';
import {
    ISelectionObject as ISelection,
    TSelectionCountMode,
    TSelectionType,
} from 'Controls/interface';
import type { Tree, TreeItem } from 'Controls/baseTree';

import {
    IEntryPathItem,
    ISelectionModel,
    ITreeSelectionStrategyOptions,
} from 'Controls/_multiselection/interface';
import { Utils as BaseUtils } from 'Controls/abstractSelectionAspect';
import { FlatSelectionStrategy } from 'Controls/_multiselection/SelectionStrategy/Flat';
import {
    HierarchySelectionStrategy,
    IHierarchySelectionState,
} from 'Controls/hierarchySelectionAspect';

const TREE_ITEM = '[Controls/_display/TreeItem]';
const BREADCRUMBS = '[Controls/_baseTree/BreadcrumbsItem]';

/**
 * Стратегия выбора для иерархического списка.
 * @public
 */
export class TreeSelectionStrategy<
    TItem extends TreeItem = TreeItem
> extends FlatSelectionStrategy<TItem> {
    private _selectAncestors: boolean;
    private _selectDescendants: boolean;
    private _rootKey: CrudEntityKey;
    protected _model: ISelectionModel & Tree;
    private _entryPath: IEntryPathItem[];
    private _selectionType: TSelectionType | 'allBySelectAction' = 'all';
    private _selectionCountMode: TSelectionCountMode = 'all';
    private _recursiveSelection: boolean;
    private _rootChanged: boolean = false;
    private _isMassSelectMode: boolean = true;
    private _feature1188089336: boolean = false;

    constructor(options: ITreeSelectionStrategyOptions) {
        super(options);
        this.update(options);
        this._newStrategy = new HierarchySelectionStrategy(!!this._feature1188089336);
    }

    update(options: ITreeSelectionStrategyOptions): void {
        this._validateOptions(options);

        if (this._rootKey !== undefined && this._rootKey !== options.rootKey) {
            this._rootChanged = true;
        }

        this._selectAncestors = options.selectAncestors;
        this._selectDescendants = options.selectDescendants;
        this._rootKey = options.rootKey;
        this._model = options.model;
        this._entryPath = options.entryPath;
        this._selectionType = options.selectionType;
        this._recursiveSelection = options.recursiveSelection;
        this._selectionCountMode = options.selectionCountMode;
        this._feature1188089336 = options.feature1188089336;
    }

    setEntryPath(entryPath: IEntryPathItem[]): void {
        this._entryPath = entryPath;
    }

    toggleAll(selection: ISelection, hasMoreData: boolean): ISelection {
        return this._call('toggleAll', selection, hasMoreData, this._rootChanged);
    }

    reset(): void {
        this._rootChanged = false;
    }

    getSelectedItems(selection: ISelection, selectedItems?: TItem[]): TItem[] {
        const filterTreeItems = (item) => item[TREE_ITEM] || item[BREADCRUMBS];
        const filterNotSelectedNodes = (item) => {
            const key = BaseUtils.getKey(item);
            return (
                filterTreeItems(item) &&
                (!HierarchySelectionStrategy.isNode(item) ||
                    HierarchySelectionStrategy.isSelectedByParent(
                        this._getCompatibleState(selection),
                        key
                    ) ||
                    selection.selected.includes(key))
            );
        };
        let result = [];
        const selectionForModel = this.getSelectionForModel(selection);
        const newSelectedItems = selectionForModel.get(true).filter(filterNotSelectedNodes);
        if (selectedItems?.length) {
            const unselectedItems = selectionForModel.get(false).filter(filterTreeItems);
            const unselectedItemsKeys = unselectedItems.map((item: TItem) =>
                BaseUtils.getKey(item)
            );
            const filteredUnselectedItems = selectedItems.filter((selectedItem) => {
                return !unselectedItemsKeys.includes(BaseUtils.getKey(selectedItem));
            });
            const newSelectedItemsKeys = newSelectedItems.map((item: TItem) =>
                BaseUtils.getKey(item)
            );
            const filteredUnselectedChildren = filteredUnselectedItems.filter((selectedItem) => {
                return !newSelectedItemsKeys.includes(BaseUtils.getKey(selectedItem));
            });
            result = filteredUnselectedChildren.concat(newSelectedItems);
        } else {
            result = newSelectedItems;
        }
        return result;
    }

    setMassSelect(isMassSelected: boolean): void {
        this._isMassSelectMode = isMassSelected;
    }

    private _getCompatibleState(selection: ISelection): IHierarchySelectionState {
        return {
            selectionModel: new Map(),
            selectedKeys: selection.selected,
            excludedKeys: selection.excluded,
            recursiveSelection: this._recursiveSelection,

            entryPath: this._entryPath,
            collection: this._model,
            selectAncestors: this._selectAncestors,
            selectDescendants: this._selectDescendants,
            isMassSelectMode: this._isMassSelectMode,
            selectionType: this._selectionType,
            root: this._rootKey,

            keyProperty: this._model.getKeyProperty(),
            nodeProperty: this._model.getNodeProperty(),
            parentProperty: this._model.getParentProperty(),
            multiSelectAccessibilityProperty: this._model.getMultiSelectAccessibilityProperty(),
            items: this._model.getSourceCollection(),
            declaredChildrenProperty: this._model.getChildrenProperty(),
        };
    }

    private _validateOptions(options: ITreeSelectionStrategyOptions): void {
        if (options.selectionCountMode === 'leaf') {
            if (options.selectionType === 'node' && options.recursiveSelection === false) {
                throw Error(
                    'Не правильно заданы опции множественного выбора. Запрещено выбирать листья, но нужно их считать. ' +
                        'Обратить внимание на опции: selectionCountMode, selectionType, recursiveSelection'
                );
            }
        }
        if (options.selectionCountMode === 'node' && options.selectionType === 'leaf') {
            throw Error(
                'Не правильно заданы опции множественного выбора. Запрещено выбирать узлы, но нужно их считать. ' +
                    'Обратите внимание на опции: selectionCountMode, selectionType'
            );
        }
    }
}
