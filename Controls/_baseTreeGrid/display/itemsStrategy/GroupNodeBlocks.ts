/**
 * @kaizen_zone 85fa96d3-2240-448c-8ebb-e69dbcb05d63
 */
import { IItemsStrategy, TGroupViewMode } from 'Controls/display';
import { NODE_TYPE_PROPERTY_GROUP, Tree, TreeItem } from 'Controls/baseTree';
import { DestroyableMixin, SerializableMixin, Model } from 'Types/entity';
import { mixin } from 'Types/util';
import { TKey } from 'Controls/interface';
import TreeGridSpaceRow from 'Controls/_baseTreeGrid/display/TreeGridSpaceRow';
import TreeGridGroupDataRow from 'Controls/_baseTreeGrid/display/TreeGridGroupDataRow';

interface IOptions<S extends Model, T extends TreeItem<S>> {
    display: Tree<S, T>;
    source: IItemsStrategy<S, T>;
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

interface ISpaceItems {
    top?: TreeGridSpaceRow;
    bottom?: TreeGridSpaceRow;
}

export interface ISortOptions<S extends Model = Model, T extends TreeItem<S> = TreeItem<S>> {
    display: Tree<S, T>;
    pseudoParent: T;
    groupViewMode: string;
    spaceItems: Record<TKey, ISpaceItems>;
    spaceItemModule: string;
    blocksGap: string;
    increaseSpaceItemsCount: (value?: number) => number;
    spaceItemsCount: number;
}

function flatSpaceItems(spaceItems: Record<TKey, ISpaceItems>): TreeGridSpaceRow[] {
    return Object.keys(spaceItems).reduce((acc, key) => {
        const item = spaceItems[key];
        if (item.top) {
            acc.push(item.top);
        }
        if (item.bottom) {
            acc.push(item.bottom);
        }
        return acc;
    }, []);
}

/**
 * Стратегия-декоратор для отображения нижней и верхней частей блока,
 * сформированного узлом в виде группы с установленной опцией
 * GroupViewMode=blocks или GroupViewMode=titledBlocks.
 * Стратегия добавляет вот такие строки (помечено стрелками):
 *
 *       ------------------- Заголовок группы  -------------------
 *   ->  /TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT\
 *      |                         Запись 1                        |
 *      |                         Запись 2                        |
 *   ->  \LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL/
 *
 *       ------------------- Заголовок группы  -------------------
 *   ->  /TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT\
 *      |                         Запись 1                        |
 *      |                         Запись 2                        |
 *   ->  \LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL/
 *
 * * Эти строки не подсвечиваются по ховеру
 * * С ними нет никакого взаимодействия, они только добавляют "воздух" и скругления блока.
 * + см https://n.sbis.ru/article/6acfa8a7-764e-4678-b276-7e56edb9049b
 * * см https://www.figma.com/proto/zHp5nfHnC4Ab7c5cgYONiI/%E2%9C%94%EF%B8%8F-%D0%93%D1%80%D1%83%D0%BF%D0%BF%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0?page-id=0%3A1&type=design&viewport=-423%2C194%2C0.49&t=lcHbZ2wVRX2YsesO-8&scaling=min-zoom&starting-point-node-id=273%3A12483&hide-ui=1&node-id=273-12483
 * TODO Вынести в вехе 24.5000 общий с Controls/_display/itemsStrategy/Group.ts код по задаче
 *  https://online.sbis.ru/opendoc.html?guid=f1a3b5e6-acf7-40e5-be58-ef6a58442b1a&client=3
 * @mixes Types/entity:DestroyableMixin
 * @mixes Types/entity:SerializableMixin
 *
 * @private
 */
export default class GroupNodeBlocks<S extends Model, T extends TreeItem<S>>
    extends mixin<DestroyableMixin, SerializableMixin>(DestroyableMixin, SerializableMixin)
    implements IItemsStrategy<S, T>
{
    readonly '[Controls/_display/IItemsStrategy]': boolean;

    protected _items: T[];
    /**
     * Опции конструктора
     */
    protected _options: IOptions<S, T>;
    protected _source: IItemsStrategy<S, T>;
    protected _itemsOrder: number[];

    /**
     * Специальные разделители, которые позволяют добавить дополнительную вёрстку после заголовка и после всех собранных в одну группу записей
     */
    protected _spaceItems: Record<TKey, ISpaceItems> = {};
    protected _spaceItemsCount: number = 0;

    protected constructor(options: IOptions<S, T>) {
        super();
        this._options = options;
    }

    get options(): IOptions<S, T> {
        return this._options;
    }

    get source(): IItemsStrategy<S, T> {
        return this.options.source;
    }

    get count(): number {
        return this._getItemsOrder().length;
    }

    at(index: number): T {
        const itemsOrder = this._getItemsOrder();
        const itemIndex = itemsOrder[index];

        if (itemIndex === undefined) {
            throw new ReferenceError(`Index ${index} is out of bounds.`);
        }

        return this._getItems()[itemIndex];
    }

    getCollectionIndex(index: number): number {
        const itemsOrder = this._getItemsOrder();
        const overallIndex = itemsOrder[index];
        let sourceIndex = overallIndex - this._spaceItemsCount;

        sourceIndex = sourceIndex >= 0 ? this.source.getCollectionIndex(sourceIndex) : -1;

        return sourceIndex;
    }

    getDisplayIndex(index: number): number {
        const itemsOrder = this._getItemsOrder();
        const sourceIndex = this.source.getDisplayIndex(index);
        const overallIndex = sourceIndex + this._spaceItemsCount;
        const itemIndex = itemsOrder.indexOf(overallIndex);

        return itemIndex === -1 ? itemsOrder.length : itemIndex;
    }

    reset(): void {
        this._spaceItems = {};
        this._itemsOrder = null;
        this._spaceItemsCount = 0;
        return this.source.reset();
    }

    invalidate(): void {
        this._itemsOrder = null;
        return this.source.invalidate();
    }

    splice(start: number, deleteCount: number, added?: S[]): T[] {
        this._itemsOrder = null;
        return this.source.splice(start, deleteCount, added);
    }

    get items(): T[] {
        const itemsOrder = this._getItemsOrder();
        const items = this._getItems();

        return itemsOrder.map((index) => {
            return items[index];
        });
    }

    /**
     * Возвращает группы + элементы оригинальной стратегии
     * @protected
     */
    protected _getItems(): T[] {
        return (flatSpaceItems(this._spaceItems) as any as T[]).concat(
            this.source.items as any as T[]
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
     * Создает соответствие индексов в стратегии оригинальным оригинальный индексам
     * @protected
     */
    protected _createItemsOrder(): number[] {
        return this._sortItems(this.source.items, {
            display: this.options.display as Tree<S, T>,
            spaceItems: this._spaceItems,
            groupViewMode: this._options.groupViewMode,
            spaceItemModule: this._options.spaceItemModule,
            blocksGap: this._options.blocksGap,
            spaceItemsCount: this._spaceItemsCount,
            increaseSpaceItemsCount: (value: number = 1) => {
                this._spaceItemsCount += value;
                return this._spaceItemsCount;
            },
        });
    }

    /**
     * Создает индекс сортировки в порядке группировки
     * @param items Элементы проекции.
     * @param options Опции
     */
    protected _sortItems(items: T[], options: ISortOptions<S, T>): number[] {
        if (!items.length) {
            return [];
        }
        const { display } = options;
        const root = display.getRoot().contents;
        const sourceCollection = display.getSourceCollection();
        const sourceCollectionCount = sourceCollection.getCount();
        const parentProperty = display.getParentProperty();
        const nodeProperty = display.getNodeProperty();
        const nodeTypeProperty = display.getNodeTypeProperty();
        const spaceItems = options.spaceItems;
        let spaceItemsCount = options.spaceItemsCount;

        const hasChildren = (group: TreeGridGroupDataRow): boolean => {
            const groupKey = group.key;
            let hasByRecordSet = false;
            let index = 0;
            while (!hasByRecordSet && index < sourceCollectionCount) {
                hasByRecordSet = sourceCollection.at(index).get(parentProperty) === groupKey;
                index++;
            }
            return hasByRecordSet;
        };

        // Проверяет ,является ли текущая запись группой
        const isGroupNode = (item: T) => {
            return (
                item.contents.get &&
                item.contents.get(nodeProperty) &&
                item.contents.get(parentProperty) === root &&
                item.contents.get(nodeTypeProperty) === NODE_TYPE_PROPERTY_GROUP
            );
        };

        const createSpaceItem = (
            group: TreeGridGroupDataRow,
            isGroupCollapsed: boolean = false,
            position: 'top' | 'bottom' = 'bottom',
            groupViewMode: TGroupViewMode = 'default'
        ) => {
            const groupId = group.key;
            const prefix = `controls-ListView__group${
                isGroupCollapsed ? 'Collapsed' : ''
            }_SpaceItem`;
            return display.createItem({
                itemModule: options.spaceItemModule,
                itemsSpacing: position === 'top' ? 'xs' : options.blocksGap,
                contents: `space-collection-item-${position}-group-${groupId}`,
                className: `${prefix} ${prefix}_${position} ${prefix}_${groupViewMode}`,
                parent: group,
            }) as unknown as TreeGridSpaceRow;
        };

        // 1. Сперва найдём все непустые группы.
        const visibleGroups = items.filter((item) => {
            return isGroupNode(item) && hasChildren(item);
        });

        // 2. Создадим для каждой группы спейсинги, если они нужны
        visibleGroups.forEach((group) => {
            if (!spaceItems[group.key]) {
                if (options.groupViewMode === 'titledBlocks') {
                    // Для titledBlocks после группы создаём одну линию-разделитель,
                    // Но если группа скрытая, то необходимо добавлять линию-разделитель сверху.
                    spaceItemsCount = options.increaseSpaceItemsCount();
                    const groupSpaceItems: ISpaceItems = {
                        bottom: createSpaceItem(
                            group,
                            !group.isExpanded(),
                            'bottom',
                            options.groupViewMode
                        ),
                    };
                    if (group.isHiddenGroup()) {
                        groupSpaceItems.top = createSpaceItem(
                            group,
                            !group.isExpanded(),
                            'top',
                            options.groupViewMode
                        );
                        spaceItemsCount = options.increaseSpaceItemsCount();
                    }
                    spaceItems[group.key] = groupSpaceItems;
                } else if (options.groupViewMode === 'blocks' && group.isExpanded()) {
                    // Для blocks всегда создаём две линии-разделителя.
                    spaceItemsCount = options.increaseSpaceItemsCount(2);
                    spaceItems[group.key] = {
                        top: createSpaceItem(
                            group,
                            !group.isExpanded(),
                            'top',
                            options.groupViewMode
                        ),
                        bottom: createSpaceItem(
                            group,
                            !group.isExpanded(),
                            'bottom',
                            options.groupViewMode
                        ),
                    };
                }
            }
        });

        let spaceItemIndex = 0;
        let currentGroupSpaceItems: ISpaceItems | null;
        const itemsOrder: number[] = [];
        items.forEach((item, index) => {
            const nextItem = items[index + 1];
            // Добавляем индекс оригинального итема со смещением на число спейсингов.
            itemsOrder.push(index + spaceItemsCount);
            // Если текущийй элемент группа и для неё есть спейсинги, то запоминаем их.
            if (visibleGroups.includes(item) && spaceItems[item.key]) {
                currentGroupSpaceItems = spaceItems[item.key];
            }

            // Пытаемся найти верхний спейсинг для текущей группы
            if (visibleGroups.includes(item) && currentGroupSpaceItems?.top) {
                // Добавляем индекс линии-разделителя перед сгруппированными записями.
                itemsOrder.push(spaceItemIndex++);
            }

            // Добавляем нижний спейсинг перед следующей группой или после последнего элемента
            if ((!nextItem || isGroupNode(nextItem)) && currentGroupSpaceItems?.bottom) {
                itemsOrder.push(spaceItemIndex++);
                currentGroupSpaceItems = null;
            }
        });

        return itemsOrder;
    }
}

Object.assign(GroupNodeBlocks.prototype, {
    '[Controls/_baseTreeGrid/display/itemsStrategy/GroupNodeBlocks]': true,
    _moduleName: 'Controls/treeGrid:TreeGridSpaceRow',
});
