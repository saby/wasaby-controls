import { ICommand } from './interface/ICommand';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { IHierarchyOptions, TKey } from 'Controls/interface';
import { ISelectionObject as ISelection } from 'Controls/interface';

export interface ICommandOptions
    extends Omit<IHierarchyOptions, 'nodeHistoryId' | 'nodeHistoryType'> {
    items: RecordSet;
    selectedItems: Model[];
    root?: TKey;
    selection: ISelection;
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

    execute(): void {
        const itemsToRemove = [];
        const itemsToAdd = [];
        const { items, parentProperty, root } = this._options;

        items.setEventRaising(false, true);

        this._options.selectedItems
            .slice()
            .reverse()
            .forEach((item) => {
                const itemKey = item.getKey();

                if (
                    !items.getRecordById(itemKey) &&
                    (root !== itemKey || !this._hasExcludedChildren(itemKey))
                ) {
                    if (parentProperty) {
                        item.set(parentProperty, root);
                    }
                    itemsToAdd.push(item);
                }
            });

        items.each((item) => {
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
            items.remove(item);
        });
        items.append(itemsToAdd);
        items.setEventRaising(true, true);
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
