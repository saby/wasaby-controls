/**
 * @kaizen_zone c4f41dc0-617f-4dae-a3e8-78fd94e09ce2
 */
import { default as Field, EventName, IFieldOptions } from './Field';
import { calculateFractionFontSize, Money } from 'Controls/baseDecorator';
import 'css!Controls/input';
import { IFontColorStyleOptions, TFontSize, TFontWeight } from 'Controls/interface';

const MONEY_ATTRS = {
    contenteditable: true,
    suppressContentEditableWarning: true,
};

type TPrecision = 0 | 2 | 4;

interface IFieldMoneyOptions<ModelOptions> extends IFieldOptions<string, ModelOptions> {
    fontSize?: TFontSize;
    fontColorStyle?: IFontColorStyleOptions['fontColorStyle'];
    fontWeight?: TFontWeight;
    precision?: TPrecision;
    value?: string | number;
}

interface IModelOptions {
    precision?: TPrecision;
}

/**
 * Контрол-обертка над полями ввода денег. Используется для реализации контролов с вводом данных денег.
 *
 * @extends UI/Base:Control
 *
 * @public
 *
 */
class MoneyField<ModelOptions extends IModelOptions> extends Field<string, ModelOptions> {
    protected _precision: TPrecision | undefined;
    protected _displayValue: string;
    protected _attrs = MONEY_ATTRS;

    constructor(props: IFieldMoneyOptions<ModelOptions>) {
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

    protected _getValue(): string | number {
        return this.props.model.displayValue.replace(/ /g, '');
    }

    shouldComponentUpdate(nextProps: IFieldMoneyOptions<ModelOptions>): boolean {
        const res = super.shouldComponentUpdate(nextProps);
        if (
            (nextProps.value && nextProps.value !== this._model.displayValue) ||
            this._precision !== nextProps.model.options.precision ||
            this._displayValue !== this._model.displayValue ||
            this.props.fontColorStyle !== nextProps.fontColorStyle
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
        const split = props.model.displayValue.split('.');
        this._displayValue = props.model.displayValue;
        const fractionSize = calculateFractionFontSize(props.fontSize as string);
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
        if (this._fieldRef.current) {
            this._fieldRef.current.innerHTML =
                (!props.model.displayValue ? '&#65279;' : '') +
                '<span>' +
                `<span class="controls-fontsize-${props.fontSize} controls-text-${
                    props.fontColorStyle
                } controls-fontweight-${props.fontWeight || 'default'}">${split[0]}</span>` +
                `<span class="controls-fontweight-default controls-DecoratorMoney__fraction__colorStyle-${fractionColorStyle} controls-text-${fractionColorStyle} controls-fontsize-${fractionSize}">${
                    fractionVisibility ? '.' + split[1] : ''
                }</span></span>`;
        }
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
                precision={this._precision}
                {...(this._model.options || {})}
                // @ts-ignore
                fontSize={this.props.fontSize}
                // @ts-ignore
                fontColorStyle={this.props.fontColorStyle}
                // @ts-ignore
                fontWeight={this.props.fontWeight}
                value={this._getValue()}
            />
        );
    }
}

export default MoneyField;
