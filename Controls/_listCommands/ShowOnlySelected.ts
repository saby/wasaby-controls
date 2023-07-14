import IAction from './interface/IAction';
import { IOptions } from './interface/IProvider';

/**
 * Действие отображения только выбранных записей
 * @class Controls/_listCommands/ShowOnlySelected
 * @implements Controls/listCommands:IAction
 * @public
 */
export default class ShowOnlySelected implements IAction {
    protected readonly _options: IOptions;

    constructor(options: IOptions = {} as IOptions) {
        this._options = options;
    }

    execute(): void {
        const itemsToRemove = [];
        this._options.items.setEventRaising(false, true);
        this._options.items.each((item) => {
            const itemKey = item.getKey();
            const parentKey = item.get(this._options.parentProperty);
            if (!this._isSelected(item, itemKey)) {
                itemsToRemove.push(item);
            } else if (this._options.parentProperty) {
                if (!this._options.selectedKeys?.includes(parentKey)) {
                    item.set(this._options.parentProperty, this._options.root);
                }
            }
        });

        itemsToRemove.forEach((item) => {
            this._options.items.remove(item);
        });

        this._options.items.setEventRaising(true, true);
    }

    private _isSelected(item, itemKey): boolean {
        const isKeySelected = this._isKeySelectedAndNotExcluded(itemKey);
        if (isKeySelected || !this._options.parentProperty) {
            return isKeySelected;
        }
        const parentKey = item.get(this._options.parentProperty);
        const isParentKeySelected = this._isKeySelectedAndNotExcluded(parentKey);
        if (isParentKeySelected || this._options.root === parentKey) {
            return isParentKeySelected;
        }
        const parent = this._options.items.getRecordById(parentKey);
        return this._isSelected(parent, parentKey);
    }

    private _isKeySelectedAndNotExcluded(key) {
        return this._options.selectedKeys?.includes(key) && !this._options.excludedKeys?.includes(key);
    }
}
