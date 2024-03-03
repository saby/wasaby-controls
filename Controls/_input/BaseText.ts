/**
 * @kaizen_zone 8b1886ea-b987-4659-bc96-c96169eb1599
 */
import { default as Base, IBaseInputOptions } from 'Controls/_input/Base';
import { descriptor } from 'Types/entity';
import ViewModel from 'Controls/_input/Text/ViewModel';
import { Logger } from 'UI/Utils';
import { ITextOptions } from 'Controls/_input/interface/IText';

/**
 * @typedef {String} InputMode
 * @variant none Без виртуальной клавиатуры;
 * @variant text Стандартная раскладка клавиатуры для пользователя, учитывая его локализацию.
 * @variant decimal Дробные значения чисел, содержащие разряд и соответствующий символ-разделитель, который учитывает локализацию пользователя.
 * @variant numeric Числовая раскладка клавиатуры.
 * @variant tel Раскладка для ввода номера телефона, включая числа от 0 до 9, звёздочку ("*"), плюс ("+") и решётку ("#").
 * @variant search Виртуальная клавиатура, оптимизированная для работы с поиском.
 * @variant email Виртуальная клавиатура, оптимизированная для ввода электронной почты, с использованием символа "@" и др.
 * @variant url Виртуальная клавиатура, оптимизированная для ввода ссылок.
 * @public
 */
export type TInputMode =
    | 'none'
    | 'text'
    | 'decimal'
    | 'numeric'
    | 'tel'
    | 'search'
    | 'email'
    | 'url';

export interface IBaseTextInputOptions extends ITextOptions, IBaseInputOptions {
    /**
     * @name Controls/_input/BaseText#inputMode
     * @cfg {InputMode} Определяет тип клавиатуры, который откроется на мобильных устройствах
     */
    inputMode?: TInputMode;
}

/**
 * @extends Controls/input:Base
 * @implements Controls/input:ITextOptions
 * @implements Controls/input:IBaseInputOptions
 * @public
 */
export class BaseText<
    TBaseTextOptions extends IBaseTextInputOptions = IBaseTextInputOptions
> extends Base<TBaseTextOptions> {
    protected _getDefaultValue() {
        return '';
    }

    _punycodeToUnicode: Function;
    protected _controlName: string = 'Text';

    constructor(props: TBaseTextOptions) {
        super(props);
        this._inputMode = props.inputMode;
        if (props.convertPunycode) {
            this._loadConverterPunycode().then(() => {
                BaseText._validateConstraint(props.constraint);
                this.setState({ localVersion: this.state.localVersion + 1 });
            });
        }

        BaseText._validateConstraint(props.constraint);
    }

    shouldComponentUpdate(nextProps: TBaseTextOptions, nextState): boolean {
        const res = super.shouldComponentUpdate(nextProps, nextState);
        if (this.props.constraint !== nextProps.constraint) {
            BaseText._validateConstraint(nextProps.constraint);
        }
        return res;
    }

    protected _getViewModelOptions(options: IBaseTextInputOptions): object {
        return {
            maxLength: options.maxLength,
            constraint: options.constraint,
            punycodeToUnicode: this._punycodeToUnicode,
        };
    }

    protected _getViewModelConstructor(): ViewModel {
        return ViewModel;
    }

    protected _deactivatedHandler(): void {
        if (this.props.trim) {
            const trimmedValue = this._viewModel.displayValue.trim();

            if (trimmedValue !== this._viewModel.displayValue) {
                this._viewModel.displayValue = trimmedValue;
                this._notifyValueChanged();
            }
        }
        super._deactivatedHandler();
    }

    protected _notifyInputCompleted(): void {
        this._deactivatedHandler();
        super._notifyInputCompleted();
    }

    private _loadConverterPunycode(): Promise<void> {
        return new Promise((resolve) => {
            require(['/cdn/Punycode/1.0.0/punycode.js'], () => {
                this._punycodeToUnicode = Punycode.toUnicode;
                resolve();
            }, resolve);
        });
    }

    private static _validateConstraint(constraint: string | RegExp): boolean {
        if (typeof constraint === 'string' && constraint && !/^\[[\s\S]+?\]\*?$/.test(constraint)) {
            Logger.error(
                'Controls/_input/Text',
                'В опцию "constraint" передано не корректное значение. Подробнее тут: https://wi.sbis.ru/docs/js/Controls/_input/Text/options/constraint/'
            );
            return false;
        }

        return true;
    }

    static defaultProps = {
        ...Base.defaultProps,
        inputMode: 'text',
        trim: true,
        convertPunycode: false,
    };

    static getOptionTypes(): object {
        const optionTypes = Base.getOptionTypes();

        optionTypes.maxLength = descriptor(Number, null);
        optionTypes.trim = descriptor(Boolean);
        optionTypes.constraint = descriptor(String, RegExp);

        return optionTypes;
    }
}
