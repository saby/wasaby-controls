/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import { Collection } from 'Controls/display';
import { Model } from 'Types/entity';
import { CrudEntityKey } from 'Types/source';

export interface ISiblingStrategyOptions {
    collection: Collection;
}

export interface ISiblingStrategy {
    getPrevByKey(key: CrudEntityKey): Model;
    getNextByKey(key: CrudEntityKey): Model;
}
