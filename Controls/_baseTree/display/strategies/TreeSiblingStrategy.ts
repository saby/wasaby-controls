/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import Tree from './../Tree';
import { Model } from 'Types/entity';
import { CrudEntityKey, LOCAL_MOVE_POSITION } from 'Types/source';
import { ISiblingStrategy, ISiblingStrategyOptions } from 'Controls/baseList';

export interface ITreeStrategyOptions extends ISiblingStrategyOptions {
    collection: Tree;
}

export class TreeSiblingStrategy implements ISiblingStrategy {
    _collection: Tree;

    constructor(options: ITreeStrategyOptions): void {
        this._collection = options.collection;
    }

    getNextByKey(key: CrudEntityKey): Model {
        return this._getSibling(key, LOCAL_MOVE_POSITION.After);
    }

    getPrevByKey(key: CrudEntityKey): Model {
        return this._getSibling(key, LOCAL_MOVE_POSITION.Before);
    }

    private _getSibling(
        key: CrudEntityKey,
        direction: LOCAL_MOVE_POSITION
    ): Model {
        const parent = this._collection
            .getItemBySourceKey(key, false)
            .getParent();
        const children = this._collection.getChildrenByRecordSet(parent);
        if (!children.length) {
            return;
        }
        const currentChildIndex = children.findIndex((item) => {
            return item.contents.getKey() === key;
        });
        if (
            (direction === LOCAL_MOVE_POSITION.After &&
                currentChildIndex === children.length - 1) ||
            (direction === LOCAL_MOVE_POSITION.Before &&
                currentChildIndex === 0)
        ) {
            return;
        }
        return children[
            currentChildIndex +
                (direction === LOCAL_MOVE_POSITION.After ? 1 : -1)
        ].contents;
    }
}
