/**
 * @kaizen_zone 9667df49-f81c-47b7-8671-9b43a1025495
 */
import { DestroyableMixin, Model } from 'Types/entity';
import { TAddPosition } from './Types';
import { mixin } from 'Types/util';
import { IEditableCollection, IEditableCollectionItem } from 'Controls/display';

export const ERROR_MSG = {
    ADDING_ITEM_KEY_WAS_NOT_SET:
        'Adding item key was not set. Key is required. You can set the key ' +
        'before edit while prepare adding item or in callbacks: beforeBeginEdit and beforeEndEdit.',
    ADD_ITEM_KEY_DUPLICATED:
        'Duplicating keys in editable collection. Adding item has the same key as item which is already exists in collection.',
    ITEM_FOR_EDITING_MISSED_IN_COLLECTION:
        'Item passed for editing is missing in collection. You can edit only existing items, to add new use method add(item: Model).',
    COLLECTION_IS_REQUIRED: 'Options ICollectionEditorOptions:collection is required.',
    SOURCE_COLLECTION_MUST_BE_RECORDSET:
        'Source collection must be instance of type extended of Types/collection:RecordSet.',
    HAS_NO_EDITING: 'There is no running edit in collection.',
    EDITING_IS_ALREADY_RUNNING:
        'Editing is already running. Commit or cancel current before beginning new.',
    NO_FORMAT_FOR_KEY_PROPERTY:
        "There is no format for item's key property. It is required if trying to add item with empty key. set item's key or format of key property.",
    PARENT_OF_ADDING_ITEM_DOES_NOT_EXIST:
        "Adding in tree error. The parent of adding item doesn't exist. Check if the parentProperty field is filled in correctly and parent is displayed. " +
        'If you want to add item to the root, the parentProperty value of the added item must be "null"',
};

interface ICollectionEditorOptions {
    collection: IEditableCollection;
}

/**
 * Контроллер редактирования коллекции.
 *
 * @private
 * @class Controls/_editInPlace/CollectionEditor
 */
export class CollectionEditor extends mixin<DestroyableMixin>(DestroyableMixin) {
    private _options: ICollectionEditorOptions;
    private _editingItem: IEditableCollectionItem = null;

    constructor(options: ICollectionEditorOptions) {
        super();
        this._options = {} as ICollectionEditorOptions;
        this.updateOptions(options);
    }

    /**
     * Возвращает true, если в коллекции есть запущенное редактирование
     * @function
     * @return {Boolean}
     * @public
     */
    isEditing(): boolean {
        return !!this._editingItem;
    }

    /**
     * Получить редактируемый элемент
     * @function
     * @return {IEditableCollectionItem}
     * @public
     */
    getEditingItem(): IEditableCollectionItem | null {
        return this._editingItem;
    }

    private _validateOptions(options: Partial<ICollectionEditorOptions>): boolean | never {
        if (!options.collection) {
            throw Error(ERROR_MSG.COLLECTION_IS_REQUIRED);
        }
        if (this._options.collection === options.collection) {
            return false;
        }
        if (!options.collection.getSourceCollection()['[Types/_collection/RecordSet]']) {
            throw Error(ERROR_MSG.SOURCE_COLLECTION_MUST_BE_RECORDSET);
        }
        return true;
    }

    /**
     * Обновить опции контроллера.
     * @function
     * @param {Partial.<ICollectionEditorOptions>} newOptions Новые опции.
     * @void
     *
     * @public
     * @remark Все поля в новых опциях не являются обязательными, таким образом, есть возможность выборочного обновления.
     */
    updateOptions(newOptions: Partial<ICollectionEditorOptions>): void {
        const combinedOptions = { ...this._options, ...newOptions };
        if (this._validateOptions(combinedOptions)) {
            this._options = combinedOptions;
        }
    }

