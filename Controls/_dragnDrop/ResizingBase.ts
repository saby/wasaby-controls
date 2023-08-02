/**
 * @kaizen_zone b9a403ff-e006-4511-98de-c3f6c764b219
 */
import { descriptor } from 'Types/entity';
import { Container, IDragObject, IResizingBase } from 'Controls/dragnDrop';
import { Control, IControlOptions } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import { detection } from 'Env/Env';

/**
 * Контрол, позволяющий визуально отображать процесс изменения других контролов при помощи перемещения мышью
 * @remark
 * Родительские DOM элементы не должны иметь overflow: hidden. В противном случае корректная работа не гарантируется.
 *
 * @class Controls/_dragnDrop/ResizingBase
 * @private
 * @extends UI/Base:Control
 *
 */
abstract class ResizingBase<T extends IResizingBase> extends Control<IControlOptions, T> {
    protected _children: { dragNDrop: Container };
    protected _options: T;
    protected _isMobilePlatform: boolean;
    protected _styleArea: object | string = null;
    protected _dragging: boolean = false;
    protected _fakeDragging: boolean = false;

    protected _beforeMount(): void {
        this._isMobilePlatform = detection.isMobilePlatform;
    }

    protected _beginDragHandler(event: SyntheticEvent<MouseEvent>): void {
        // to disable selection while dragging
        if (event.type !== 'touchstart') {
            event.preventDefault();
        }
        if (detection.isMobilePlatform) {
            event.stopPropagation();
        }
        // preventDefault for disable selection while dragging stopped the focus => active elements don't deactivated.
        // activate control manually
        this.activate();

        this._children.dragNDrop.startDragNDrop(
            {
                ...this._options.entity,
                offset: 0,
            },
            event,
            {
                /**
                 * Во время перемещения отключается действие :hover на странице. Перемещение можно начать
                 * сразу или после преодоления мыши некоторого расстояния. Если мышь во время движения выйдет за
                 * пределы контрола, и будет над элементом со стилями по :hover, то эти стили применятся. Как только мышь
                 * пройдет достаточно для начала перемещения, то стили отключатся. Произойдет моргание внешнего вида.
                 * Чтобы такого не было нужно начинать перемещение сразу.
                 */
                immediately: true,
            }
        );
    }

    protected _onStartDragHandler(): void {
        this.startDrag();
    }

    startDrag(): void {
        this._dragging = true;
        this._notify('customdragStart');
    }

    endDrag(offset: object | number): void {
        if (this._dragging) {
            this._clearStyleArea();
            this._dragging = false;
            this._notify('offset', [offset, this._options.position]);
        }
        if (this._fakeDragging) {
            this._clearStyleArea();
            this._fakeDragging = false;
        }
    }

    abstract drag(dragObjectOffset: object | number): void;

    protected abstract _clearStyleArea(): void;

    protected abstract _offset(value: Object | number): object;

    protected abstract _getEntityOffset(dragObject: IDragObject): Object | number;

    protected abstract _onDragHandler(
        event: SyntheticEvent<MouseEvent>,
        dragObject: IDragObject
    ): void;

    protected _onEndDragHandler(event: SyntheticEvent<MouseEvent>, dragObject: IDragObject): void {
        if (this._dragging || this._fakeDragging) {
            this.endDrag(this._getEntityOffset(dragObject));
        }
    }

    // Use in template.
    protected _isResizing(minOffset: number, maxOffset: number): boolean {
        return minOffset !== 0 || maxOffset !== 0;
    }

    static getDefaultTypes(): object {
        return {
            minOffset: descriptor(Number),
            maxOffset: descriptor(Number),
        };
    }

    static getDefaultOptions(): IResizingBase {
        return {
            minOffset: 1000,
            maxOffset: 1000,
            areaStyle: 'default',
        };
    }
}

export default ResizingBase;
