/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import Tree from './../Tree';
import { Model } from 'Types/entity';
import { CrudEntityKey, LOCAL_MOVE_POSITION } from 'Types/source';
import { ISiblingStrategy, ISiblingStrategyOptions } from 'Controls/baseList';

export interface ITreeStrategyOptions extends ISiblingStrategyOptions {
    collection: Tree;
}

/**
 * Стратегия поиска следующей или предыдущей записи в дереве.
 * Используется при перемещении записей методами moveItemUp, moveItemDown в BaseControl.
 * @private
 */
export class TreeSiblingStrategy implements ISiblingStrategy {
    _collection: Tree;

    constructor(options: ITreeStrategyOptions) {
        this._collection = options.collection;
    }

    /**
     * Возвращает следующую запись исходной коллекции по ключу
     * @param key
     */
    getNextByKey(key: CrudEntityKey): Model {
        return this._getSibling(key, LOCAL_MOVE_POSITION.After);
    }

    /**
     * Возвращает предыдущую запись исходной коллекции по ключу
     * @param key
     */
    getPrevByKey(key: CrudEntityKey): Model {
        return this._getSibling(key, LOCAL_MOVE_POSITION.Before);
    }

    private _getSibling(key: CrudEntityKey, direction: LOCAL_MOVE_POSITION): Model {
        const parent = this._collection.getItemBySourceKey(key, false).getParent();
        const children = this._collection.getChildrenByRecordSet(parent);
        if (!children.length) {
            return;
        }
        const currentChildIndex = children.findIndex((item) => {
            return item.key === key;
        });
        if (
            (direction === LOCAL_MOVE_POSITION.After &&
                currentChildIndex === children.length - 1) ||
            (direction === LOCAL_MOVE_POSITION.Before && currentChildIndex === 0)
        ) {
            return;
        }
        return children[currentChildIndex + (direction === LOCAL_MOVE_POSITION.After ? 1 : -1)]
            .contents;
    }
}
