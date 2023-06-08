/**
 * @kaizen_zone f0953b08-a8cc-4567-9a6e-484a988c8a25
 */
import { IControlOptions } from 'UI/Base';
import { Logger } from 'UI/Utils';
import { descriptor as EntityDescriptor } from 'Types/entity';
import { ISlider, ISliderOptions } from './interface/ISlider';
import SliderBase from './_SliderBase';
import { default as Utils, IPositionedInterval } from './Utils';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IInterval } from './interface/IInterval';
import { constants } from 'Env/Env';
import * as intervalTemplate from 'wml!Controls/_slider/BaseIntervalTemplate';
import 'css!Controls/slider';
import { DimensionsMeasurer } from 'Controls/sizeUtils';

export interface ISliderBaseOptions extends IControlOptions, ISliderOptions {
    value: number;
    intervals: IInterval[];
    intervalTemplate: Function;
}

const maxPercentValue = 100;

/**
 * Базовый слайдер с одним подвижным ползунком для выбора значения.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2fSlider%2fBase%2fIndex демо-пример}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_slider.less переменные тем оформления}
 *
 * @public
 * @extends UI/Base:Control
 * @mixes Controls/slider:ISlider
 * @demo Controls-demo/Slider/Base/Base/Index
 */

/*
 * Basic slider with single movable point for choosing value.
 *
 * <a href="/materials/DemoStand/app/Controls-demo%2fSlider%2fBase%2fIndex">Demo-example</a>.
 * @public
 * @extends UI/Base:Control
 * @class Controls/_slider/Base
 * @mixes Controls/slider:ISlider
 * @author Мочалов М.А.
 * @demo Controls-demo/Slider/Base/Base/Index
 */

class Base extends SliderBase<ISliderBaseOptions> implements ISlider {
    private _value: number = undefined;
    protected _intervals: IPositionedInterval[] = [];

    private _render(minValue: number, maxValue: number, value: number): void {
        const rangeLength = maxValue - minValue;
        const lineWidth =
            (Math.min(Math.max(value - minValue, 0), rangeLength) / rangeLength) * maxPercentValue;
        this._pointData[0].position = value;
        this._lineData.width = lineWidth;
    }

    protected _needUpdate(oldOpts: ISliderBaseOptions, newOpts: ISliderBaseOptions): boolean {
        return (
            oldOpts.scaleStep !== newOpts.scaleStep ||
            oldOpts.minValue !== newOpts.minValue ||
            oldOpts.maxValue !== newOpts.maxValue ||
            oldOpts.value !== newOpts.value
        );
    }

    protected _checkOptions(opts: ISliderBaseOptions): void {
        const { minValue, maxValue, value, intervals } = opts;
        Utils.checkOptions(opts);
        if (value < minValue || value > maxValue) {
            Logger.error('Slider: value must be in the range [minValue..maxValue].', this);
        }

        if (intervals?.length) {
            intervals.forEach(({ start, end }) => {
                if (start > end) {
                    Logger.error('Slider: start of the interval must be less than end.');
                }
                if (start < minValue || start > maxValue) {
                    Logger.error(
                        'Slider: start of the interval must be between minValue and maxValue.'
                    );
                }
                if (end < minValue || end > maxValue) {
                    Logger.error(
                        'Slider: end of the interval must be between minValue and maxValue.'
                    );
                }
            });
        }
    }

    protected _notifyChanges(val: number): void {
        this._notify('valueChanged', [val]);
    }

    protected _beforeMount(options: ISliderBaseOptions): void {
        super._beforeMount(options);
        this._checkOptions(options);
        this._intervals = Utils.convertIntervals(
            options.intervals,
            options.minValue,
            options.maxValue
        );
        this._value = options.value === undefined ? options.maxValue : options.value;
        this._pointData = [
            { name: 'point', position: 100 },
            { name: 'tooltip', position: 0 },
        ];
        this._render(options.minValue, options.maxValue, this._value);
    }

    protected _beforeUpdate(options: ISliderBaseOptions): void {
        super._beforeUpdate(options);
        if (this._options.intervals !== options.intervals) {
            this._intervals = Utils.convertIntervals(
                options.intervals,
                options.minValue,
                options.maxValue
            );
        }
        if (this._options.hasOwnProperty('value')) {
            this._value =
                options.value === undefined
                    ? options.maxValue
                    : Math.min(options.maxValue, options.value);
        } else {
            this._value = Math.min(this._value, options.maxValue);
        }
        this._tooltipPosition = constants.browser.isMobilePlatform
            ? this._value
            : this._tooltipPosition;
        this._render(options.minValue, options.maxValue, this._value);
        this._renderTooltip(options.minValue, options.maxValue, this._tooltipPosition);
    }

    protected _mouseUpAndTouchStartHandler(): void {
        if (!this._options.readOnly && !this._isDrag) {
            this._notify('valueChangeCompleted', [this._value]);
        }
    }

