/**
 * @kaizen_zone 588eec47-c30b-4013-974a-ed4ff7969134
 */
import { MouseEvent, SyntheticEvent } from 'react';
import { default as Base, IBaseInputOptions, IBaseInputState } from 'Controls/_input/Base';
// @ts-ignore
import * as ViewModel from 'Controls/_input/Mask/ViewModel';
import { descriptor } from 'Types/entity';
import { Logger } from 'UI/Utils';
import 'css!Controls/input';
import { spaceToLongSpace } from 'Controls/_input/Mask/Space';
import { detection } from 'Env/Env';
import { IFormatMaskChars } from 'Controls/interface';

// TODO: https://online.sbis.ru/doc/f654ff87-5fa9-4c80-a16e-fee7f1d89d0f

const regExpQuantifiers: RegExp = /\\({.*?}|.)/;

export interface IMaskOptions extends IBaseInputOptions {
    value?: string;
    mask?: string;
    replacer?: string;
    formatMaskChars?: IFormatMaskChars;
}

/**
 * Поле ввода значения с заданным форматом.
 *
 * @remark
 * Каждый вводимый символ проходит проверку на соответствие формату {@link mask маски}.
 * Контрол поддерживает возможность показа или скрытия формата маски в незаполненном поле ввода, регулируемую с помощью опции {@link replacer}.
 * Если {@link replacer символ замены} определен, то поле ввода вычисляет свою ширину автоматически по контенту. При этом во всех режимах поддерживается возможность установки ширины поля ввода через CSS.
 *
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FExample%2FInput демо-пример}
 * * {@link /doc/platform/developmentapl/interface-development/controls/input-elements/input/mask/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_input.less переменные тем оформления}
 *
 * @extends Controls/_input/Base
 * @ignoreOptions value
 * @ignoreEvents valueChanged
 * @ignoreEvents inputCompleted
 *
 * @mixes Controls/input:IInputMaskValue
 * @implements Controls/interface:IMask
 * @public
 * @demo Controls-demo/Input/Masks/Index
 */

class Mask extends Base<IMaskOptions> {
    protected _viewModel: ViewModel;
    protected _controlName: string = 'Mask';
    protected _getDefaultValue() {
        return '';
    }

    componentDidMount() {
        super.componentDidMount();
        this._viewModel.checkMaskValue('Controls.input:Mask');
        if (detection.isMac) {
            // На Mac есть проблема с кареткой, поэтому сами ставим каретку в нужное место после построения контрола
            const field = this._getField()?._getField?.();
            if (field) {
                field.selectionStart = this._viewModel.selection.start;
                field.selectionEnd = this._viewModel.selection.end;
            }
        }
    }

    shouldComponentUpdate(nextProps: IMaskOptions, nextState: IBaseInputState): boolean {
        const oldValue: string = this._viewModel.value;
        const res = super.shouldComponentUpdate(nextProps, nextState);
        if (
            nextProps.hasOwnProperty('value') &&
            !(nextProps.value === oldValue || nextProps.value === this._viewModel.displayValue) &&
            nextProps.value !== this.props.value
        ) {
            this._viewModel.setCarriageDefaultPosition(0);
        }
        this._autoWidth = !!nextProps.replacer;
        return res;
    }

    protected _getViewModelOptions(options: IMaskOptions): object {
        return {
            value: options.value,
            mask: options.mask,
            replacer: Mask._calcReplacer(options.replacer, options.mask as string),
            formatMaskChars: options.formatMaskChars,
            placeholder: options.placeholder,
        };
    }

    // @ts-ignore
    protected _getViewModelConstructor(): typeof ViewModel {
        return ViewModel;
    }

    protected _initProperties(options: IMaskOptions): void {
        super._initProperties.apply(this, [options]);
        this._autoWidth = !!options.replacer;
    }

    protected _clickHandler(event: SyntheticEvent<HTMLElement, MouseEvent>): void {
        if (this._firstClick) {
            this._viewModel.setCarriageDefaultPosition(
                this._getField()?.getFieldData('selectionStart')
            );
            // We need a more convenient way to control the selection.
            // https://online.sbis.ru/opendoc.html?guid=d4bdb7cc-c324-4b4b-bda5-db6f8a46bc60
            // In the base class, the selection in the field is set asynchronously and after a click,
            // the selection is saved to the model asynchronously. Sometimes the preservation
            // of the selection will erase the previously established selection in the model.
            // To prevent this, immediately apply the selection set in the model to the input field.
            this._updateSelection(this._viewModel.selection);
        }
        super._clickHandler(event);
    }

    private static _validateReplacer(
        replacer: string | undefined,
        mask: string[] | string
    ): boolean {
        let resValidate = true;
        if (Array.isArray(mask)) {
            resValidate = mask.every((curMask) => {
                if (replacer || regExpQuantifiers.test(curMask)) {
                    Logger.error(
                        'Mask',
                        'Маска, заданная массивом, не работает с квантификаторами и опцией replacer.' +
                            ' Больше информации на https://wi.sbis.ru/docs/js/Controls/input/Mask/options/mask/'
                    );
                    return false;
                }
                return true;
            });
        } else if (replacer && regExpQuantifiers.test(mask)) {
            Logger.error(
                'Mask',
                'Used not empty replacer and mask with quantifiers. More on https://wi.sbis.ru/docs/js/Controls/input/Mask/options/replacer/'
            );
            resValidate = false;
        }
        return resValidate;
    }

    private static _calcReplacer(replacer: string | undefined, mask: string[] | string): string {
        const value = (Mask._validateReplacer(replacer, mask) ? replacer : '') as string;

        /*
         * The width of the usual space is less than the width of letters and numbers.
         * Therefore, the width of the field after entering will increase. Increase the width of the space.
         */
        return spaceToLongSpace(value);
    }

    static defaultProps = {
        ...Base.defaultProps,
        replacer: '',
        formatMaskChars: {
            L: '[А-ЯA-ZЁ]',
            l: '[а-яa-zё]',
            d: '[0-9]',
            x: '[А-ЯA-Zа-яa-z0-9ёЁ]',
        },
        autoWidth: false,
        spellCheck: false,
    };

    static getOptionTypes() {
        const optionTypes = Base.getOptionTypes();

        optionTypes.mask = descriptor(String, Array).required();
        return optionTypes;
    }
}

export default Mask;
