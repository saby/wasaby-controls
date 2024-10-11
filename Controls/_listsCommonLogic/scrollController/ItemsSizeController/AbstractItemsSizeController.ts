/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import type { IItemsRange } from '../ScrollController';
import { Logger } from 'UI/Utils';
import { CrudEntityKey } from 'Types/source';
import { getStickyHeadersHeight, StickyPosition, TypeFixedBlocks } from 'Controls/stickyBlock';
import { getScrollContentElement } from 'Controls/scroll';

export interface IAbstractItemsSizesControllerOptions {
    itemsContainer?: HTMLElement;
    listContainer?: HTMLElement;
    itemsQuerySelector: string;
    totalCount: number;
    feature1184208466?: boolean;
}

export interface IItemSize {
    key?: string;
    size: number;
    offset: number;
}

export type IItemsSizes = IItemSize[];

export interface IRenderedOutsideItem {
    key: string;
    collectionIndex: number;
}

/**
 * Класс предназначен для получения, хранения и актуализации размеров записей.
 * @private
 */
export abstract class AbstractItemsSizesController {
    protected _itemsQuerySelector: string;
    protected _itemsContainer?: HTMLElement;
    protected _listContainer?: HTMLElement;
    protected _itemsSizes: IItemsSizes = [];

    /**
     * поддержка асинхронного рендера записей
     */
    protected _feature1184208466: boolean;

    /**
     * Кол-во элементов, которые были отрисованы за пределами текущего диапазона(например, застиканные записи)
     * @private
     */
    private _itemsRenderedOutsideRange: IRenderedOutsideItem[] = [];

    /**
     * Размер контента до списка внутри ScrollContainer.
     * @private
     */
    protected _contentSizeBeforeItems: number = 0;

    /**
     * Размер контента, перекрывающего список.
     * @private
     */
    private _viewportOverlaySize: number = 0;

    private _itemsContainerSize: number = 0;

    constructor(options: IAbstractItemsSizesControllerOptions) {
        this._itemsContainer = options.itemsContainer;
        this._listContainer = options.listContainer;
        this._itemsQuerySelector = options.itemsQuerySelector;
        this._feature1184208466 = options.feature1184208466;
        this.resetItems(options.totalCount);
    }

    getItemsSizes(): IItemsSizes {
        return this._itemsSizes.map((it) => ({ ...it }));
    }

    updateItemsSizes(itemsRange: IItemsRange): IItemsSizes {
        this.updateItemsContainerSize();

        if (this._itemsContainer) {
            let itemsElements = Array.from(
                this._itemsContainer.querySelectorAll(this._itemsQuerySelector)
            ) as HTMLElement[];
            if (!this._domElementsMatchToRange(itemsRange, itemsElements)) {
                Logger.error(
                    'Controls/list:ItemsSizeController.updateItemsSizes | ' +
                        'The count of elements in the DOM differs from the length of the updating items range. ' +
                        `Check that each item has selector: ${this._itemsQuerySelector}.`
                );
            } else {
                this._updateRenderedOutsideRangeItemsSizes(itemsElements);

                itemsElements = itemsElements.filter((element) => {
                    const key = element.getAttribute('item-key');
                    return !this._itemsRenderedOutsideRange.find((it) => it.key === key);
                });
                this._updateItemsSizes(itemsRange, itemsElements);
            }
        } else {
            for (let position = itemsRange.startIndex; position < itemsRange.endIndex; position++) {
                this._itemsSizes[position] = AbstractItemsSizesController._getEmptyItemSize();
            }
        }

        return this.getItemsSizes();
    }

    getElement(key: string): HTMLElement | null {
        if (!this._itemsContainer) {
            return null;
        }

        const selector = `${this._itemsQuerySelector}[item-key='${key}']`;
        return this._itemsContainer.querySelector(selector);
    }

    /**
     * Возвращает размер контента, расположенного в этом же ScrollContainer-е до элементов списка.
     */
    getContentSizeBeforeItems(): number | null {
        if (!this._itemsContainer) {
            return null;
        }

        const scrollContent = getScrollContentElement(this._itemsContainer);
        return this._getContentSizeBeforeContainer(this._itemsContainer, scrollContent);
    }

