/**
 * @kaizen_zone ce62f4d3-41d2-4ad2-87da-a1f6c4c8c567
 */
import template = require('wml!Controls/_dragnDrop/ResizingLine/ResizingLine');
import { descriptor } from 'Types/entity';
import { IDragObject } from 'Controls/dragnDrop';
import { TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UI/Events';
import { IResizingLine } from 'Controls/_dragnDrop/interface/IResizingLine';
import ResizingBase from 'Controls/_dragnDrop/ResizingBase';
import { RegisterUtil, UnregisterUtil } from 'Controls/event';
import 'css!Controls/dragnDrop';

interface IOffset {
    style: string;
    value: number;
}

export interface IResizingEntity {
    offset: IOffset;
}

enum ORIENTATION {
    VERTICAL = 'vertical',
    HORIZONTAL = 'horizontal',
    DIAGONAL_UP_RIGHT = 'diagonalUpRight',
    DIAGONAL_UP_LEFT = 'diagonalUpLeft',
    VERTICAL_HORIZONTAL = 'verticalHorizontal',
    HORIZONTAL_VERTICAL = 'horizontalVertical',
}

/**
 * Контрол, позволяющий визуально отображать процесс изменения других контролов при помощи перемещения мышью
 * @remark
 * Родительские DOM элементы не должны иметь overflow: hidden. В противном случае корректная работа не гарантируется.
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/drag-n-drop/ руководство разработчика}
 * * {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_dragnDrop.less переменные тем оформления}
 *
 * @extends Controls/_dragnDrop/ResizingBase
 * @implements Controls/dragnDrop:IResizingBase
 * @implements Controls/dragnDrop:IResizingLine
 *
 * @public
 * @demo Controls-demo/ResizingLine/Index
 */
class ResizingLine extends ResizingBase<IResizingLine> {
    protected _template: TemplateFunction = template;
    protected _styleArea: string = '';
    protected _offsetTop: number;
    protected _offsetLeft: number;
    protected _offsetValue: object = {};

    protected _afterMount() {
        RegisterUtil(this, 'customscroll', this._scrollHandler.bind(this));
    }

    protected _beforeUnmount() {
        UnregisterUtil(this, 'customscroll');
    }

    protected _scrollHandler(event): void {
        if (this._dragging) {
            this._dragObject.offset = this._offsetValue;
            this._onDragHandler(event, this._dragObject);
        }
    }

    protected _onDragHandler(
        event: SyntheticEvent<MouseEvent>,
        dragObject: IDragObject<IResizingEntity>
    ): void {
        const offset =
            this._options.orientation === ORIENTATION.HORIZONTAL
                ? dragObject.offset.x
                : dragObject.offset.y;
        this.drag(offset);
        this._offsetValue = dragObject.offset;
        dragObject.entity.offset = this._validateOffset(offset);
        this._notify('dragMove', [dragObject]);
    }

    protected _clearStyleArea(): void {
        this._styleArea = '';
    }

    protected _isLogicHorizontal(): boolean {
        return (
            this._options.orientation === ORIENTATION.HORIZONTAL ||
            this._options.orientation === ORIENTATION.HORIZONTAL_VERTICAL
        );
    }

    protected _getLogicOrientation(): string {
        return this._isLogicHorizontal() ? ORIENTATION.HORIZONTAL : ORIENTATION.VERTICAL;
    }

    protected _getCursorOrientation(): string {
        return this._options.orientation;
    }

    protected _getEntityOffset(dragObject: IDragObject<IResizingEntity>): Object | number {
        return dragObject.entity.offset.value;
    }

    private _setOffsets(): void {
        const clientRect = this._container?.getBoundingClientRect() || {};
        this._offsetTop = clientRect.top;
        this._offsetLeft = clientRect.left;
    }

    startDrag(): void {
        super.startDrag();
        this._setOffsets();
    }

    fakeDrag(dragObjectOffset: number): void {
        this._setOffsets();
        this._fakeDragging = true;
        this.drag(dragObjectOffset);
    }

    drag(dragObjectOffset: number): void {
        const styleSizeName = this._isLogicHorizontal() ? 'width' : 'height';

        const offset = this._validateOffset(dragObjectOffset);
        const sizeValue = `${Math.abs(offset.value)}px`;

        this._styleArea = `${styleSizeName}:${sizeValue};${offset.style};`;
    }

    protected _validateOffset(x: number): IOffset {
        const offset = this._offset(x);
        const clientRect = this._container?.getBoundingClientRect() || {};

        if (this._isLogicHorizontal() && this._offsetLeft !== clientRect.left) {
            offset.value += this._offsetLeft - clientRect.left;
        }

        if (!this._isLogicHorizontal() && this._offsetTop !== clientRect.top) {
            offset.value += this._offsetTop - clientRect.top;
        }

        return offset;
    }

    protected _offset(offset: number): IOffset {
        const { direction, minOffset, maxOffset, step = 1 } = this._options;
        const x = offset - (offset % step);
        let position;
        if (this._isLogicHorizontal()) {
            position = ['left', 'right'];
        } else {
            position = ['top', 'bottom'];
        }

        if (x > 0 && direction === 'direct') {
            return {
                style: `${position[0]}: 100%`,
                value: Math.min(x, Math.abs(maxOffset)),
            };
        }
        if (x > 0 && direction === 'reverse') {
            return {
                style: `${position[0]}: 0`,
                value: -Math.min(x, Math.abs(minOffset)),
            };
        }
        if (x < 0 && direction === 'direct') {
            return {
                style: `${position[1]}: 0`,
                value: -Math.min(-x, Math.abs(minOffset)),
            };
        }
        if (x < 0 && direction === 'reverse') {
            return {
                style: `${position[1]}: 100%`,
                value: Math.min(-x, Math.abs(maxOffset)),
            };
        }

        return {
            style: '',
            value: 0,
        };
    }

    static defaultProps: IResizingLine = {
        ...ResizingBase.getDefaultOptions(),
        direction: 'direct',
        orientation: ORIENTATION.HORIZONTAL,
        step: 1,
    };

    static getDefaultTypes(): object {
        return {
            ...ResizingBase.getDefaultTypes(),
            direction: descriptor(String).oneOf(['direct', 'reverse']),
            orientation: descriptor(String).oneOf([
                'vertical',
                'horizontal',
                'diagonalUpRight',
                'diagonalUpLeft',
                'horizontalVertical',
                'verticalHorizontal',
            ]),
        };
    }
}

export default ResizingLine;
