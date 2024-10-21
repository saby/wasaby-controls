/**
 * @kaizen_zone b91a6565-403a-4633-8f41-67959f54825e
 */
import { default as Base, IBaseInputOptions, IBaseInputState } from 'Controls/_input/Base';
import { ViewModel } from 'Controls/_input/Phone/ViewModel';
import { default as PhoneFlag } from './Phone/phoneFlag';
import { detection } from 'Env/Env';
import { MouseEvent, SyntheticEvent } from 'react';
import { controller } from 'I18n/i18n';
import * as rk from 'i18n!Controls';
import { AREA_PHONE_CODES } from 'Controls/Utils/PhoneUtils';

interface IInputCallback {
    value: string;
    position: number;
    displayValue: string;
}

export interface IPhoneOptions extends IBaseInputOptions {
    onlyMobile?: boolean;
    flagVisible?: boolean;
    flagPosition?: 'start' | 'end';
    value?: string;
    inputCallback?: (params: IInputCallback) => void;
    countryCode?: string;
}

/**
 * Поле ввода телефона.
 * @remark
 * В зависимости от введенных символов формат номера телефона изменяется.
 * Если вы хотите, чтобы поле телефона не меняло формат, используйте {@link Controls/_input/Mask маску}. Например, поле для ввода мобильного телефона или дома.
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/input-elements/input/phone/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_input.less переменные тем оформления}
 * * {@link http://axure.tensor.ru/standarts/v7/%D0%BF%D0%BE%D0%BB%D0%B5_%D0%B2%D0%B2%D0%BE%D0%B4%D0%B0__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_03_.html стандарт}
 *
 * @extends Controls/_input/Base
 *
 * @public
 * @demo Controls-demo/Input/Phone/Base/Index
 *
 */

/*
 * A component for entering a phone number. Depending on the characters you enter, the phone number format changes.
 * This behavior is described in the {@link http://axure.tensor.ru/standarts/v7/%D0%BF%D0%BE%D0%BB%D0%B5_%D0%B2%D0%B2%D0%BE%D0%B4%D0%B0__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_03_.html standard}.
 * @remark
 * If you want the phone field without changing the format, you should use the
 * {@link Controls/_input/Mask mask) control. For example, a field to enter a mobile phone or home.
 *
 * @class Controls/_input/Phone
 * @extends Controls/_input/Base
 *
 * @public
 * @demo Controls-demo/Input/Phone/Base/Index
 *
 * @author Мочалов М.А.
 */
class Phone extends Base<IPhoneOptions, ViewModel> {
    protected _inputMode: string = 'tel';
    protected _controlName: string = 'Phone';

    protected _getDefaultValue() {
        return '';
    }

    getInputMode() {
        return 'tel';
    }

    protected _getCountryPhoneCode(): string {
        let code = this.props.countryCode;
        if (this.props.countryCode === 'auto') {
            code = controller.currentCountry;
        }
        let result = '+7';
        AREA_PHONE_CODES.forEach((item) => {
            if (item.id === code) {
                result = `+${item.code}`;
            }
        });
        return result;
    }

    protected _getPlaceholderValue(): IBaseInputOptions['placeholder'] {
        if (this.props.onlyMobile) {
            // Есть места, где указали подсказку с кодом страны. На всякий случай чистим эти места.
            const placeholder = (this.props.placeholder as string)?.replace?.(/\+\d+ /, '') || rk('Телефон');
            return `${this._getCountryPhoneCode()} ${placeholder}`;
        }
        return super._getPlaceholderValue();
    }

    shouldComponentUpdate(nextProps: IPhoneOptions, nextState: IBaseInputState): boolean {
        const res = super.shouldComponentUpdate(nextProps, nextState);
        if (
            this.props.flagVisible !== nextProps.flagVisible ||
            nextProps.flagPosition !== this.props.flagPosition ||
            nextProps.onlyMobile !== this.props.onlyMobile
        ) {
            const emptyTemplate = {
                scope: {},
                template: undefined,
            };
            if (
                this.props.flagPosition !== nextProps.flagPosition ||
                !nextProps.flagVisible ||
                !nextProps.onlyMobile
            ) {
                if (this.props.flagPosition === 'start') {
                    this._leftFieldWrapper = emptyTemplate;
                } else {
                    this._rightFieldWrapper = emptyTemplate;
                }
            }
            this._initFlagTemplate(nextProps);
        }
        return res;
    }

    protected _getViewModelConstructor() {
        return ViewModel;
    }

    protected _getValue(options: IPhoneOptions): string {
        const correctValue = { ...options };
        if (
            options.onlyMobile &&
            options.hasOwnProperty('value') &&
            options.value &&
            !options.value.includes('+')
        ) {
            correctValue.value = '+' + options.value;
        }
        return super._getValue(correctValue);
    }

    protected _inputHandler(): void {
        if (
            this._viewModel?.displayValue &&
            this._viewModel.displayValue.indexOf(')') === this._viewModel.displayValue.length - 1 &&
            this._viewModel.displayValue.length - 1 === this._viewModel.selection.start
        ) {
            this._viewModel.selection = this._viewModel.displayValue.length + 1;
        }
    }

    protected _focusInHandler(event: SyntheticEvent<HTMLElement, FocusEvent>): void {
        if (!this._getReadOnly() && this.props.onlyMobile && !this._viewModel.value) {
            this._viewModel.defaultValue = this._getCountryPhoneCode();
            const selection = this._viewModel.displayValue.length;
            this._viewModel.moveCarriageToEnd();
            this._getField()?.setSelectionRange?.(selection, selection);
            this._nextLocalVersion();
        }
        if (this.isMoveCarriage()) {
            this._viewModel.moveCarriageToEnd();
        }
        super._focusInHandler.apply(this, [event]);
    }