    /**
     * Возвращает размер перекрывающих вьюпорт элементов.
     */
    getViewportOverlaySize(): number | null {
        return this._viewportOverlaySize;
    }

    /**
     * Обновляет размер перекрывающих вьюпорт элементов.
     */
    updateViewportOverlaySize(): void {
        const customOverlayElementSelector = '.js-Controls-list-customOverlayElement';
        if (!this._itemsContainer) {
            return null;
        }
        const scrollContent = getScrollContentElement(this._itemsContainer);
        const stickyBlocksSize =
            getStickyHeadersHeight(
                this._itemsContainer,
                StickyPosition.Top,
                TypeFixedBlocks.Fixed
            ) || 0;
        let customOverlayElementsSize = 0;
        if (scrollContent) {
            const customOverlayElements = Array.from(
                scrollContent.querySelectorAll(customOverlayElementSelector)
            );
            customOverlayElementsSize = customOverlayElements.reduce((sum, element) => {
                return sum + element.clientHeight;
            }, 0);
        }
        this._viewportOverlaySize = stickyBlocksSize + customOverlayElementsSize;
    }

    updateItemsContainerSize(): boolean {
        const newItemsContainerSize = this._itemsContainer?.getBoundingClientRect().height || 0;
        if (newItemsContainerSize !== this._itemsContainerSize) {
            this._itemsContainerSize = newItemsContainerSize;
            return true;
        }

        return false;
    }

    /**
     * Возвращает размер застиканного контента, расположенного в этом же ScrollContainer-е до элементов списка.
     */
    getStickyContentSizeBeforeItems(): number | null {
        if (!this._itemsContainer) {
            return null;
        }
        return (
            getStickyHeadersHeight(
                this._itemsContainer,
                StickyPosition.Top,
                TypeFixedBlocks.Fixed
            ) || 0
        );
    }

    /**
     * Возвращает размер контента, расположенного в этом же ScrollContainer-е до списка.
     */
    getContentSizeBeforeList(): number {
        if (!this._listContainer) {
            return null;
        }
        const scrollContent = getScrollContentElement(this._listContainer);
        return this._getContentSizeBeforeContainer(this._listContainer, scrollContent);
    }

    /**
     * Устанавливает массив элементов, которые отрисовываются за пределами диапазона
     * Например, это застиканная запись(мы не должны ее скрывать из диапазона пока она застикана)
     * @param items
     */
    setItemsRenderedOutsideRange(items: IRenderedOutsideItem[]): void {
        this._itemsRenderedOutsideRange = items;
    }

    isListContainerHidden(): boolean {
        return !!this._listContainer && !this._listContainer.offsetParent;
    }

    // region on DOM references update

    setItemsContainer(newItemsContainer?: HTMLElement): boolean {
        const updated = this._itemsContainer !== newItemsContainer;
        if (updated) {
            this._itemsContainer = newItemsContainer;
        }
        return updated;
    }

    getItemsContainer(): HTMLElement {
        return this._itemsContainer;
    }

    setListContainer(newListContainer?: HTMLElement): void {
        this._listContainer = newListContainer;
    }

    getListContainer(): HTMLElement {
        return this._listContainer;
    }

    getListContainerOffset(): number {
        if (!this._listContainer) {
            return 0;
        }

        return parseInt(getComputedStyle(this._listContainer).paddingTop, 10);
    }

    setItemsQuerySelector(newItemsQuerySelector: string): void {
        this._itemsQuerySelector = newItemsQuerySelector;
    }

    // endregion

    // region on collection change

    addItems(position: number, count: number): IItemsSizes {
        const defaultItemsOffset =
            position === 0 ? Math.max(this._contentSizeBeforeItems || 0, 0) : 0;
        const addedItemsSize = AbstractItemsSizesController._getEmptyItemsSizes(
            count,
            defaultItemsOffset
        );
        this._itemsSizes.splice(position, 0, ...addedItemsSize);

        return this.getItemsSizes();
    }

    moveItems(
        addPosition: number,
        addCount: number,
        removePosition: number,
        removeCount: number
    ): IItemsSizes {
        this.addItems(addPosition, addCount);
        this.removeItems(removePosition, removeCount);
        return this.getItemsSizes();
    }

