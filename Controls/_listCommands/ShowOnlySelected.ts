import { ICommand } from './interface/ICommand';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { IHierarchyOptions, TKey } from 'Controls/interface';

export interface ICommandOptions
    extends Omit<IHierarchyOptions, 'nodeHistoryId' | 'nodeHistoryType'> {
    items: RecordSet;
    selectedItems: Model[];
    root?: TKey;
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
        const { items, parentProperty } = this._options;

        items.setEventRaising(false, true);
        items.each((item) => {
            const itemKey = item.getKey();
            const parentKey = item.get(parentProperty);
            if (!this._isSelected(itemKey)) {
                itemsToRemove.push(item);
            } else if (parentProperty) {
                if (!this._isSelected(parentKey)) {
                    item.set(parentProperty, this._options.root);
                }
            }
        });

        itemsToRemove.forEach((item) => {
            items.remove(item);
        });

        this._options.selectedItems
            .slice()
            .reverse()
            .forEach((item) => {
                if (!items.getRecordById(item.getKey())) {
                    if (parentProperty) {
                        item.set(parentProperty, this._options.root);
                    }
                    items.add(item);
                }
            });

        items.setEventRaising(true, true);
    }

    private _isSelected(itemKey): boolean {
        return !!this._options.selectedItems.find((selectedItem) => {
            return selectedItem.getKey() === itemKey;
        });
    }
}
