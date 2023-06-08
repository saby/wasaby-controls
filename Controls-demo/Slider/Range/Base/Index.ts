import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/Slider/Range/Base/Template');
import { SyntheticEvent } from 'Vdom/Vdom';

type TInput = 'start' | 'end';
const BASE_VALUES = {
    MAX: 100,
    MIN: 0,
};

class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _startValue: number = 40;
    protected _endValue: number = 60;
    protected _startMiddleValue: number = 40;
    protected _endMiddleValue: number = 60;
    protected _startValue1: number = 10;
    protected _endValue1: number = 90;

    protected _setDataOnSlider(): void {
        this._startMiddleValue = this._startValue;
        this._endMiddleValue = this._endValue;
    }

    protected _convertStartValue(): void {
        if (this._startValue >= this._endValue) {
            if (this._startValue >= BASE_VALUES.MAX) {
                this._startValue = BASE_VALUES.MAX;
                this._endValue = BASE_VALUES.MAX;
            } else {
                this._endValue = this._startValue;
            }
        } else if (this._startValue <= BASE_VALUES.MIN) {
            this._startValue = BASE_VALUES.MIN;
        }
    }

    protected _convertEndValue(): void {
        if (this._endValue <= this._startValue) {
            if (this._endValue <= BASE_VALUES.MIN) {
                this._startValue = BASE_VALUES.MIN;
                this._endValue = BASE_VALUES.MIN;
            } else {
                this._startValue = this._endValue;
            }
        } else if (this._endValue >= BASE_VALUES.MAX) {
            this._endValue = BASE_VALUES.MAX;
        }
    }

    protected _deactivatedHandler(event: SyntheticEvent, type: TInput): void {
        if (type === 'start') {
            this._convertStartValue();
        } else if (type === 'end') {
            this._convertEndValue();
        }
        this._setDataOnSlider();
    }

    protected _keyDownHandler(
        event: SyntheticEvent<KeyboardEvent>,
        type: TInput
    ): void {
        if (event.nativeEvent.keyCode === 13) {
            this._deactivatedHandler(event, type);
        }
    }

    protected _changeStartSliderHandler(
        event: SyntheticEvent,
        value: number
    ): void {
        this._startValue = value;
    }

    protected _changeEndSliderHandler(
        event: SyntheticEvent,
        value: number
    ): void {
        this._endValue = value;
    }
}

export default Base;
