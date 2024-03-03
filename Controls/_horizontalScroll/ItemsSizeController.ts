/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import {
    AbstractItemsSizesController,
    IAbstractItemsSizesControllerOptions,
} from 'Controls/baseList';
import { getDimensions } from 'Controls/sizeUtils';
import { getStickyHeadersWidth } from 'Controls/stickyBlock';

export { IAbstractItemsSizesControllerOptions as IItemsSizesControllerOptions };

export class ItemsSizeController extends AbstractItemsSizesController {
    getStickyContentSizeBeforeItems(): number | null {
        if (!this._itemsContainer) {
            return null;
        }
        return getStickyHeadersWidth(this._itemsContainer, 'left', 'alLFixed') || 0;
    }

    protected _getContentSizeBeforeContainer(
        itemsContainer: HTMLElement,
        scrollContent: Element
    ): number {
        return scrollContent
            ? getDimensions(itemsContainer, true).left - scrollContent.getBoundingClientRect().left
            : getDimensions(itemsContainer, true).left;
    }

    protected _getItemSize(element: HTMLElement): number {
        return getDimensions(element).width;
    }
}
