/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import { ItemsSizeController } from './ItemsSizeController';
import { IItemsRange } from 'Controls/_baseList/Controllers/ScrollController/ScrollController';

/**
 * Класс предназначен для получения, хранения и актуализации размеров записей
 * при использовнании вертикального скролла в реестрах, где записи располагаются в несколько столбцов.
 * @private
 */
export default class ItemsSizeControllerMultiColumns extends ItemsSizeController {
    protected _updateItemsSizes(
        itemsRange: IItemsRange,
        itemsElements: Element[]
    ): void {
        this._updateContentSizeBeforeItems();

        let position = itemsRange.startIndex;
        // Нужно учитывать оффсет элементов скрытых виртуальным диапазоном.
        // Например, был диапазон 0 - 10, стал 5 - 15
        // У 5-ой записи offset === 0, но перед ней есть еще 5-ть скрытых записей, у которых мы знаем offset.
        let hiddenItemsOffset = 0;
        if (position > 0) {
            const lastHiddenItem = this._itemsSizes[position];
            hiddenItemsOffset =
                lastHiddenItem.offset - this._contentSizeBeforeItems;
        }

        itemsElements.forEach((element: HTMLElement) => {
            let offset =
                element.getBoundingClientRect().top -
                this._itemsContainer.getBoundingClientRect().top;
            offset += hiddenItemsOffset + this._contentSizeBeforeItems;

            this._itemsSizes[position] = {
                size: this._getItemSize(element),
                offset,
                key: element.getAttribute('item-key'),
            };
            position++;
        });

        this._updateOffsetItemsAfterRange(itemsRange);
    }
}
