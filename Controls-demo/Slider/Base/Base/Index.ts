import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/Slider/Base/Base/Template');
import { SyntheticEvent } from 'Vdom/Vdom';

const BASE_VALUES = {
    MAX: 100,
    MIN: 0,
};

class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _value: number = 30;
    protected _middleValue: number = 30;

    protected _setDataOnSlider(): void {
        this._middleValue = this._value;
    }

    protected _deactivatedHandler(): void {
        this._convertValue();
        this._setDataOnSlider();
    }

    protected _keyDownHandler(event: SyntheticEvent<KeyboardEvent>): void {
        if (event.nativeEvent.keyCode === 13) {
            this._deactivatedHandler();
        }
    }

    protected _convertValue(): void {
        if (this._value <= BASE_VALUES.MIN) {
            this._value = BASE_VALUES.MIN;
        } else if (this._value > BASE_VALUES.MAX) {
            this._value = BASE_VALUES.MAX;
        }
    }

    protected _changeSliderHandler(event: SyntheticEvent, value: number): void {
        this._value = value;
    }
}

export default Base;
