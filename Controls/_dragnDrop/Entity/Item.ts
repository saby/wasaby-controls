/**
 * @kaizen_zone b9a403ff-e006-4511-98de-c3f6c764b219
 */
import Entity from '../Entity';

interface IItemOptions {
    item: any;
}

export default class Item extends Entity {
    protected _options: IItemOptions;

    getItem(): any {
        return this._options.item;
    }
}