    removeItems(position: number, count: number): IItemsSizes {
        this._itemsSizes.splice(position, count);
        this._updateOffsetItemsAfterItem(position);
        return this.getItemsSizes();
    }

    resetItems(count: number, givenItemsSizes?: IItemsSizes): IItemsSizes {
        // Инициализируем _itemsSizes по размерам из itemHeightProperty.
        // Так мы до маунта и получения размеров из DOM делать вычисления для работы с диапазоном.
        // Это нужно для оптимизации рендера тяжелых списков, например, в карточке контрагента,
        // где построить даже одну лишнюю запись дорого для производительности.
        if (givenItemsSizes) {
            this._itemsSizes = givenItemsSizes;
        } else {
            this._itemsSizes = AbstractItemsSizesController._getEmptyItemsSizes(count);
        }
        this._contentSizeBeforeItems = 0;
        return this.getItemsSizes();
    }

    // endregion

    protected _updateItemsSizes(itemsRange: IItemsRange, itemsElements: Element[]): void {
        // item.offset который мы посчитали является расстоянием от края itemsContainer до элемента
        // НО scrollPosition - это расстояние от scrollContainer до границы вьюпорта.
        // Поэтому она учитывает еще и все что находится до itemsContainer.
        // То есть нам нужно поставить item.offset и scrollPosition в одинаковые условия.
        // Для этого корректируем item.offset на contentSizeBeforeItems.
        // Корректировать scrollPosition на contentSizeBeforeItems нельзя, т.к. в кальклуторе есть другие
        // параметры на которые тоже может повлиять contentSizeBeforeItems.
        // Например, triggerOffset - он может содержать высоту ромашки,
        // а ромашка является частью contentSizeBeforeItems.
        // По идее после того как triggerOffset будет позиционироваться от ромашки
        // и высота ромашки на него не будет влиять,
        // то можно будет корректировать только scrollPosition на уровне ScrollController.
        // Это вроде должно выглядеть понятнее.
        this._updateContentSizeBeforeItems();

        let position = itemsRange.startIndex;
        // Возможна ситуация, что диапазон сместился с [0, 5] на [10, 15].В этом случае предыдущий отрисованный
        // элемент это не startIndex - 1, а это первый от startIndex к началу отрендеренный элемент;
        const beforeRangeItems = this._itemsSizes.slice(0, itemsRange.startIndex);
        const renderedItemSizeBeforeRange = beforeRangeItems.reverse().find((it) => {
            return !!it.size;
        });
        itemsElements.forEach((element: HTMLElement) => {
            // Не обновляем размер элемента, если внутри него не завершился рендер.
            // Когда завершится, обновим сразу по актуальному размер.
            if (
                this._feature1184208466 &&
                element.querySelector('[name="$$wasaby$async$loading"]')
            ) {
                position++;
                return;
            }
            const prevRenderedItemSize =
                position === itemsRange.startIndex
                    ? renderedItemSizeBeforeRange
                    : this._itemsSizes[position - 1];
            // оффсет не учитывает margin-ы, нужно будет решить эту проблему. offsetTop ее не решает.
            // Если брать offsetTop у записи, то возникает еще проблема с застикаными записями.
            const offset = prevRenderedItemSize
                ? prevRenderedItemSize.offset + prevRenderedItemSize.size
                : this._contentSizeBeforeItems;
            this._itemsSizes[position] = {
                size: this._getItemSize(element),
                offset,
                key: element.getAttribute('item-key'),
            };
            position++;
        });

        this._updateOffsetItemsAfterItem(itemsRange.endIndex);
    }

