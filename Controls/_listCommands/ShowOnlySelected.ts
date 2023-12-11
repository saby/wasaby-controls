import { ICommand } from './interface/ICommand';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { IHierarchyOptions, TKey, TSelectionType } from 'Controls/interface';
import { ISelectionObject as ISelection } from 'Controls/interface';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import selectionToRecord from 'Controls/Utils/selectionToRecord';

export interface ICommandOptions
    extends Omit<IHierarchyOptions, 'nodeHistoryId' | 'nodeHistoryType'> {
    items: RecordSet;
    selectedItems: Model[];
    root?: TKey;
    selection: ISelection;
    selectionType?: TSelectionType;
    supportSelection?: boolean;
    sourceController?: SourceController;
}
/**
 * Действие отображения только выбранных записей
 * @class Controls/_listCommands/ShowOnlySelected
 * @implements Controls/listCommands:IAction
 * @public
 */
export default class ShowOnlySelected implements ICommand<ICommandOptions> {
    protected readonly _options: ICommandOptions;

    constructor(options: ICommandOptions = {} as ICommandOptions) {
        this._options = options;
    }

    execute(): Promise<void> {
        if (this._options.supportSelection) {
            return this._reloadItems();
        } else {
            this._filterItemsBySelection();
        }
    }

    private _reloadItems(): Promise<void> {
        const { sourceController, items, selection, selectionType } = this._options;
        const adapter = sourceController.getSource().getAdapter();
        const filter = {
            ...sourceController.getFilter(),
            selection: selectionToRecord(
                selection,
                adapter,
                selectionType,
                selection.recursive !== false
            ),
        };
        return sourceController.load(undefined, undefined, filter).then((result: RecordSet) => {
            items.assign(result);
        });
    }

    private _filterItemsBySelection(): void {
        const itemsToRemove = [];
        const itemsToAdd = [];
        const { items, parentProperty, root } = this._options;
        const newItems = items.clone(true);

        newItems.setEventRaising(false);

        this._options.selectedItems.slice().forEach((item) => {
            const itemKey = item.getKey();

            if (
                !newItems.getRecordById(itemKey) &&
                (root !== itemKey || !this._hasExcludedChildren(itemKey))
            ) {
                if (parentProperty) {
                    item.set(parentProperty, root);
                }
                itemsToAdd.push(item);
            }
        });

        newItems.each((item) => {
            const itemKey = item.getKey();
            const parentKey = item.get(parentProperty);
            if (!this._isSelected(itemKey)) {
                itemsToRemove.push(item);
            } else if (parentProperty) {
                if (!this._isSelected(parentKey) && parentKey !== root) {
                    item.set(parentProperty, root);
                }
            }
        });

        itemsToRemove.forEach((item) => {
            newItems.remove(item);
        });
        newItems.append(itemsToAdd);
        newItems.setEventRaising(true);
        items.assign(newItems);
    }

    private _isSelected(itemKey: TKey): boolean {
        return !!this._options.selectedItems.find((selectedItem) => {
            return selectedItem.getKey() === itemKey;
        });
    }

    private _hasExcludedChildren(nodeId: TKey): boolean {
        const { parentProperty, items, selection } = this._options;
        const isNode = (key): boolean => {
            const item = items.getRecordById(key);
            return item && item.get(this._options.nodeProperty) !== null;
        };
        let hasExcludedChild = false;

        if (isNode(nodeId) || nodeId === this._options.root) {
            items.each((item) => {
                if (!hasExcludedChild && item.get(parentProperty) === nodeId) {
                    const itemId = item.getKey();
                    hasExcludedChild =
                        selection.excluded.includes(itemId) || this._hasExcludedChildren(itemId);
                }
            });
        }

        return hasExcludedChild;
    }
}
