import { ItemsSizeController, IItemsRange } from 'Controls/baseList';

export default class ColumnItemsSizeController extends ItemsSizeController {
    protected _updateItemsSizes(
        itemsRange: IItemsRange,
        itemsElements: Element[]
    ): void {
        this._updateContentSizeBeforeItems();

        let position = itemsRange.startIndex;
        itemsElements.forEach((element: HTMLElement) => {
            const offset =
                element.getBoundingClientRect().top -
                this._itemsContainer.getBoundingClientRect().top;
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
