/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import { IResizingBase } from 'Controls/dragnDrop';
import { IBorderRadiusOptions } from 'Controls/interface';

export enum IResizingArrowPosition {
    LEFT_TOP = 'left-top',
    RIGHT_TOP = 'right-top',
    RIGHT_BOTTOM = 'right-bottom',
    LEFT_BOTTOM = 'left-bottom',
}

/**
 * Интерфейс для контролов, позволяющих визуально отображать процесс изменения других контролов при помощи перемещения мыши
 *
 * @interface Controls/_popupTemplate/interface/IResizingArrow
 * @public
 */
export interface IResizingArrow extends IResizingBase, IBorderRadiusOptions {
    step?: number;
    minWidthOffset?: number;
    maxWidthOffset?: number;
    minHeightOffset?: number;
    maxHeightOffset?: number;
}

/**
 * @name Controls/_popupTemplate/interface/IResizingArrow#maxWidthOffset
 * @cfg {Number} Максимальное значение горизонтального сдвига при изменении значения размера
 * @remark
 * Сдвиг больше указанного визуально отображаться не будет.
 */
/**
 * @name Controls/_popupTemplate/interface/IResizingArrow#minWidthOffset
 * @cfg {Number} Минимальное значение горизонтального сдвига при изменении значения размера
 * @remark
 * Сдвиг больше указанного визуально отображаться не будет.
 */
/**
 * @name Controls/_popupTemplate/interface/IResizingArrow#maxHeightOffset
 * @cfg {Number} Максимальное значение вертикального сдвига при изменении значения размера
 * @remark
 * Сдвиг больше указанного визуально отображаться не будет.
 */
/**
 * @name Controls/_popupTemplate/interface/IResizingArrow#minHeightOffset
 * @cfg {Number} Минимальное значение вертикального сдвига при изменении значения размера
 * @remark
 * Сдвиг больше указанного визуально отображаться не будет.
 */

/**
 * @name Controls/_popupTemplate/interface/IResizingArrow#position
 * @cfg {String} Определяет позицию области ресайза
 * @variant left-top
 * @variant right-top
 * @variant left-bottom
 * @variant right-bottom
 * @default right-top
 * @demo Controls-demo/Popup/Dialog/Resizable/Index
 */

/**
 * @name Controls/_popupTemplate/interface/IResizingArrow#step
 * @cfg {number} Определяет шаг, с которым будет происходить смещение
 * @demo Controls-demo/Popup/Dialog/ResizingOptions/Index
 */
