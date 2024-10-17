import { LOCAL_MOVE_POSITION, CrudEntityKey as TKey } from 'Types/source';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { Tree } from 'Controls/baseTree';
import { ISelectionObject } from 'Controls/interface';

export interface IMoveViewCommandOptions {
    items: TKey[] | RecordSet;
    direction?: LOCAL_MOVE_POSITION;
    collection?: RecordSet;
    target: Model;
    targetKey?: TKey;
    parentProperty: string;
    nodeProperty: string;
    keyProperty: string;
    root: TKey;
    selection?: ISelectionObject;
    position?: LOCAL_MOVE_POSITION;
}
export default class MoveViewCommand {
    protected _options: IMoveViewCommandOptions;

    constructor(options: IMoveViewCommandOptions) {
        if (options.selection && options.items && !options.collection) {
            options.collection = options.items as RecordSet;
            options.items = options.selection.selected;
        }
        if (options.position && !options.direction) {
            options.direction = options.position;
        }
        if (options.target !== undefined && options.targetKey === undefined) {
            options.targetKey = options.target?.getKey ? options.target.getKey() : options.target;
        }
        this._options = options;
    }

    _moveToSiblingPosition(id: TKey, targetKey: TKey): void {
        const key = targetKey ?? this._getTargetItemById(id)?.getKey();
        if (key !== undefined) {
            this._move(key, [id]);
        }
    }

    execute(meta?: Partial<IMoveViewCommandOptions>): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                if (
                    this._options.direction !== LOCAL_MOVE_POSITION.On &&
                    this._options.items.length === 1
                ) {
                    this._moveToSiblingPosition(this._options.items[0], this._options.targetKey);
                } else {
                    this._move(this._options.targetKey);
                }
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    private _hierarchyMove(items: Model[], targetKey: TKey): void {
        items.forEach((item): void => {
            if (item && item.getKey() !== targetKey) {
                item.set(this._options.parentProperty, targetKey);
            }
        });
    }

    private _reorderMove(
        collection: RecordSet,
        items: Model[],
        targetKey: TKey,
        direction: LOCAL_MOVE_POSITION
    ): void {
        let movedIndex;
        const parentProperty = this._options.parentProperty;
        const target = collection.getRecordById(targetKey);
        let targetIndex = collection.getIndex(target);

        if (targetIndex !== -1) {
            items.forEach((item): void => {
                if (item) {
                    if (direction === LOCAL_MOVE_POSITION.Before) {
                        targetIndex = collection.getIndex(target);
                    }

                    movedIndex = collection.getIndex(item);
                    if (movedIndex === -1) {
                        collection.add(item);
                        movedIndex = collection.getCount() - 1;
                    }

                    if (
                        parentProperty &&
                        target.get(parentProperty) !== item.get(parentProperty) &&
                        item.getKey() !== target.get(parentProperty)
                    ) {
                        item.set(parentProperty, target.get(parentProperty));
                    }

                    if (direction === LOCAL_MOVE_POSITION.After && targetIndex < movedIndex) {
                        targetIndex =
                            targetIndex + 1 < collection.getCount()
                                ? targetIndex + 1
                                : collection.getCount();
                    } else if (
                        direction === LOCAL_MOVE_POSITION.Before &&
                        targetIndex > movedIndex
                    ) {
                        targetIndex = targetIndex !== 0 ? targetIndex - 1 : 0;
                    }
                    collection.move(movedIndex, targetIndex);
                }
            });
        }
    }

    private _getTargetItemById(id: TKey): Model | void {
        let display;
        let collectionItem;
        let sublingItem;
        let resultItem;
        if (this._options.parentProperty) {
            display = new Tree({
                collection: this._options.collection,
                keyProperty: this._options.keyProperty,
                parentProperty: this._options.parentProperty,
                nodeProperty: this._options.nodeProperty,
                root: this._options.root,
            });
            collectionItem = display.getItemBySourceKey(id);
            sublingItem =
                this._options.direction === LOCAL_MOVE_POSITION.Before
                    ? display.getPrevious(collectionItem)
                    : display.getNext(collectionItem);
            resultItem = sublingItem ? sublingItem.getContents() : null;
        } else {
            let itemIndex = this._options.collection.getIndexByValue(this._options.keyProperty, id);
            resultItem = this._options.collection.at(
                this._options.direction === LOCAL_MOVE_POSITION.Before ? --itemIndex : ++itemIndex
            );
        }

        return resultItem;
    }

    protected _getItemsByKeys(items: TKey[]): Model[] {
        return items.map((key) => {
            return this._options.collection.getRecordById(key);
        });
    }

    protected _moveItems(
        items: Model[],
        collection: RecordSet,
        targetKey: TKey,
        direction: LOCAL_MOVE_POSITION
    ): void {
        if (direction === LOCAL_MOVE_POSITION.On) {
            this._hierarchyMove(items, targetKey);
        } else {
            this._reorderMove(collection, items, targetKey, direction);
        }
    }

    protected _move(targetKey: TKey, items: TKey[] = this._options.items): void {
        const moveItems = this._getItemsByKeys(items);
        this._moveItems(moveItems, this._options.collection, targetKey, this._options.direction);
    }
}
