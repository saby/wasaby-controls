/**
 * @kaizen_zone f0953b08-a8cc-4567-9a6e-484a988c8a25
 */
import { IControlOptions } from 'UI/Base';
import { Logger } from 'UI/Utils';
import { descriptor as EntityDescriptor } from 'Types/entity';
import { ISlider, ISliderOptions } from './interface/ISlider';
import SliderBase from './_SliderBase';
import { default as Utils, IPointData } from './Utils';
import 'css!Controls/slider';

export interface ISliderRangeOptions extends IControlOptions, ISliderOptions {
    startValue: number;
    endValue: number;
}

const maxPercentValue = 100;

/**
 * Слайдер с двумя подвижными ползунками для выбора диапазона.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2fSlider%2fRange%2fIndex демо-пример}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_slider.less переменные тем оформления}
 *
 * @public
 * @extends UI/Base:Control
 * @mixes Controls/slider:ISlider
 * @demo Controls-demo/Slider/Range/Base/Index
 */

/*
 * Slider with two movable points for choosing range.
 *
 * <a href="/materials/DemoStand/app/Controls-demo%2fSlider%2fRange%2fIndex">Demo-example</a>.
 * @public
 * @extends UI/Base:Control
 * @class Controls/_slider/Range
 * @mixes Controls/slider:ISlider
 * @author Мочалов М.А.
 * @demo Controls-demo/Slider/Range/Base/Index
 */

class Range extends SliderBase<ISliderRangeOptions> implements ISlider {
    private _startValue: number = undefined;
    private _endValue: number = undefined;

    private _render(
        minValue: number,
        maxValue: number,
        startValue: number,
        endValue: number
    ): void {
        const rangeLength = maxValue - minValue;
        const left =
            (Math.min(Math.max(startValue - minValue, 0), rangeLength) / rangeLength) *
            maxPercentValue;
        const right =
            (Math.min(Math.max(endValue - minValue, 0), rangeLength) / rangeLength) *
            maxPercentValue;
        const width = right - left;
        this._pointData[1].position = endValue;
        this._pointData[0].position = startValue;
        this._lineData.position = left;
        this._lineData.width = width;
    }

    protected _checkOptions(opts: ISliderRangeOptions): void {
        Utils.checkOptions(opts);
        if (opts.startValue < opts.minValue || opts.startValue > opts.maxValue) {
            Logger.error('Slider', 'startValue must be in the range [minValue..maxValue].', this);
        }
        if (opts.endValue < opts.minValue || opts.endValue > opts.maxValue) {
            Logger.error('Slider', 'endValue must be in the range [minValue..maxValue].', this);
        }
        if (opts.startValue > opts.endValue) {
            Logger.error('Slider', 'startValue must be less than or equal to endValue.', this);
        }
    }

    protected _needUpdate(oldOpts: ISliderRangeOptions, newOpts: ISliderRangeOptions): boolean {
        return (
            oldOpts.scaleStep !== newOpts.scaleStep ||
            oldOpts.minValue !== newOpts.minValue ||
            oldOpts.maxValue !== newOpts.maxValue ||
            oldOpts.startValue !== newOpts.startValue ||
            oldOpts.endValue !== newOpts.endValue
        );
    }

    protected _beforeMount(options: ISliderRangeOptions): void {
        super._beforeMount(options);
        this._checkOptions(options);
        this._endValue =
            options.endValue === undefined
                ? options.maxValue
                : Math.min(options.maxValue, options.endValue);
        this._startValue =
            options.startValue === undefined
                ? options.minValue
                : Math.max(options.minValue, options.startValue);
        this._pointData = [
            { name: 'pointStart', position: 0 },
            { name: 'pointEnd', position: 100 },
            { name: 'tooltip', position: 0 },
        ];
        this._render(options.minValue, options.maxValue, this._startValue, this._endValue);
    }

    protected _beforeUpdate(options: ISliderRangeOptions): void {
        super._beforeUpdate(options);
        if (
            this._options.hasOwnProperty('startValue') &&
            this._options.hasOwnProperty('endValue')
        ) {
            this._endValue =
                options.endValue === undefined
                    ? options.maxValue
                    : Math.min(options.maxValue, options.endValue);
            this._startValue =
                options.startValue === undefined
                    ? options.minValue
                    : Math.max(options.minValue, options.startValue);
        } else {
            this._endValue = Math.min(options.maxValue, this._endValue);
            this._startValue = Math.max(options.minValue, this._startValue);
        }
        this._render(options.minValue, options.maxValue, this._startValue, this._endValue);
        this._renderTooltip(options.minValue, options.maxValue, this._tooltipPosition);
    }

