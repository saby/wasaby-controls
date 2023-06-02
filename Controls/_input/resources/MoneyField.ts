/**
 * @kaizen_zone c4f41dc0-617f-4dae-a3e8-78fd94e09ce2
 */
import { TemplateFunction } from 'UI/Base';
import 'css!Controls/input';
import { default as Field, IFieldOptions } from './Field';
import * as template from 'wml!Controls/_input/resources/Field/MoneyField';
import { calculateFractionFontSize } from 'Controls/baseDecorator';

/**
 * Контрол-обертка над полями ввода денег. Используется для реализации контролов с вводом данных денег.
 *
 * @class Controls/_input/resources/MoneyField
 * @extends UI/Base:Control
 *
 * @public
 *
 */
class MoneyField<ModelOptions> extends Field<string, ModelOptions> {
    protected _template: TemplateFunction = template;
    protected _children: {
        money: HTMLElement;
    };
    protected _precision: number;
    protected _displayValue: string;

    constructor(cfg: IFieldOptions<string, ModelOptions>, context?: object) {
        super(cfg, context);
    }

    protected _notifyEvent(name: string): void {
        super._notifyEvent(name);
        if (['valueChanged', 'inputControl'].includes(name)) {
            this._setContent(this._options);
        }
    }

    protected _beforeMount(options: IFieldOptions<string, ModelOptions>): void {
        super._beforeMount(options);
        this._precision = this._model.options.precision;
    }

    protected _afterMount(options: IFieldOptions<string, ModelOptions>) {
        super._afterMount(options);
        if (!options.model.displayValue) {
            this._setContent(options);
        }
    }

    protected _beforeUpdate(
        options: IFieldOptions<string, ModelOptions>
    ): void {
        super._beforeUpdate(options);
        if (
            (options.value && options.value !== this._model.displayValue) ||
            this._precision !== options.model.options.precision ||
            this._displayValue !== this._model.displayValue
        ) {
            this._setContent(options);
            this._precision = options.model.options.precision;
        }
    }

    private _setContent(options: IFieldOptions<string, ModelOptions>): void {
        // contentEditable полностью удаляет всю версту, из-за чего возникают проблемы с корректным отображение.
        // Поэтому сами вставляем нужную верстку когда надо
        // Поправить после перевода полей ввода на реакт
        const split = options.model.displayValue.split('.');
        this._displayValue = options.model.displayValue;
        const fractionSize = calculateFractionFontSize(options.fontSize);
        let fractionColorStyle =
            split[1] === '00' || options.readOnly
                ? 'readonly'
                : options.fontColorStyle;
        if (fractionColorStyle === 'default' &&
            !(options.fontSize === '5xl' || options.fontSize === '6xl' ||
                options.fontSize === '7xl' || options.fontSize === '8xl')) {
            fractionColorStyle = 'label';
        }
        const fractionVisibility = split[1] && this._model.options.precision;
        this._children[options.name].innerHTML =
            (!options.model.displayValue ? '&#65279;' : '') +
            '<span>' +
            `<span class="controls-fontsize-${options.fontSize} controls-text-${
                options.fontColorStyle
            } controls-fontweight-${options.fontWeight || 'default'}">${
                split[0]
            }</span>` +
            `<span class="controls-DecoratorMoney__fraction__colorStyle-${fractionColorStyle} controls-text-${fractionColorStyle} controls-fontsize-${fractionSize}">${
                fractionVisibility ? '.' + split[1] : ''
            }</span></span>`;
        this.setSelectionRange(
            this._model.selection.start,
            this._model.selection.end
        );
    }
}

export default MoneyField;
