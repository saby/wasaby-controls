/**
 * @kaizen_zone c4f41dc0-617f-4dae-a3e8-78fd94e09ce2
 */
import { default as Field, EventName, IFieldOptions } from './Field';
import { calculateFractionFontSize, Money } from 'Controls/baseDecorator';
import 'css!Controls/input';

const MONEY_ATTRS = {
    contenteditable: true,
    suppressContentEditableWarning: true,
};

interface IFieldMoneyOptions<ModelOptions> extends IFieldOptions<string, ModelOptions> {
    fontSize?: string;
    fontColorStyle?: string;
    fontWeight?: string;
    precision?: number;
    value?: string | number;
}

/**
 * Контрол-обертка над полями ввода денег. Используется для реализации контролов с вводом данных денег.
 *
 * @extends UI/Base:Control
 *
 * @public
 *
 */
class MoneyField<ModelOptions> extends Field<string, ModelOptions> {
    protected _precision: number;
    protected _displayValue: string;
    protected _attrs = MONEY_ATTRS;

    constructor(props) {
        super(props);
        this._precision = this._model.options.precision;
        this._attrs = { ...this._attrs, ...(props.attrs || {}) };
    }

    protected _notifyEvent(name: EventName): void {
        super._notifyEvent(name);
        if (['valueChanged', 'inputControl'].includes(name)) {
            this._setContent(this.props);
        }
    }

    componentDidMount() {
        super.componentDidMount();
        if (!this.props.model.displayValue) {
            this._setContent(this.props);
        }
    }

    protected _getValue() {
        return this.props.model.displayValue.replace(/ /g, '');
    }

    shouldComponentUpdate(nextProps: IFieldMoneyOptions<ModelOptions>): boolean {
        const res = super.shouldComponentUpdate(nextProps);
        if (
            (nextProps.value && nextProps.value !== this._model.displayValue) ||
            this._precision !== nextProps.model.options.precision ||
            this._displayValue !== this._model.displayValue
        ) {
            this._setContent(nextProps);
            this._precision = nextProps.model.options.precision;
        }
        if (this.props.attrs !== nextProps.attrs) {
            this._attrs = { ...MONEY_ATTRS, ...(nextProps.attrs || {}) };
        }
        return res;
    }

    private _setContent(props: IFieldMoneyOptions<ModelOptions>): void {
        // contentEditable полностью удаляет всю версту, из-за чего возникают проблемы с корректным отображение.
        // Поэтому сами вставляем нужную верстку когда надо
        // Поправить после перевода полей ввода на реакт
        const split = props.model.displayValue.split('.');
        this._displayValue = props.model.displayValue;
        const fractionSize = calculateFractionFontSize(props.fontSize);
        let fractionColorStyle =
            split[1] === '00' || props.readOnly ? 'readonly' : props.fontColorStyle;
        if (
            fractionColorStyle !== 'readonly' &&
            !(
                props.fontSize === '5xl' ||
                props.fontSize === '6xl' ||
                props.fontSize === '7xl' ||
                props.fontSize === '8xl'
            )
        ) {
            fractionColorStyle = 'label';
        }
        const fractionVisibility = split[1] && this._model.options.precision;
        this._fieldRef.current.innerHTML =
            (!props.model.displayValue ? '&#65279;' : '') +
            '<span>' +
            `<span class="controls-fontsize-${props.fontSize} controls-text-${
                props.fontColorStyle
            } controls-fontweight-${props.fontWeight || 'default'}">${split[0]}</span>` +
            `<span class="controls-fontweight-default controls-DecoratorMoney__fraction__colorStyle-${fractionColorStyle} controls-text-${fractionColorStyle} controls-fontsize-${fractionSize}">${
                fractionVisibility ? '.' + split[1] : ''
            }</span></span>`;
        this.setSelectionRange(this._model.selection.start, this._model.selection.end);
    }

    render(): JSX.Element {
        const contentProps = this._getContentProps(
            `controls-Field js-controls-Field controls-Field_money controls-Field_moneyNew${
                this.props.highlightedOnFocus ? ' controls-Field-focused-item' : ''
            }${this.props.className ? ` ${this.props.className}` : ''}`
        );

        return (
            <Money
                attrs={this._attrs}
                {...contentProps}
                {...(this._model.options || {})}
                fontSize={this.props.fontSize}
                fontColorStyle={this.props.fontColorStyle}
                fontWeight={this.props.fontWeight}
                value={this._getValue()}
            />
        );
    }
}

export default MoneyField;
