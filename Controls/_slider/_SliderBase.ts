/**
 * @kaizen_zone f0953b08-a8cc-4567-9a6e-484a988c8a25
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { ISliderOptions } from './interface/ISlider';
import { default as Utils, ILineData, IPointDataList, IScaleData } from './Utils';
import { SyntheticEvent } from 'Vdom/Vdom';
import { descriptor as EntityDescriptor } from 'Types/entity';
import { constants } from 'Env/Env';
import { DimensionsMeasurer } from 'Controls/sizeUtils';
import { controller } from 'I18n/i18n';
import * as SliderTemplate from 'wml!Controls/_slider/sliderTemplate';

export interface ISliderBaseOptions extends IControlOptions, ISliderOptions {}

const MOBILE_TOOLTIP_HIDE_DELAY: number = 3000;
const maxRatioValue = 1;
const maxPercentValue = 100;

abstract class SliderBase<
    TSliderBaseOptions extends ISliderBaseOptions
> extends Control<TSliderBaseOptions> {
    protected _template: TemplateFunction = SliderTemplate;
    private _tooltipPosition: number | null = null;
    private _hideTooltipTimerId: number;
    protected _tooltipValue: string | null = null;
    protected _viewMode: string = '';
    protected _value: number | null = null;
    protected _isDrag: boolean = false;
    protected _pointData: IPointDataList = undefined;
    protected _scaleData: IScaleData[] = undefined;
    protected _lineData: ILineData = undefined;
    protected _isReverse: boolean = false;

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
    }

    protected _beforeUpdate(newOptions: ISliderBaseOptions): void {
        this._viewMode = this._getViewMode(newOptions.viewMode);
    }

    protected _setValue(e: SyntheticEvent<Event>, dragObject): void {
        const box = this._children.area.getBoundingClientRect();
        const windowDimensions = DimensionsMeasurer.getWindowDimensions(
            e.target as HTMLElement
        );
        const ratio = Utils.getRatio(
            dragObject.position.x,
            box.left + windowDimensions.pageXOffset,
            box.right + windowDimensions.pageXOffset,
            box.width,
            this._localeDir === 'rtl'
        );
        this._value = Utils.calcValue(
            this._options.minValue,
            this._options.maxValue,
            ratio,
            this._options.precision
        );
    }

    _getValue({
        nativeEvent,
    }: SyntheticEvent<MouseEvent | TouchEvent>): number {
        const target =
            this._options.direction === 'vertical'
                ? Utils.getNativeEventPageY(nativeEvent)
                : Utils.getNativeEventPageX(nativeEvent);
        const box = this._children.area.getBoundingClientRect();
        const windowDimensions = DimensionsMeasurer.getWindowDimensions(
            this._children.area
        );
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
            ? maxRatioValue -
                  Utils.getRatio(
                      target,
                      box.top + yOffset,
                      undefined,
                      box.height
                  )
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

    protected _renderTooltip(
        minValue: number,
        maxValue: number,
        value: number
    ): void {
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

    protected _getClosestPoint(
        value: number,
        startValue: number,
        endValue: number
    ): string {
        const startPointDistance = Math.abs(value - startValue);
        const endPointDistance = Math.abs(value - endValue);
        if (startPointDistance === endPointDistance) {
            return value < startValue ? 'start' : 'end';
        } else {
            return startPointDistance < endPointDistance ? 'start' : 'end';
        }
    }

    protected _onDocumentDragEnd(): void {
        if (!this._options.readOnly && this._isDrag) {
            this._isDrag = false;
            this._isReverse = false;
            this._mouseUpAndTouchStartHandler();
        }
    }

    protected _setCorrectValue(
        defaultPosition: string,
        reversePosition: string,
        useDefaultValue: boolean
    ): void {
        const setReversePosition =
            this[`_set${reversePosition}Value`].bind(this);
        const setDefaultPosition =
            this[`_set${defaultPosition}Value`].bind(this);
        if (useDefaultValue) {
            if (this._isReverse) {
                setReversePosition(
                    this[`_${defaultPosition.toLowerCase()}Value`]
                );
            }
            this._isReverse = false;
            setDefaultPosition(this._value);
        } else {
            if (!this._isReverse) {
                setDefaultPosition(
                    this[`_${reversePosition.toLowerCase()}Value`]
                );
            }
            this._isReverse = true;
            setReversePosition(this._value);
        }
    }

    protected _onDragStartHandler(e: SyntheticEvent<Event>, dragObject): void {
        this._isDrag = true;
        this._onDragNDropHandler(e, dragObject);
    }

    protected _onDragNDropHandler(e: SyntheticEvent<Event>, dragObject): void {
        /* For override */
    }

    protected _mouseUpAndTouchStartHandler(): void {
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
            direction: EntityDescriptor(String).oneOf([
                'horizontal',
                'vertical',
            ]),
            tooltipPosition: EntityDescriptor(String).oneOf([
                'top',
                'bottom',
                'center',
            ]),
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
