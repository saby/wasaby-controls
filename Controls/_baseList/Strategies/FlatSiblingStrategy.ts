/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import { Collection } from 'Controls/display';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { CrudEntityKey } from 'Types/source';

import {
    ISiblingStrategy,
    ISiblingStrategyOptions,
} from '../interface/ISiblingStrategy';

export class FlatSiblingStrategy implements ISiblingStrategy {
    _collection: Collection;

    constructor(options: ISiblingStrategyOptions) {
        this._collection = options.collection;
    }

    getNextByKey(key: CrudEntityKey): Model {
        const currentIndex = this._getCollection().getIndexByValue(
            this._getCollection().getKeyProperty(),
            key
        );
        return this._getCollection().at(currentIndex + 1);
    }

    getPrevByKey(key: CrudEntityKey): Model {
        const currentIndex = this._getCollection().getIndexByValue(
            this._getCollection().getKeyProperty(),
            key
        );
        return this._getCollection().at(currentIndex - 1);
    }

    private _getCollection(): RecordSet {
        return this._collection.getSourceCollection() as undefined as RecordSet;
    }
}