    static defaultProps: Partial<ISliderBaseOptions> = {
        ...{
            theme: 'default',
            intervals: [],
            intervalTemplate,
        },
        ...SliderBase.defaultProps,
    };

    static getOptionTypes(): object {
        return {
            ...{
                value: EntityDescriptor(Number),
                intervals: EntityDescriptor(Array),
            },
            ...SliderBase.getOptionTypes(),
        };
    }
}

/**
 * @name Controls/_slider/Base#value
 * @cfg {Number} Устанавливает текущее значение слайдера.
 * @remark Должно находиться в диапазоне [minValue..maxValue]
 * @example
 * Слайдер с ползунком, установленным в положение 40.
 * <pre class="brush:html">
 *   <Controls.slider:Base bind:value="{{_value}}"/>
 * </pre>
 * ts:
 * <pre>
 *    this._value = 40;
 * </pre>
 */

/*
 * @name Controls/_slider/Base#value
 * @cfg {Number} sets the current value of slider
 * @remark Must be in range of [minValue..maxValue]
 * @example
 * Slider with the point placed at position 40;
 * <pre class="brush:html">
 *   <Controls.slider:Base bind:value="{{_value}}"/>
 * </pre>
 * ts:
 * <pre>
 *    this._value = 40;
 * </pre>
 */

/**
 * @name Controls/_slider/Base#intervalTemplate
 * @cfg {String|TemplateFunction} Устанавливает шаблон, отображающий интервалы шкалы выбора значения, а также дает возможность задавать точность точек интервалов.
 * @remark
 * Его рекомендуется использовать в тех случаях, когда используется слайдер с большими выбором значений, и при этом задаются короткие интервалы.
 * В шаблоне можно использовать объект interval, в котором хранятся:
 *
 * * start — определяет начало интервала в процентах.
 * * width — определяет длину интервала в процентах.
 * * color — определяет цвет интервала.
 * @example
 * В данном примере без указания шаблона, интервал не отобразится на слайдере из-за маленьких значений, поэтому указываем минимальную ширину в 5%.
 * <pre class="brush: js">
 * _intervals = [
 *    {
 *       start: 100,
 *       end: 101,
 *       color: 'primary'
 *    }, {
 *       start: 510,
 *       end: 550,
 *       color: 'danger'
 *    }
 * ];
 * _getInterval(interval) {
 *    if(interval.width < 5){
 *       interval.width = 5;
 *    }
 *    return interval;
 * }
 * </pre>
 *
 * <pre class="brush: html">
 * <Controls.slider:Base
 *       maxValue="{{1000}}"
 *       minValue="{{0}}"
 *       bind:value="_value"
 *       intervals="{{_intervals}}">
 *    <ws:intervalTemplate>
 *       <ws:partial template="Controls/slider:IntervalTemplate"
 *                   interval="{{_getInterval(intervalTemplate.interval)}}" scope="{{intervalTemplate}}"/>
 *       </ws:intervalTemplate>
 * </Controls.slider:Base>
 * </pre>
 * @demo Controls-demo/Slider/Base/IntervalTemplate/Index
 */
/**
 * @name Controls/_slider/Base#intervals
 * @cfg {Array<IInterval>>} Интервалы шкалы выбора значения, закрашенные выбранным цветом.
 * @example
 * Слайдер с закрашенным интервалом.
 * <pre class="brush:html">
 *    <Controls.slider:Base minValue="{{0}}" maxValue="{{100}}">
 *       <ws:intervals>
 *          <ws:Array>
 *             <ws:Object
 *                color="primary"
 *                start="{{0}}"
 *                end="{{10}}"/>
 *             <ws:Object
 *                color="danger"
 *                start="{{30}}"
 *                end="{{70}}"/>
 *          </ws:Array>
 *       </ws:intervals>
 *    </Controls.slider:Base>
 * </pre>
 * @demo Controls-demo/Slider/Base/Intervals/Index
 */

/*
 * @name Controls/_slider/Base#intervals
 * @cfg {Array<IInterval>>} Colored intervals of the scale for choose value.
 * @example
 * Colored slider.
 * <pre class="brush:html">
 *   <Controls.slider:Base minValue="{{0}}" maxValue="{{100}}">
 *       <ws:intervals>
 *          <ws:Array>
 *             <ws:Object
 *                color="primary"
 *                start="{{0}}"
 *                end="{{10}}"
 *             </ws:Object>
 *             <ws:Object
 *                color="danger"
 *                start="{{30}}"
 *                end="{{70}}"
 *             </ws:Object>
 *          </ws:Array>
 *       </ws:intervals>
 *    </Controls.slider:Base>
 * </pre>
 * @demo Controls-demo/Slider/Base/Intervals/Index
 */

/**
 * @event valueChanged Происходит при изменении значения слайдера.
 * @name Controls/_slider/Base#valueChanged
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {number} value Новое значение.
 */

/**
 * @event valueChangeCompleted Происходит при завершении изменения значения слайдера.
 * @name Controls/_slider/Base#valueChangeCompleted
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {number} value Новое значение.
 */
export default Base;
