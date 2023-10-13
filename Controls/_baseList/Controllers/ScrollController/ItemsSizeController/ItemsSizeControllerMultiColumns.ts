/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import { ItemsSizeController } from './ItemsSizeController';
import { IItemsRange } from 'Controls/_baseList/Controllers/ScrollController/ScrollController';
import { getDimensions } from 'Controls/sizeUtils';

const PLACEHOLDER_SELECTOR = '.js-controls-ListView__beforeItemsPlaceholder';

/**
 * Класс предназначен для получения, хранения и актуализации размеров записей
 * при использовнании вертикального скролла в реестрах, где записи располагаются в несколько столбцов.
 * @private
 */
export default class ItemsSizeControllerMultiColumns extends ItemsSizeController {
    protected _updateItemsSizes(itemsRange: IItemsRange, itemsElements: Element[]): void {
        this._updateContentSizeBeforeItems();

        let position = itemsRange.startIndex;

        // Нужно в оффсете записей всегда учитывать изначальный размер контента до списка,
        // т.к. потом он скроется с помощью VirtualScrollContainer и
        // будет рассинхрон в оффсете между стартовыми записями без виртуализации
        // с записями, которые отображаются после скрытых виртуальным скроллом записей
        let sizeOfHiddenItems = 0;
        if (position === 0) {
            sizeOfHiddenItems = this._contentSizeBeforeItems;
        } else {
            const firstDisplayedItem = this._itemsSizes[position];
            const lastHiddenItem = this._itemsSizes[position - 1];
            const offsetBetweenItems =
                firstDisplayedItem.offset - (lastHiddenItem.offset + lastHiddenItem.size);
            // При скрытии записи мы скрываем марджин только у одной записи,
            // а оффсет между записями складывается из марджинов обеих записей
            sizeOfHiddenItems = firstDisplayedItem.offset - offsetBetweenItems / 2;
        }
        const itemsContainerTop = this._itemsContainer.getBoundingClientRect().top;
        const placeholderSize = this._getPlaceholderSize();

        itemsElements.forEach((element: HTMLElement) => {
            const itemTop = getDimensions(element, true).top;
            const itemOffsetToItemsContainer = itemTop - itemsContainerTop;
            const offset = itemOffsetToItemsContainer + sizeOfHiddenItems - placeholderSize;

            this._itemsSizes[position] = {
                size: this._getItemSize(element),
                offset,
                key: element.getAttribute('item-key'),
            };
            position++;
        });

        this._updateOffsetItemsAfterItem(itemsRange.endIndex);
    }

    private _getPlaceholderSize(): number {
        const placeholder = this._itemsContainer.querySelector(PLACEHOLDER_SELECTOR) as HTMLElement;
        if (!placeholder) {
            return 0;
        }

        return placeholder.offsetHeight;
    }
}