    private _setStartValue(val: number): void {
        if (this._startValue !== val) {
            this._notify('startValueChanged', [val]);
            if (!this._options.hasOwnProperty('startValue')) {
                this._startValue = val;
            }
        }
    }

    private _setEndValue(val: number): void {
        if (this._endValue !== val) {
            this._notify('endValueChanged', [val]);
            if (!this._options.hasOwnProperty('endValue')) {
                this._endValue = val;
            }
        }
    }

    protected _notifyChanges(value: number, point: IPointData): void {
        if (point.name === 'pointStart') {
            this._setStartValue(value);
        }
        if (point.name === 'pointEnd') {
            this._setEndValue(value);
        }
    }

    protected _mouseUpAndTouchStartHandler(): void {
        if (!this._options.readOnly && !this._isDrag) {
            this._notify('startValueChangeCompleted', [this._startValue]);
            this._notify('endValueChangeCompleted', [this._endValue]);
        }
    }

    static defaultProps: Partial<ISliderRangeOptions> = {
        ...{
            theme: 'default',
        },
        ...SliderBase.defaultProps,
    };

    static getOptionTypes(): object {
        return {
            ...{
                startValue: EntityDescriptor(Number),
                endValue: EntityDescriptor(Number),
            },
            ...SliderBase.getOptionTypes(),
        };
    }
}

/**
 * @name Controls/_slider/Range#startValue
 * @cfg {Number} Устанавливает текущее начальное значение слайдера.
 * @remark Должно находиться в диапазоне [minValue..maxValue]
 * @example
 * Слайдер с первым ползунком, установленном в положение 40:
 * <pre class="brush:html">
 * <!-- WML -->
 * <Controls.slider:Base bind:startValue="_startValue"/>
 * </pre>
 * <pre class="brush:js">
 * // TypeScript
 * this._startValue = 40;
 * </pre>
 * @see endValue
 */

/*
 * @name Controls/_slider/Range#startValue
 * @cfg {Number} sets the current start value of slider
 * @remark Must be in range of [minValue..maxValue]
 * @example
 * Slider with the first point placed at position 40;
 * <pre class="brush:html">
 *   <Controls.slider:Base bind:startValue="_startValue"/>
 * </pre>
 * ts:
 * <pre>
 *    this._startValue = 40;
 * </pre>
 * @see endValue
 */

/**
 * @name Controls/_slider/Range#endValue
 * @cfg {Number} Устанавливает текущее конечное значение слайдера.
 * @remark Должно находится в диапазоне [minValue..maxValue]
 * @example
 * Слайдер со вторым ползунком, установленном в положение 40;
 * <pre class="brush:html">
 * <!-- WML -->
 * <Controls.slider:Base bind:endValue="_endValue"/>
 * </pre>
 * <pre class="brush:js">
 * // TypeScript
 * this._endValue = 40;
 * </pre>
 * @see startValue
 */

/*
 * @name Controls/_slider/Range#endValue
 * @cfg {Number} sets the current end value of slider
 * @remark Must be in range of [minValue..maxValue]
 * @example
 * Slider with the second point placed at position 40;
 * <pre class="brush:html">
 *   <Controls.slider:Base bind:endValue="_endValue"/>
 * </pre>
 * ts:
 * <pre>
 *    this._endValue = 40;
 * </pre>
 * @see startValue
 */

/**
 * @event startValueChanged Происходит при изменении начального значения слайдера.
 * @name Controls/_slider/Range#startValueChanged
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Number} startValue Новое значение.
 */

/**
 * @event endValueChanged Происходит при изменении конечного значения слайдера.
 * @name Controls/_slider/Range#endValueChanged
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Number} endValue Новое значение.
 */

/**
 * @event startValueChangeCompleted Происходит при завершении изменения начального значения слайдера.
 * @name Controls/_slider/Range#startValueChangeCompleted
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Number} startValue Новое значение.
 */

/**
 * @event endValueChangeCompleted Происходит при завершении изменения конечного значения слайдера.
 * @name Controls/_slider/Range#endValueChangeCompleted
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Number} endValue Новое значение.
 */

export default Range;
