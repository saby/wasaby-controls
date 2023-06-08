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
            if (!this._options.selectedKeys?.includes(itemKey) || this._options.excludedKeys?.includes(itemKey)) {
                itemsToRemove.push(item);
            } else if (this._options.parentProperty) {
                const parentKey = item.get(this._options.parentProperty);
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
}