    /**
     * Запустить редактирование переданного элемента.
     * @function
     * @param {Types/entity:Model} item Элемент для редактирования.
     * @param {Number} columnIndex Индекс колонки в которой будет запущено редактирование.
     * @void
     * @public
     */
    edit(item: Model, columnIndex?: number): void {
        if (this._editingItem) {
            throw Error(ERROR_MSG.EDITING_IS_ALREADY_RUNNING);
        }

        this._editingItem = this._options.collection.getItemBySourceKey(item.getKey(), false);
        if (!this._editingItem) {
            this._throwEditingItemMissingError(item);
        }

        this._editingItem.setEditing(true, item, false, columnIndex);
        this._options.collection.setEditing(true);
    }

    /**
     * Начать добавление переданного элемента.
     * @function
     * @param {Types/entity:Model} item Элемент для добавления.
     * @param {TAddPosition} addPosition Позиция добавляемого элемента.
     * @param {Types/entity:Model} targetItem Запись на месте которой начнется добавление.
     * @param {Number} columnIndex Индекс колонки в которой будет запущено редактирование.
     * @void
     * @public
     */
    add(item: Model, addPosition?: TAddPosition, targetItem?: Model, columnIndex?: number): void {
        if (this._editingItem) {
            throw Error(ERROR_MSG.EDITING_IS_ALREADY_RUNNING);
        }

        // Вещественный ключ не должен дублироваться в коллекции.
        const addingItemKey = item.getKey();
        if (addingItemKey && this._options.collection.getItemBySourceKey(addingItemKey, false)) {
            throw Error(`${ERROR_MSG.ADD_ITEM_KEY_DUPLICATED} Duplicated key: ${addingItemKey}.`);
        }

        this._editingItem = this._options.collection.createItem({
            contents: item,
            isAdd: true,
            addPosition: addPosition === 'top' ? 'top' : 'bottom',
        });

        this._validateAddingItem(this._editingItem, targetItem);

        let targetIndex;
        if (targetItem) {
            targetIndex = this._options.collection.getSourceCollection().getIndex(targetItem);
            if (targetIndex === -1) {
                targetIndex = undefined;
                return;
            }
        }

        this._editingItem.setEditing(true, item, false, columnIndex);
        this._options.collection.setAddingItem(this._editingItem, {
            position: addPosition === 'top' ? 'top' : 'bottom',
            index: targetIndex,
        });
        this._options.collection.setEditing(true);
    }

    /**
     * Завершить редактирование элемента и сохранить изменения.
     * @function
     * @void
     * @public
     */
    commit(): void {
        if (!this._editingItem) {
            throw Error(ERROR_MSG.HAS_NO_EDITING);
        }

        // Попытка сохранить добавляемую запись, которой не был установлен настоящий ключ приведет к ошибке.
        // При сохранении, добавляемая запись должна иметь настоящий и уникальный ключ, а не временный.
        // Временный ключ выдается добавляемой записи с отсутствующим ключом, т.к.
        // допустимо запускать добавление такой записи, в отличае от сохранения.
        this._editingItem.acceptChanges();

        this._options.collection.resetAddingItem();
        this._editingItem.setEditing(false, null);
        this._options.collection.setEditing(false);
        this._editingItem = null;
    }

    /**
     * Завершить редактирование элемента и отменить изменения.
     * @function
     * @void
     * @public
     */
    cancel(): void {
        if (!this._editingItem) {
            throw Error(ERROR_MSG.HAS_NO_EDITING);
        }

        this._options.collection.resetAddingItem();
        this._editingItem.setEditing(false, null);
        this._options.collection.setEditing(false);
        this._editingItem = null;
    }

    /**
     * Получить следующий элемент коллекции, для которого доступно редактирование.
     * @function
     * @return {CollectionItem.<Types/entity:Model>|undefined}
     * @public
     */
    getNextEditableItem(
        fromItem: IEditableCollectionItem = this._editingItem
    ): IEditableCollectionItem {
        return this._getNextEditableItem(fromItem, 'after');
    }

    /**
     * Получить предыдущий элемент коллекции, для которого доступно редактирование.
     * @function
     * @return {CollectionItem.<Types/entity:Model>|undefined}
     * @public
     */
    getPrevEditableItem(
        fromItem: IEditableCollectionItem = this._editingItem
    ): IEditableCollectionItem {
        return this._getNextEditableItem(fromItem, 'before');
    }

