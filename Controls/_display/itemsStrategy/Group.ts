/**
 * @kaizen_zone 9c800c28-5283-4be3-9b6d-dd63bab11502
 */
import IItemsStrategy, { IOptions as IItemsStrategyOptions } from '../IItemsStrategy';
import Collection from '../Collection';
import CollectionItem from '../CollectionItem';
import GroupItem from '../GroupItem';
import {
    DestroyableMixin,
    SerializableMixin,
    ISerializableState as IDefaultSerializableState,
} from 'Types/entity';
import { mixin } from 'Types/util';
import { CrudEntityKey } from 'Types/source';
import { SpaceCollectionItem } from '../SpaceCollectionItem';

/**
 * Набор констант, используемых при работе с {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ группировкой элементов}.
 * @class Controls/list:groupConstants
 * @public
 */

/**
 * С помощью этой константы можно настроить группу элементов, которая отображается без заголовка в начале списка.
 * Пример использования можно найти {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/visual/hidden/ здесь}.
 * @name Controls/list:groupConstants#hiddenGroup
 * @cfg {String}
 */

const groupConstants = {
    hiddenGroup: 'CONTROLS_HIDDEN_GROUP',
};
export { groupConstants };

/**
 * @typedef {String} IHiddenGroupPosition
 * @description Допустимые значения для параметра {@link Controls/interface:INavigationOptionValue#source source}.
 * @variant first Элементы внутри скрытой группы отображаются в начале списка.
 * @variant byorder Элементы внутри скрытой группы отображаются в зависимости от порядка в данных.
 * @remark В режиме byorder все элементы скрытой группы отобразятся на месте первого элемента в коллекции, у которого задана скрытая группа.
 */
export type IHiddenGroupPosition = 'first' | 'byorder';

type IGroup = string | number;
type IGroups = IGroup[];

type GroupHandler<S, T> = (data: S, index: number, item: T) => string | number;

interface IOptions<S, T extends CollectionItem<S>> {
    source: IItemsStrategy<S, T>;
    display?: Collection<S, T>;
    handler?: GroupHandler<S, T>;
    collapsedGroups?: IGroups;
    hiddenGroupPosition?: IHiddenGroupPosition;
    groupConstructor: new (options: unknown) => GroupItem<T>;
    /**
     * Режим отображения группы.
     * При отображении "залитыми блоками" (titledBlocks), перед каждой группой, кроме первой
     * добавляется SpaceItem.
     */
    groupViewMode?: string;
    /**
     * Путь к конструктору SpaceItem
     */
    spaceItemModule: string;
    /**
     * Расстояние между блоками
     */
    blocksGap: string;
}

interface ISortOptions<S, T extends CollectionItem<S>> {
    display: Collection<S, T>;
    handler: GroupHandler<S, T>;
    groups: GroupItem<IGroup>[];
    collapsedGroups?: IGroups;
    hiddenGroupPosition?: IHiddenGroupPosition;
    groupConstructor: new (options: unknown) => GroupItem<T>;
    groupViewMode: string;
    spaceItems: SpaceCollectionItem[];
    spaceItemModule: string;
    blocksGap: string;
}

interface ISerializableState extends IDefaultSerializableState {
    _groups: GroupItem<IGroup>[];
    _itemsOrder: number[];
    _spaceItems: SpaceCollectionItem[];
}

/**
 * Стратегия-декоратор для формирования групп элементов
 * @class Controls/_display/ItemsStrategy/Group
 * @mixes Types/entity:DestroyableMixin
 * @mixes Types/entity:SerializableMixin
 *
 * @private
 */
