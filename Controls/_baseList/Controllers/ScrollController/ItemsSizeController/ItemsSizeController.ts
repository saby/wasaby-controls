/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import {
    AbstractItemsSizesController,
    IAbstractItemsSizesControllerOptions,
} from './AbstractItemsSizeController';
import {
    getDimensions,
    getOffsetTop,
    DimensionsMeasurer,
} from 'Controls/sizeUtils';

export { IAbstractItemsSizesControllerOptions as IItemsSizesControllerOptions };

/**
 * Класс предназначен для получения, хранения и актуализации размеров записей
 * при использовнании вертикального скролла.
 * @private
 */
export class ItemsSizeController extends AbstractItemsSizesController {
    protected _getContentSizeBeforeContainer(
        itemsContainer: HTMLElement,
        scrollContent: HTMLElement
    ): number {
        return scrollContent
            ? getDimensions(itemsContainer, true).top -
                  DimensionsMeasurer.getBoundingClientRect(scrollContent).top
            : getOffsetTop(itemsContainer);
    }

    /**
     * Возвращает размер записи: высоту соответствующего html-элемента.
     * @param element - соответствующий записи html-элемент
     * @protected
     */
    protected _getItemSize(element: HTMLElement): number {
        return getDimensions(element).height;
    }
}