    protected _focusOutHandler(event: SyntheticEvent<HTMLElement, FocusEvent>): void {
        if (
            !this._getReadOnly() &&
            this.props.onlyMobile &&
            (this._viewModel.value === '+' ||
                (this._viewModel.value === this._getCountryPhoneCode() && !this.props.flagVisible))
        ) {
            this._viewModel.defaultValue = '';
            this._viewModel.value = '';
            if (this.props.value !== this._viewModel.value) {
                this.props.onValueChanged?.(this._viewModel.value, this._viewModel.displayValue);
            }
            this._nextLocalVersion();
        }
        super._focusOutHandler.apply(this, [event]);
    }

    protected _mouseDownHandler(event: SyntheticEvent<HTMLElement, MouseEvent>): void {
        if (
            !this.props.onlyMobile &&
            event?.nativeEvent?.target &&
            this.props.placeholder &&
            !this._viewModel.value &&
            !this._getReadOnly()
        ) {
            const clientRect = (event.nativeEvent.target as HTMLElement).getBoundingClientRect();
            // @ts-ignore
            if (event.nativeEvent.x - 13 > clientRect.x) {
                this._viewModel.value = this._getCountryPhoneCode();
                this.props.onValueChanged?.(this._viewModel.value, this._viewModel.displayValue);
                if (detection.isMobilePlatform) {
                    // На мобильных устройствах есть проблемы с установкой каретки,
                    // а именно выставленное значение перетирается.
                    // Поэтому устанавливаем каретку через setTimeout
                    setTimeout(() => {
                        this._viewModel.moveCarriageToEnd();
                        this._nextLocalVersion();
                    }, 0);
                } else {
                    this._viewModel.moveCarriageToEnd();
                    this._nextLocalVersion();
                }
            }
        }
        super._mouseDownHandler.apply(this, [event]);
    }

    private isMoveCarriage(): boolean {
        const model = this._viewModel;
        const hasSelection = model.selection.start !== model.selection.end;

        /*
         * If the focus is not obtained with a mouse click, the user did not select anything and
         * you do not need to select a value and the mask is not completely filled,
         * then you need to move the cursor to the end.
         */
        return (
            !this._focusByMouseDown &&
            !hasSelection &&
            !model.isFilled() &&
            !this.props.selectOnClick
        );
    }

    private _initFlagTemplate(options: IPhoneOptions): void {
        if (options.flagVisible && options.onlyMobile) {
            const flagSize = ['default', 's', 'm'].includes(options.inlineHeight as string)
                ? 's'
                : 'm';
            const flagTemplate = {
                template: PhoneFlag,
                scope: {
                    onSelectedFlag: (_: SyntheticEvent, areaCode: string) => {
                        this._viewModel.updateAreaCode(areaCode.trim());
                        this.props.onValueChanged?.(
                            this._viewModel.value,
                            this._viewModel.displayValue
                        );
                        this._getField()?.activate();
                        if (this.props.inputCallback) {
                            this.props.inputCallback({
                                value: this._viewModel.value,
                                position: this._viewModel.selection.start,
                                displayValue: this._viewModel.displayValue,
                            });
                        }
                        this._nextLocalVersion();
                    },
                    size: flagSize,
                    direction: options.flagPosition === 'start' ? 'right' : 'left',
                    className: `controls-margin_${
                        options.flagPosition === 'start' ? 'right' : 'left'
                    }-${flagSize === 's' ? '2xs' : 'xs'}`,
                    value: this._viewModel.value,
                },
            };

            if (options.flagPosition === 'start') {
                this._leftFieldWrapper = flagTemplate;
            } else {
                this._rightFieldWrapper = flagTemplate;
            }
        }
    }

    protected _initProperties(options: IPhoneOptions): void {
        super._initProperties(options);
        this._initFlagTemplate(options);
    }

    protected _getViewModelOptions(options: IPhoneOptions): object {
        return {
            onlyMobile: options.onlyMobile,
        };
    }

    static defaultProps = {
        ...Base.defaultProps,
        flagPosition: 'start',
        countryCode: 'RU'
    };
}

/**
 * @name Controls/_input/Phone#onlyMobile
 * @cfg {Boolean} Ограничивает ввод только мобильными номерами телефона
 * @default false
 * @demo Controls-demo/Input/Phone/OnlyMobile/Index
 */

/**
 * @name Controls/_input/Phone#countryCode
 * @cfg {String} Определяет код страны, в короткой записи(2 буквенное в верхнем регистре: RU, EN и тд). При значении auto, код страны определяется автоматически в зависимости от расположения пользователя.
 * @default RU
 * @demo Controls-demo/Input/Phone/CountryCode/Index
 */

/**
 * @name Controls/_input/Phone#flagVisible
 * @cfg {Boolean} Определяет необходимость отображения флага
 * @default false
 * @see Controls/_input/Phone#onlyMobile
 * @demo Controls-demo/Input/Phone/FlagVisible/Index
 */

/**
 * @name Controls/_input/Phone#flagPosition
 * @cfg {String} Определяет расположение флага
 * @variant start
 * @variant end
 * @default start
 * @see Controls/_input/Phone#flagVisible
 * @see Controls/_input/Phone#onlyMobile
 * @demo Controls-demo/Input/Phone/FlagPosition/Index
 */

export default Phone;
