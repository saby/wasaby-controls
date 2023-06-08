/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import type { IItemsRange } from '../ScrollController';
import { Logger } from 'UI/Utils';
import { CrudEntityKey } from 'Types/source';
import { getStickyHeadersHeight } from 'Controls/stickyBlock';

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
    private _itemsRenderedOutsideRange: string[] = [];

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

    constructor(options: IAbstractItemsSizesControllerOptions) {
        this._itemsContainer = options.itemsContainer;
        this._listContainer = options.listContainer;
        this._itemsQuerySelector = options.itemsQuerySelector;
        this._feature1184208466 = options.feature1184208466;
        this.resetItems(options.totalCount);
    }

    getItemsSizes(): IItemsSizes {
        return [...this._itemsSizes];
    }

    updateItemsSizes(itemsRange: IItemsRange): IItemsSizes {
        if (this._itemsContainer) {
            let itemsElements = Array.from(
                this._itemsContainer.querySelectorAll(this._itemsQuerySelector)
            );
            if (!this._domElementsMatchToRange(itemsRange, itemsElements)) {
                Logger.error(
                    'Controls/list:ItemsSizeController.updateItemsSizes | ' +
                        'The count of elements in the DOM differs from the length of the updating items range. ' +
                        `Check that each item has selector: ${this._itemsQuerySelector}.`
                );
            } else {
                itemsElements = itemsElements.filter((element) => {
                    const key = element.getAttribute('item-key');
                    return !this._itemsRenderedOutsideRange.includes(key);
                });
                this._updateItemsSizes(itemsRange, itemsElements);
            }
        } else {
            for (
                let position = itemsRange.startIndex;
                position < itemsRange.endIndex;
                position++
            ) {
                this._itemsSizes[position] =
                    AbstractItemsSizesController._getEmptyItemSize();
            }
        }

        return this.getItemsSizes();
    }

    getElement(key: CrudEntityKey): HTMLElement | null {
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

        const scrollContent = this._itemsContainer.closest(
            '.controls-Scroll-ContainerBase__content'
        );
        return this._getContentSizeBeforeContainer(
            this._itemsContainer,
            scrollContent
        );
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
        const customOverlayElementSelector =
            '.js-Controls-list-customOverlayElement';
        if (!this._itemsContainer) {
            return null;
        }
        const scrollContent = this._itemsContainer.closest(
            '.controls-Scroll-ContainerBase__content'
        );
        const stickyBlocksSize =
            getStickyHeadersHeight(this._itemsContainer, 'top', 'fixed') || 0;
        let customOverlayElementsSize = 0;
        if (scrollContent) {
            const customOverlayElements = Array.from(
                scrollContent.querySelectorAll(customOverlayElementSelector)
            );
            customOverlayElementsSize = customOverlayElements.reduce(
                (sum, element) => {
                    return sum + element.clientHeight;
                },
                0
            );
        }
        this._viewportOverlaySize =
            stickyBlocksSize + customOverlayElementsSize;
    }

    /**
     * Возвращает размер застиканного контента, расположенного в этом же ScrollContainer-е до элементов списка.
     */
    getStickyContentSizeBeforeItems(): number | null {
        if (!this._itemsContainer) {
            return null;
        }
        return (
            getStickyHeadersHeight(this._itemsContainer, 'top', 'fixed') || 0
        );
    }

    /**
     * Возвращает размер контента, расположенного в этом же ScrollContainer-е до списка.
     */
    getContentSizeBeforeList(): number {
        if (!this._listContainer) {
            return null;
        }

        const scrollContent = this._listContainer.closest(
            '.controls-Scroll-ContainerBase__content'
        );
        return this._getContentSizeBeforeContainer(
            this._listContainer,
            scrollContent
        );
    }

    /**
     * Устанавливает массив элементов, которые отрисовываются за пределами диапазона
     * Например, это застиканная запись(мы не должны ее скрывать из диапазона пока она застикана)
     * @param items
     */
    setItemsRenderedOutsideRange(items: string[]): void {
        this._itemsRenderedOutsideRange = items;
    }

    isListContainerHidden(): boolean {
        return !!this._listContainer && !this._listContainer.offsetParent;
    }

    // region on DOM references update

    setItemsContainer(newItemsContainer?: HTMLElement): void {
        this._itemsContainer = newItemsContainer;
    }

    setListContainer(newListContainer?: HTMLElement): void {
        this._listContainer = newListContainer;
    }

    setItemsQuerySelector(newItemsQuerySelector: string): void {
        this._itemsQuerySelector = newItemsQuerySelector;
    }

    // endregion

    // region on collection change

    addItems(position: number, count: number): IItemsSizes {
        const addedItemsSize =
            AbstractItemsSizesController._getEmptyItemsSizes(count);
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
            this._itemsSizes =
                AbstractItemsSizesController._getEmptyItemsSizes(count);
        }
        return this.getItemsSizes();
    }

    // endregion

    protected _updateItemsSizes(
        itemsRange: IItemsRange,
        itemsElements: Element[]
    ): void {
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
        const beforeRangeItems = this._itemsSizes.slice(
            0,
            itemsRange.startIndex
        );
        const renderedItemSizeBeforeRange = beforeRangeItems
            .reverse()
            .find((it) => {
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

        this._updateOffsetItemsAfterRange(itemsRange);
    }

    protected _updateOffsetItemsAfterRange(itemsRange: IItemsRange): void {
        // Т.к. мы обновили размеры в начале массива, то у последующих элементов нужно обновить offset
        // Мы используем offset записей для рассчета edgeItem, поэтому и восстановления скролла.
        // Поэтому важно, чтобы у элементов были актуальные offset'ы. Иначе, если у отрисованной сверху записи
        // обновится offset, то скролл восстановится с учетом этой разницы, как будто, изменение произошло сейчас.
        if (
            itemsRange.endIndex > 0 &&
            itemsRange.endIndex < this._itemsSizes.length
        ) {
            const lastUpdatedItem = this._itemsSizes[itemsRange.endIndex - 1];
            const firstNotUpdatedItem = this._itemsSizes[itemsRange.endIndex];
            const updatedItemsOffset =
                lastUpdatedItem.offset +
                lastUpdatedItem.size -
                firstNotUpdatedItem.offset;
            for (
                let i = itemsRange.endIndex;
                i < this._itemsSizes.length;
                i++
            ) {
                this._itemsSizes[i].offset += updatedItemsOffset;
            }
        }
    }

    protected _updateContentSizeBeforeItems(): void {
        const contentSizeBeforeItems = this.getContentSizeBeforeItems();
        // если поменялся размер контента до элементов, то нужно скорректировать оффсет у всех записей
        if (this._contentSizeBeforeItems !== contentSizeBeforeItems) {
            const offset =
                contentSizeBeforeItems - this._contentSizeBeforeItems;
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
    protected _domElementsMatchToRange(
        itemsRange: IItemsRange,
        itemsElements: Element[]
    ): boolean {
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

    protected static _getEmptyItemSize(): IItemSize {
        return {
            size: 0,
            offset: 0,
        };
    }

    private static _getEmptyItemsSizes(count: number): IItemsSizes {
        const itemsSizes = Array(count);
        for (let position = 0; position < count; position++) {
            itemsSizes[position] =
                AbstractItemsSizesController._getEmptyItemSize();
        }
        return itemsSizes;
    }
}