    protected _updateRenderedOutsideRangeItemsSizes(itemsElements: HTMLElement[]): void {
        if (!this._itemsRenderedOutsideRange?.length || !this._itemsSizes?.length) {
            return;
        }

        let firstUpdatedItemIndex = this._itemsSizes.length;
        this._itemsRenderedOutsideRange.forEach((item) => {
            const itemElementIndex = itemsElements.findIndex(
                (it) => it.getAttribute('item-key') === item.key
            );
            if (itemElementIndex === -1) {
                Logger.error(
                    'State _itemsRenderedOutsideRange is wrong. Item rendered outside range is not rendered in fact.'
                );
                return;
            }

            if (item.collectionIndex < firstUpdatedItemIndex) {
                firstUpdatedItemIndex = item.collectionIndex;
            }

            const itemSize = this._itemsSizes[item.collectionIndex];
            const itemSizeFoundedByKey = this._itemsSizes.find((it) => it.key === item.key);
            if (itemSizeFoundedByKey && itemSize !== itemSizeFoundedByKey) {
                Logger.error(
                    'Index of item in itemsSizes differ from index in collection. Out of sync will throw errors.'
                );
                return;
            }

            const itemElement = itemsElements[itemElementIndex];
            this._itemsSizes[item.collectionIndex] = {
                key: item.key,
                offset: itemSize.offset,
                size: this._getItemSize(itemElement),
            };
        });

        this._updateOffsetItemsAfterItem(firstUpdatedItemIndex);
    }

    protected _updateOffsetItemsAfterItem(itemIndex: number): void {
        if (itemIndex < 0 || itemIndex >= this._itemsSizes.length) {
            return;
        }

        // Т.к. мы обновили размеры в начале массива, то у последующих элементов нужно обновить offset
        // Мы используем offset записей для рассчета edgeItem, поэтому и восстановления скролла.
        // Поэтому важно, чтобы у элементов были актуальные offset'ы. Иначе, если у отрисованной сверху записи
        // обновится offset, то скролл восстановится с учетом этой разницы, как будто, изменение произошло сейчас.
        const lastUpdatedItem = this._itemsSizes[itemIndex - 1] || {
            size: 0,
            offset: this._contentSizeBeforeItems,
        };
        const firstNotUpdatedItem = this._itemsSizes[itemIndex];
        const updatedItemsOffset =
            lastUpdatedItem.offset + lastUpdatedItem.size - firstNotUpdatedItem.offset;
        for (let i = itemIndex; i < this._itemsSizes.length; i++) {
            this._itemsSizes[i].offset += updatedItemsOffset;
        }
    }

    protected _updateContentSizeBeforeItems(): void {
        const contentSizeBeforeItems = this.getContentSizeBeforeItems();
        // если поменялся размер контента до элементов, то нужно скорректировать оффсет у всех записей
        if (this._contentSizeBeforeItems !== contentSizeBeforeItems) {
            const offset = contentSizeBeforeItems - this._contentSizeBeforeItems;
            this._itemsSizes.forEach((it) => {
                return (it.offset = Math.max(it.offset + offset, 0));
            });
            this._contentSizeBeforeItems = contentSizeBeforeItems;
        }
    }

    /**
     * Проверяет, что записи отрисовались правильно
     * @param itemsRange
     * @param itemsElements
     * @private
     */
    protected _domElementsMatchToRange(itemsRange: IItemsRange, itemsElements: Element[]): boolean {
        const itemsRangeLength = itemsRange.endIndex - itemsRange.startIndex;
        const renderedItemsCount = itemsElements.length;
        const renderedItemsCountFromRange =
            renderedItemsCount - this._itemsRenderedOutsideRange.length;
        return renderedItemsCountFromRange === itemsRangeLength;
    }

    /**
     * Возвращает размер контента, который находится в scrollContent, но до container.
     * @param container
     * @param scrollContent
     * @protected
     */
    protected abstract _getContentSizeBeforeContainer(
        container: HTMLElement,
        scrollContent: Element
    ): number;

    /**
     * Возвращает размер записи по соответствующему ей html-элметенту
     * @param element
     * @protected
     */
    protected abstract _getItemSize(element: HTMLElement): number;

    protected static _getEmptyItemSize(defaultOffset: number = 0): IItemSize {
        return {
            size: 0,
            offset: defaultOffset,
        };
    }

    private static _getEmptyItemsSizes(count: number, defaultOffset: number = 0): IItemsSizes {
        const itemsSizes = Array(count);
        for (let position = 0; position < count; position++) {
            itemsSizes[position] = AbstractItemsSizesController._getEmptyItemSize(defaultOffset);
        }
        return itemsSizes;
    }
}
