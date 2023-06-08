/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import template = require('wml!Controls/_popupTemplate/ResizingArrow/ResizingArrow');
import { IDragObject, ResizingBase } from 'Controls/dragnDrop';
import { TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import {
    IResizingArrow,
    IResizingArrowPosition,
} from './interface/IResizingArrow';
import 'css!Controls/dragnDrop';
import 'css!Controls/popupTemplate';

interface IOffsetValue {
    style: string;
    value: number;
}

interface IOffset {
    x: IOffsetValue;
    y: IOffsetValue;
}

interface IMinMaxOffset {
    minOffset: number;
    maxOffset: number;
}

interface IStyleArea {
    horizontalStyle?: string;
    verticalStyle?: string;
    width?: string;
    height?: string;
    widthStyle?: string;
    heightStyle?: string;
}

interface IDragObjectOffset {
    x?: number;
    y?: number;
}

/**
 * Контрол, позволяющий визуально отображать процесс изменения других контролов при помощи перемещения мышью по заданной границе
 * @remark
 * Родительские DOM элементы не должны иметь overflow: hidden. В противном случае корректная работа не гарантируется.
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/drag-n-drop/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_dragnDrop.less переменные тем оформления}
 *
 * @class Controls/_popupTemplate/ResizingArrow
 * @extends Controls/_dragnDrop/ResizingBase
 * @implements Controls/dragnDrop:IResizingBase
 *
 * @public
 * @demo Controls-demo/PopupTemplate/ResizingArrow/Index
 */
class ResizingArrow extends ResizingBase<IResizingArrow> {
    protected _template: TemplateFunction = template;
    protected _styleArea: IStyleArea = {};

    protected _onDragHandler(
        event: SyntheticEvent<MouseEvent>,
        dragObject: IDragObject
    ): void {
        this.drag(dragObject.offset);
        dragObject.entity.offset = this._offset(dragObject.offset);
    }

    protected _getEntityOffset(dragObject: IDragObject): object {
        return {
            x: dragObject.entity.offset.x.value,
            y: dragObject.entity.offset.y.value,
        };
    }

    protected _clearStyleArea(): void {
        this._styleArea = {};
    }

    protected _getMinMaxOffsetValue(
        offsetValue: number,
        minMax: number[]
    ): number {
        if (offsetValue > 0) {
            return Math.min(offsetValue, minMax[0]);
        }
        return -Math.min(Math.abs(offsetValue), minMax[1]);
    }

    drag(dragObjectOffset: IDragObjectOffset): void {
        const offset = this._offset(dragObjectOffset);
        let xValue = offset.x.value;
        let yValue = offset.y.value;

        yValue = this._getMinMaxOffsetValue(yValue, [
            this._options.maxHeightOffset,
            this._options.minHeightOffset,
        ]);
        xValue = this._getMinMaxOffsetValue(xValue, [
            this._options.maxWidthOffset,
            this._options.minWidthOffset,
        ]);

        let horizontalStyle: string;
        let verticalStyle: string;
        if (xValue > 0) {
            horizontalStyle =
                `width: calc( 100% + ${xValue}px); height: ${Math.abs(
                    yValue
                )}px;` + offset.y.style;
            if (this._options.position.includes('left')) {
                horizontalStyle += `left: -${xValue}px`;
            }
        } else {
            horizontalStyle =
                `width: 100%; height: ${Math.abs(yValue)}px;` + offset.y.style;
        }

        if (yValue > 0) {
            verticalStyle =
                `height: 100%; width: ${Math.abs(xValue)}px;` + offset.x.style;
        } else {
            verticalStyle =
                `height: calc( 100% + ${yValue}px); width: ${Math.abs(
                    xValue
                )}px;` + offset.x.style;
            if (this._options.position.includes('top')) {
                verticalStyle += `top: ${yValue * -1}px`;
            }
        }

        this._styleArea = {
            horizontalStyle,
            verticalStyle,
        };
    }

    private _getOffset(
        offsetX: number,
        offsetY: number
    ): { xValue: number; yValue: number } {
        if (this._options.position.includes('top')) {
            offsetY *= -1;
        }
        if (this._options.position.includes('left')) {
            offsetX *= -1;
        }
        return {
            xValue: offsetX - (offsetX % this._options.step),
            yValue: offsetY - (offsetY % this._options.step),
        };
    }

    private _offsetValue(val: number, position: string[]): IOffsetValue {
        const { minOffset, maxOffset } = this._getMinMaxOffset(position[0]);

        if (val > 0) {
            if (this._options.position.includes(position[0])) {
                return {
                    style: `${position[1]}: 100%;${position[0]}: auto;`,
                    value: -Math.min(-val, Math.abs(minOffset)),
                };
            } else {
                return {
                    style: `${position[0]}: 100%;${position[1]}: auto;`,
                    value: Math.min(val, Math.abs(maxOffset)),
                };
            }
        }
        if (val < 0) {
            if (this._options.position.includes(position[0])) {
                return {
                    style: `${position[0]}: 0;${position[1]}: auto;`,
                    value: Math.min(val, Math.abs(maxOffset)),
                };
            } else {
                return {
                    style: `${position[1]}: 0; ${position[0]}: auto;`,
                    value: -Math.min(-val, Math.abs(minOffset)),
                };
            }
        }
        return {
            style: '',
            value: 0,
        };
    }

    protected _getMinMaxOffset(position: string): IMinMaxOffset {
        const {
            maxWidthOffset = this._options.maxOffset,
            maxHeightOffset = this._options.maxOffset,
            minWidthOffset = this._options.minOffset,
            minHeightOffset = this._options.minOffset,
        } = this._options;
        if (['left', 'right'].includes(position)) {
            return {
                maxOffset: maxWidthOffset,
                minOffset: minWidthOffset,
            };
        }
        return {
            maxOffset: maxHeightOffset,
            minOffset: minHeightOffset,
        };
    }

    protected _offset(offset: IDragObjectOffset): IOffset {
        const { xValue, yValue } = this._getOffset(offset.x, offset.y);
        return {
            x: this._offsetValue(xValue, ['left', 'right']),
            y: this._offsetValue(yValue, ['top', 'bottom']),
        };
    }

    static defaultProps: IResizingArrow = {
        ...ResizingBase.getDefaultOptions(),
        position: IResizingArrowPosition.RIGHT_BOTTOM,
        step: 1,
        borderRadius: 's',
        minWidthOffset: 1000,
        maxWidthOffset: 1000,
        minHeightOffset: 1000,
        maxHeightOffset: 1000,
    };
}

/**
 * @typedef {Object} EventOffset
 * @property {number} x Смещение по оси X
 * @property {number} y Смещение по оси Y
 */

/**
 * @event Controls/_popupTemplate/ResizingArrow#offset Происходит после перетаскивания мыши, когда клавиша мыши отпущена.
 * @param {EventOffset} offset Значение сдвига
 */

export default ResizingArrow;
