import { AbstractItemsSizesController } from 'Controls/baseList';
import { getDimensions } from 'Controls/sizeUtils';

export class TestItemsSizesController extends AbstractItemsSizesController {
    protected _getContentSizeBeforeContainer(
        container: HTMLElement,
        scrollContent: Element
    ): number {
        return getDimensions(container, true).top;
    }

    protected _getItemSize(element: HTMLElement): number {
        return getDimensions(element).height;
    }
}