    private _getNextEditableItem(
        fromItem: IEditableCollectionItem,
        direction: 'before' | 'after'
    ): IEditableCollectionItem {
        let next: IEditableCollectionItem;
        const collection = this._options.collection;

        if (!fromItem) {
            next = collection.getFirst('EditableItem');
        } else {
            next =
                direction === 'after'
                    ? collection.getNext(fromItem)
                    : collection.getPrevious(fromItem);
        }

        while (next && !next.EditableItem) {
            next = direction === 'after' ? collection.getNext(next) : collection.getPrevious(next);
        }

        return next;
    }

    private _isValidRootType(root: unknown): boolean {
        return root === null || typeof root !== 'undefined';
    }

    private _validateAddingItem(editingItem: object, targetItem: object): void | never {
        // Костыль необходим из-за особенности реализации модели PropertyGrid. Это дерево, но без parentProperty
        // https://online.sbis.ru/opendoc.html?guid=87de3080-fe7e-48f7-ad35-e4a133d5b8fc
        if (editingItem['[Controls/_propertyGrid/PropertyGridCollectionItem]']) {
            return;
        }
        // У каждого элемента дерева есть родитель. Если его нет, значит конфигурация добавляемого элемента
        // ошибочна. Добавление записи не сможет начаться, если родительская запись отсутствует в дереве.
        // Родительский элемент может быть корнем, как null, так и реальной записью.
        // Таким образом, нужно проверить, что ключ корня задан в допустимом формате, а запись с таким ключом
        // либо присутствует в коллекции, либо является ее корнем.
        if (editingItem && editingItem['[Controls/_display/TreeItem]']) {
            const parentProperty = this._options.collection.getParentProperty();
            const editingItemParentKey = editingItem.contents.get(parentProperty);
            const collectionRootKey = this._options.collection.getRoot().getContents();
            let rootItem;
            if (
                !this._isValidRootType(editingItemParentKey) ||
                !(
                    (rootItem = this._options.collection.getItemBySourceKey(
                        editingItemParentKey,
                        false
                    )) || collectionRootKey === editingItemParentKey
                )
            ) {
                throw Error(
                    `There is no item with key={${editingItemParentKey}} in list. ${ERROR_MSG.PARENT_OF_ADDING_ITEM_DOES_NOT_EXIST}`
                );
            }

            if (targetItem) {
                const targetItemParentKey = targetItem.get(parentProperty);

                if (editingItemParentKey !== targetItemParentKey) {
                    throw Error(
                        'Parent key of item that has been given as a target for adding is different from parent key in editing item. ' +
                            `Targets item parent key = {${targetItemParentKey}}, editing item parent key = {${editingItemParentKey}}.`
                    );
                }
            }

            if (rootItem !== null && !rootItem.isExpanded()) {
                throw Error(
                    `Parent item is collapsed. You should expand it first. Parent key = {${editingItemParentKey}}.`
                );
            }
        }

        if (targetItem && this._options.collection.getGroup()) {
            const groupMethod = this._options.collection.getGroup();
            const targetItemGroup = groupMethod(targetItem);
            const editingItemGroup = groupMethod(editingItem.contents);

            if (targetItemGroup !== editingItemGroup) {
                throw Error(
                    'Group key of item that has been given as a target for adding is different from group key in editing item. ' +
                        `Targets item group key = {${targetItemGroup}}, editing item group key = {${editingItemGroup}}.`
                );
            }
        }
    }

    private _throwEditingItemMissingError(item: Model): never {
        const keys =
            '[\n\t' +
            this._options.collection
                .getItems()
                .filter((i) => {
                    return i.EditableItem;
                })
                .map((i) => {
                    return i.contents.getKey();
                })
                .join(',\n\t') +
            '\n]';

        throw Error(
            `${
                ERROR_MSG.ITEM_FOR_EDITING_MISSED_IN_COLLECTION
            }\nEditingItemKey: {${item.getKey()}},\nCollectionKeys: ${keys}`
        );
    }

    destroy(): void {
        super.destroy();
        this._options = null;
        this._editingItem = null;
    }
}
