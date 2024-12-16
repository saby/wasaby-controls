/**
 * @kaizen_zone f0953b08-a8cc-4567-9a6e-484a988c8a25
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { ISliderOptions } from './interface/ISlider';
import { default as Utils, ILineData, IPointData, IPointDataList, IScaleData } from './Utils';
import { SyntheticEvent } from 'Vdom/Vdom';
import { descriptor as EntityDescriptor } from 'Types/entity';
import { constants } from 'Env/Env';
import { DimensionsMeasurer } from 'Controls/sizeUtils';
import { controller } from 'I18n/i18n';
import { default as DragNDropEntity } from './_DragNDropEntity';
import { Container as DragNDropContainer } from 'Controls/dragnDrop';
import * as SliderTemplate from 'wml!Controls/_slider/sliderTemplate';

export interface ISliderBaseOptions extends IControlOptions, ISliderOptions {}

const MOBILE_TOOLTIP_HIDE_DELAY: number = 3000;
const maxRatioValue = 1;
const maxPercentValue = 100;

abstract class SliderBase<
    TSliderBaseOptions extends ISliderBaseOptions
> extends Control<TSliderBaseOptions> {
    protected _template: TemplateFunction = SliderTemplate;
    protected _tooltipPosition: number | null = null;
    protected _tooltipValue: string | null = null;
    private _hideTooltipTimerId: number;
    protected _viewMode: string = '';
    protected _value: number | null = null;
    protected _isDrag: boolean = false;
    protected _pointData: IPointDataList = undefined;
    protected _scaleData: IScaleData[] = undefined;
    protected _lineData: ILineData = undefined;
    protected _isReverse: boolean = false;
    protected _children: {
        dragNDrop: DragNDropContainer;
    };

    protected _localeDir: string;

    protected _beforeMount(options: ISliderBaseOptions): void {
        this._viewMode = this._getViewMode(options.viewMode);
        this._localeDir = controller.currentLocaleConfig.directionality || 'ltr';
        this._scaleData = Utils.getScaleData(
            options.minValue,
            options.maxValue,
            options.scaleStep,
            options.scaleLabelFormatter
        );
        this._lineData = { position: 0, width: 100 };
        this._value = undefined;
    }

    protected _beforeUpdate(newOptions: ISliderBaseOptions): void {
        this._viewMode = this._getViewMode(newOptions.viewMode);

        if (this._needUpdate(this._options, newOptions)) {
            this._checkOptions(newOptions);
            this._scaleData = Utils.getScaleData(
                newOptions.minValue,
                newOptions.maxValue,
                newOptions.scaleStep,
                newOptions.scaleLabelFormatter
            );
        }
    }

    protected _setValue(e: SyntheticEvent<Event>, dragObject): void {
        const box = DimensionsMeasurer.getBoundingClientRect(this._children.area);
        const windowDimensions = DimensionsMeasurer.getWindowDimensions(e.target as HTMLElement);

        const target = this._options.direction === 'vertical' ? dragObject.position.y : dragObject.position.x;
        const ratio = this._getRatio(
            this._options.direction,
            target,
            box,
            windowDimensions.pageXOffset,
            windowDimensions.pageYOffset,
            this._localeDir
        );
        this._value = Utils.calcValue(
            this._options.minValue,
            this._options.maxValue,
            ratio,
            this._options.precision
        );
    }

    _getValue({ nativeEvent }: SyntheticEvent<MouseEvent | TouchEvent>): number {
        const target =
            this._options.direction === 'vertical'
                ? Utils.getNativeEventPageY(nativeEvent)
                : Utils.getNativeEventPageX(nativeEvent);
        const box = DimensionsMeasurer.getBoundingClientRect(this._children.area);
        const windowDimensions = DimensionsMeasurer.getWindowDimensions(this._children.area);
        const ratio = this._getRatio(
            this._options.direction,
            target,
            box,
            windowDimensions.pageXOffset,
            windowDimensions.pageYOffset,
            this._localeDir
        );
        return Utils.calcValue(
            this._options.minValue,
            this._options.maxValue,
            ratio,
            this._options.precision
        );
    }

    _getRatio(
        direction: string,
        target: number,
        box: ClientRect,
        xOffset: number,
        yOffset: number,
        localeDir
    ): number {
        return direction === 'vertical'
            ? maxRatioValue - Utils.getRatio(target, box.top + yOffset, undefined, box.height)
            : Utils.getRatio(
                  target,
                  box.left + xOffset,
                  box.right + xOffset,
                  box.width,
                  localeDir === 'rtl'
              );
    }

    _getViewMode(viewMode: string): string {
        return viewMode === 'default' ? '' : '_' + viewMode;
    }

    _mouseMoveAndTouchMoveHandler(event: SyntheticEvent<MouseEvent>): void {
        if (!this._options.readOnly) {
            // На мобильных устройствах положение подсказки и ползунка всегда совпадает
            this._tooltipPosition = constants.browser.isMobilePlatform
                ? this._value
                : this._getValue(event);
            this._tooltipValue = this._options.tooltipFormatter
                ? this._options.tooltipFormatter(this._tooltipPosition)
                : this._tooltipPosition;

            // На мобилках события ухода мыши не стреляют (если не ткнуть пальцем в какую-то область)
            // В этом случае, по стандарту, скрываю тултип через 3 секунды.
            if (constants.browser.isMobilePlatform) {
                if (this._hideTooltipTimerId) {
                    clearTimeout(this._hideTooltipTimerId);
                }
                this._hideTooltipTimerId = setTimeout(() => {
                    this._hideTooltipTimerId = null;
                    this._mouseLeaveAndTouchEndHandler();
                }, MOBILE_TOOLTIP_HIDE_DELAY);
            }
        }
    }

    _mouseLeaveAndTouchEndHandler(event?: SyntheticEvent<MouseEvent>): void {
        if (!this._options.readOnly) {
            this._tooltipValue = null;
            this._tooltipPosition = null;
        }
    }

    protected _renderTooltip(minValue: number, maxValue: number, value: number): void {
        const rangeLength = maxValue - minValue;
        const tooltipPoint = this._pointData.find((point) => point.name === 'tooltip');
        tooltipPoint.position =
            (Math.min(Math.max(value - minValue, 0), rangeLength) / rangeLength) * maxPercentValue;
    }

    protected _getTooltipPosition(): string {
        if (this._options.direction === 'horizontal') {
            const tooltipPoint = this._pointData.find((point) => point.name === 'tooltip');
            return Utils.getTooltipPosition(
                this._tooltipValue,
                tooltipPoint.position,
                this._container.offsetWidth,
                this._localeDir
            );
        }
    }

    protected _getClosestPoint(value: number, pointData: IPointDataList): IPointData {
        let minDistance: number;
        let closestPoint: IPointData;

        pointData.forEach((point) => {
            if (point.name === 'tooltip') {
                return;
            }

            const pointDistance = Math.abs(value - point.position);
            if (minDistance === pointDistance) {
                closestPoint = value < closestPoint.position ? closestPoint : point;
            }
            if (minDistance === undefined || pointDistance < minDistance) {
                minDistance = pointDistance;
                closestPoint = point;
            }
        });

        return closestPoint;
    }

    protected _mouseDownAndTouchStartHandler(event: SyntheticEvent<MouseEvent | TouchEvent>): void {
        if (!this._options.readOnly) {
            this._value = this._getValue(event);
            const point: IPointData = this._getClosestPoint(this._value, this._pointData);
            this._notifyChanges(this._value, point);
            const target = new DragNDropEntity(this._children[point.name || 'point']);
            this._children.dragNDrop.startDragNDrop(target, event);
        }
    }

    protected _onDocumentDragEnd(): void {
        if (!this._options.readOnly && this._isDrag) {
            this._isDrag = false;
            this._isReverse = false;
            this._mouseUpAndTouchStartHandler();
        }
    }

    protected _onDragNDropHandler(e: SyntheticEvent<Event>, dragObject): void {
        if (this._options.readOnly) {
            return;
        }
        this._setValue(e, dragObject);
        const draggedPoint = this._getPointFromDragObject(dragObject);
        const reversePoint = this._getReversePoint(draggedPoint);
        if (dragObject.entity.point !== this._children[reversePoint.name]) {
            dragObject.entity.setPoint(this._children[reversePoint.name]);
        }
        this._notifyChanges(this._value, reversePoint);
    }

    protected _getReversePoint(point: IPointData): IPointData {
        const dragPointIndex = this._pointData.indexOf(point);
        const previousPoint = this._pointData[dragPointIndex - 1];
        const nextPoint = this._pointData[dragPointIndex + 1];
        if (previousPoint && previousPoint.position >= this._value && previousPoint.name !== 'tooltip') {
            this._notifyChanges(previousPoint.position, point);
            return previousPoint;
        }
        if (nextPoint && nextPoint.position <= this._value && nextPoint.name !== 'tooltip') {
            this._notifyChanges(nextPoint.position, point);
            return nextPoint;
        }
        return point;
    }

    protected _getPointFromDragObject(dragObject): IPointData {
        const pointNames = this._pointData.map((point) => point.name);
        let dragPoint: IPointData;
        pointNames.forEach((name) => {
            if (dragObject.entity.point === this._children[name]) {
                dragPoint = this._pointData.find((point) => point.name === name);
            }
        });
        return dragPoint;
    }

    protected _getPointPosition(point: IPointData): string {
        if (point.name === 'tooltip') {
            return `${point.position}%`;
        }
        const rangeLength = this._options.maxValue - this._options.minValue;
        const percents = (maxPercentValue * (point.position - this._options.minValue)) / rangeLength;
        return `${percents}%`;
    }

    protected _onDragStartHandler(e: SyntheticEvent<Event>, dragObject): void {
        this._isDrag = true;
        this._onDragNDropHandler(e, dragObject);
    }

    protected _mouseUpAndTouchStartHandler(): void {
        /* For override */
    }

    protected _needUpdate(oldOptions: ISliderBaseOptions, newOptions: ISliderBaseOptions): boolean {
        /* For override */
        return false;
    }

    protected _checkOptions(options: ISliderBaseOptions): void {
        /* For override */
    }

    protected _notifyChanges(value: number, point: IPointData): void {
        /* For override */
    }

    static defaultProps: Partial<ISliderBaseOptions> = {
        size: 'm',
        viewMode: 'default',
        direction: 'horizontal',
        tooltipPosition: 'top',
        borderVisible: false,
        tooltipVisible: true,
        precision: 0,
        scaleFontSize: 'm',
        tooltipFontSize: 'm',
        markerVisibility: true,
    };

    static getOptionTypes(): object {
        return {
            size: EntityDescriptor(String).oneOf(['s', 'm']),
            direction: EntityDescriptor(String).oneOf(['horizontal', 'vertical']),
            tooltipPosition: EntityDescriptor(String).oneOf(['top', 'bottom', 'center']),
            borderVisible: EntityDescriptor(Boolean),
            tooltipVisible: EntityDescriptor(Boolean),
            minValue: EntityDescriptor(Number).required,
            maxValue: EntityDescriptor(Number).required,
            scaleStep: EntityDescriptor(Number),
            viewMode: EntityDescriptor(String),
            precision: EntityDescriptor(Number),
        };
    }
}

export default SliderBase;