export default class Group<S, T extends CollectionItem<S> = CollectionItem<S>>
    extends mixin<DestroyableMixin, SerializableMixin>(DestroyableMixin, SerializableMixin)
    implements IItemsStrategy<S, T>
{
    /**
     * Sets the function which returns the group id for every element
     */
    set handler(value: GroupHandler<S, T>) {
        this._options.handler = value;
    }

    set collapsedGroups(value: IGroups) {
        const valueChanged = this._options.collapsedGroups !== value;
        this._options.collapsedGroups = value;
        if (valueChanged) {
            // reset created groups
            this._groups = [];
            this._itemsOrder = null;
        }
    }

    get groups(): GroupItem<IGroup>[] {
        return this.items.filter((item) => {
            return item['[Controls/_display/GroupItem]'];
        }) as GroupItem<IGroup>[];
    }

    get options(): IItemsStrategyOptions<S, T> {
        return this.source.options;
    }

    get source(): IItemsStrategy<S, T> {
        return this._options.source;
    }

    get count(): number {
        return this._getItemsOrder().length;
    }

    get items(): T[] {
        const itemsOrder = this._getItemsOrder();
        const items = this._getItems();

        return itemsOrder.map((index) => {
            return items[index];
        });
    }

    /**
     * @typedef {Object} Options
     * @property {Controls/_display/ItemsStrategy/Abstract} source Декорирумая стратегия
     * @property {Function(Types/_collection/Item, Number, *)} handler Метод, возвращающий группу элемента
     */

    /**
     * Опции конструктора
     */
    protected _options: IOptions<S, T>;

    /**
     * Группы
     */
    protected _groups: GroupItem<IGroup>[] = [];

    /**
     * Группы
     */
    protected _spaceItems: GroupItem<IGroup>[] = [];

    /**
     * Индекс в в стратегии -> оригинальный индекс
     */
    protected _itemsOrder: number[];

    // region IItemsStrategy

    readonly '[Controls/_display/IItemsStrategy]': boolean = true;

    constructor(options: IOptions<S, T>) {
        super();
        this._options = options;
    }

    at(index: number): T {
        const itemsOrder = this._getItemsOrder();
        const itemIndex = itemsOrder[index];

        if (itemIndex === undefined) {
            throw new ReferenceError(`Index ${index} is out of bounds.`);
        }

        return this._getItems()[itemIndex];
    }

    splice(start: number, deleteCount: number, added?: S[]): T[] {
        this._itemsOrder = null;
        return this.source.splice(start, deleteCount, added);
    }

    reset(): void {
        this._groups = [];
        this._itemsOrder = null;
        return this.source.reset();
    }

    invalidate(): void {
        this._itemsOrder = null;
        return this.source.invalidate();
    }

    getDisplayIndex(index: number): number {
        const itemsOrder = this._getItemsOrder();
        const sourceIndex = this.source.getDisplayIndex(index);
        const overallIndex = sourceIndex + this._groups.length + this._spaceItems.length;
        const itemIndex = itemsOrder.indexOf(overallIndex);

        return itemIndex === -1 ? itemsOrder.length : itemIndex;
    }

    getCollectionIndex(index: number): number {
        const itemsOrder = this._getItemsOrder();
        const overallIndex = itemsOrder[index];
        let sourceIndex = overallIndex - this._groups.length - this._spaceItems.length;

        sourceIndex = sourceIndex >= 0 ? this.source.getCollectionIndex(sourceIndex) : -1;

        return sourceIndex;
    }

    // endregion

    // region SerializableMixin

    _getSerializableState(state: IDefaultSerializableState): ISerializableState {
        const resultState: ISerializableState =
            SerializableMixin.prototype._getSerializableState.call(this, state);

        resultState.$options = this._options;
        resultState._groups = this._groups;
        resultState._spaceItems = this._spaceItems;
        resultState._itemsOrder = this._itemsOrder;

        // If handler is defined force calc order because handler can be lost during serialization
        if (!resultState._itemsOrder && this._options.handler) {
            resultState._itemsOrder = this._getItemsOrder();
        }

        return resultState;
    }

    _setSerializableState(state: ISerializableState): Function {
        const fromSerializableMixin = SerializableMixin.prototype._setSerializableState(state);
        return function (): void {
            this._groups = state._groups;
            this._spaceItems = state._spaceItems;
            this._itemsOrder = state._itemsOrder;
            fromSerializableMixin.call(this);
        };
    }

    // endregion

    // region Protected

    /**
     * Возвращает группы + элементы оригинальной стратегии
     * @protected
     */
    protected _getItems(): T[] {
        return (this._groups as any as T[]).concat(
            this._spaceItems as any as T[],
            this.source.items
        );
    }

    /**
     * Возвращает соответствие индексов в стратегии оригинальным индексам
     * @protected
     */
    protected _getItemsOrder(): number[] {
        if (!this._itemsOrder) {
            this._itemsOrder = this._createItemsOrder();
        }

        return this._itemsOrder;
    }

    /**
     * Создает соответствие индексов в стратегии оригинальным индексам
     * @protected
     */
    protected _createItemsOrder(): number[] {
        return Group.sortItems<S, T>(this.source.items, {
            display: this.options.display as Collection<S, T>,
            handler: this._options.handler,
            collapsedGroups: this._options.collapsedGroups,
            groups: this._groups,
            spaceItems: this._spaceItems,
            groupConstructor: this._options.groupConstructor,
            hiddenGroupPosition: this._options.hiddenGroupPosition,
            groupViewMode: this._options.groupViewMode,
            spaceItemModule: this._options.spaceItemModule,
            blocksGap: this._options.blocksGap,
        });
    }

    /**
     * Возвращает число групп, в которых есть элементы
     * @protected
     */
    protected _getActiveGroupsCount(itemsOrder: number[]): number {
        return itemsOrder.length - this.source.items.length;
    }

    // endregion

    // region Statics

    /**
     * Создает индекс сортировки в порядке группировки
     * @param items Элементы проекции.
     * @param options Опции
     */
    static sortItems<S, T extends CollectionItem<S> = CollectionItem<S>>(
        items: T[],
        options: ISortOptions<S, T>
    ): number[] {
        const groups = options.groups;
        const display = options.display;
        const handler = options.handler;
        const spaceItems = options.spaceItems;

        const createSpaceItem = (group_id: string | number) => {
            return display.createItem({
                itemModule: options.spaceItemModule,
                itemsSpacing: options.blocksGap,
                contents: `space-collection-item-group-${group_id}`,
            }) as unknown as SpaceCollectionItem;
        };

        // No grouping - reset groups and return current order
        if (!handler) {
            groups.length = 0;
            return items.map((item, index) => {
                return index;
            });
        }

        // {Array}: Group index -> group ID
        // Fill groupsId by groups
        const groupsId = groups.map((item) => {
            return item.getContents();
        });

        const groupsOrder = []; // {Array.<Number>}: Group position -> Group index
        const groupsItems = []; // {Array.<Number>}: Group index -> Item index
        // Check group ID and group instance for every item and join them all together
        for (let position = 0; position < items.length; position++) {
            const item = items[position];
            const groupId = handler(
                (item as any as CollectionItem<S>).getContents(),
                position,
                item
            );
            let groupIndex = groupsId.indexOf(groupId);

            // Create group with this groupId if necessary
            if (groupsId.indexOf(groupId) === -1) {
                const isCollapsed =
                    options.collapsedGroups && options.collapsedGroups.indexOf(groupId) !== -1;
                const isFirstStickedGroup =
                    this._isFirstVisibleGroup(groupsId, groupId) &&
                    options.display.isStickyHeader();
                const additionalParams = display?.getAdditionalGroupConstructorParams() || {};
                const group = new options.groupConstructor({
                    owner: display as any,
                    contents: groupId,
                    expanded: !isCollapsed,
                    hasMoreDataUp: display?.hasMoreDataUp(),
                    isFirstStickedItem: isFirstStickedGroup,
                    style: display?.getStyle(),
                    theme: display?.getTheme(),
                    ...additionalParams,
                }) as GroupItem<IGroup>;

                groupIndex = groups.length;

                // Insert data into groups and groupsId
                groups.push(group);
                groupsId.push(groupId);
                if (options.groupViewMode === 'titledBlocks') {
                    spaceItems.push(createSpaceItem(groupId));
                }
            }

            // Remember group order
            if (groupsOrder.indexOf(groupIndex) === -1) {
                if (
                    groupId === groupConstants.hiddenGroup &&
                    options.hiddenGroupPosition === 'first'
                ) {
                    groupsOrder.unshift(groupIndex);
                } else {
                    groupsOrder.push(groupIndex);
                }
            }

            // Items of each group
            if (!groupsItems[groupIndex]) {
                groupsItems[groupIndex] = [];
            }
            groupsItems[groupIndex].push(position);
        }

        // Fill result by groups
        const result = [];
        const groupsCount = groups.length;
        const spaceItemsCount = spaceItems?.length || 0;
        groupsOrder.forEach((groupIndex) => {
            result.push(groupIndex);
            groupsItems[groupIndex].forEach((item) => {
                result.push(item + groupsCount + spaceItemsCount);
            });
            if (spaceItemsCount) {
                result.push(groupsCount + groupIndex);
            }
        });

        return result;
    }

    private static _isFirstVisibleGroup(
        groupIds: CrudEntityKey[],
        groupId: CrudEntityKey
    ): boolean {
        return (
            (groupId !== groupConstants.hiddenGroup && !groupIds.length) ||
            (groupIds.length === 1 && groupIds[0] === groupConstants.hiddenGroup)
        );
    }

    // endregion
}

Object.assign(Group.prototype, {
    '[Controls/_display/itemsStrategy/Group]': true,
    _moduleName: 'Controls/display:itemsStrategy.Group',
    _groups: null,
    _itemsOrder: null,
});
