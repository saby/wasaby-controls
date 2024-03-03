/**
 * @kaizen_zone 7dd3138c-f6ab-4bda-9286-9be5b08d2ae4
 */
import * as React from 'react';
import { TemplateFunction } from 'UI/Base';
import { IControlProps } from 'Controls/interface';
import {
    ICaption,
    ICaptionOptions,
    IValidationStatus,
    IValidationStatusOptions,
    TBorderVisibility,
    TValidationStatus,
} from 'Controls/interface';
import { TInternalProps } from 'UICore/Executor';
import 'css!Controls/jumpingLabel';
import { isEqual } from 'Types/object';

type TBaseValidationStatus = 'valid' | 'invalid';
type TValidationFontColorStyle = 'default' | 'accent';

/**
 * @interface Controls/_jumpingLabel/IBaseOptions
 * @public
 */
export interface IBaseOptions extends IControlProps, IValidationStatusOptions, ICaptionOptions {
    content: TemplateFunction;
    /**
     * Определяет оформление в зависимости от контрастности фона.
     */
    contrastBackground: boolean;
    /**
     * Стиль цвета текста контрола провалившего валидацию.
     */
    validationFontColorStyle: TValidationFontColorStyle;
    required?: boolean;
}

interface IReactBaseOptions extends IBaseOptions, TInternalProps {
    value?: string;
}

export interface IStateBase {
    _showFromAbove?: boolean;
    _fontColorStyle?: string;
    _validationStatus?: string;
    _horizontalPadding?: string;
    _borderVisibility?: TBorderVisibility;
}

/**
 * Абстрактный класс для реализации контрола, добавляющего поведение прыгающей метки к своему контенту.
 *
 * @class Controls/_jumpingLabel/Base
 *
 * @implements Controls/interface:IControl
 * @implements Controls/jumpingLabel:IBaseOptions
 * @implements Controls/interface:IValidationStatus
 *
 * @public
 * @demo Controls-demo/JumpingLabel/Base/Index
 *
 */

/**
 * @name Controls/_jumpingLabel/Base#required
 * @cfg {Boolean} В значении true справа от метки отображается символ "*" (поле обязательно к заполнению).
 * @demo Controls-demo/JumpingLabel/Required/Index
 */

abstract class Base<T extends IReactBaseOptions = IReactBaseOptions>
    extends React.Component<T>
    implements IValidationStatus, ICaption
{
    state: IStateBase;

    readonly '[Controls/_interface/ICaption]': boolean = true;
    readonly '[Controls/_interface/IValidationStatus]': boolean = true;

    protected constructor(props: T) {
        super(props);
        this.state = {
            _borderVisibility: Base._detectToBorderVisibility(),
            ...this._setShowFromAbove(this.props),
            ...this._setStateByOptions(this.props),
        };
    }

    shouldComponentUpdate(options?: T, state?: IStateBase): boolean {
        if (this.props !== options || !isEqual(this.state, state)) {
            this.setState(this._setStateByOptions(options));
            if (this.props.value !== options.value) {
                this.setState(this._setShowFromAbove(options));
            }
            return true;
        }
        return false;
    }

    private _setStateByOptions(options: T): object {
        return {
            _horizontalPadding: Base._detectToHorizontalPadding(options.contrastBackground),
            _fontColorStyle: Base._detectToFontColorStyle(
                options.validationStatus,
                options.validationFontColorStyle
            ),
            _validationStatus: Base._detectToValidationStatus(options.validationStatus),
        };
    }

    protected abstract _setShowFromAbove(options: T): object;

    private static _detectToHorizontalPadding(contrastBackground: boolean): string {
        return contrastBackground ? 'xs' : 'null';
    }

    private static _detectToBorderVisibility(): TBorderVisibility {
        return 'partial';
    }

    private static _detectToFontColorStyle(
        validationStatus: TValidationStatus,
        validationFontColorStyle: TValidationFontColorStyle
    ): string {
        if (validationStatus === 'valid') {
            return 'valid';
        } else {
            return `invalid-${validationFontColorStyle}`;
        }
    }

    private static _detectToValidationStatus(
        validationStatus: TValidationStatus
    ): TBaseValidationStatus {
        /**
         * Для полей ввода с оформлением, которое задается через HOC, стандартом не предусмотрено значение invalidAccent(при фокусе меняется background).
         * Этот код при надобности может быть перенесен в поля ввода с проверкой на опцию borderVisibility === 'partial'.
         */
        if (validationStatus === 'valid') {
            return 'valid';
        } else {
            return 'invalid';
        }
    }

    static defaultProps: Partial<IReactBaseOptions> = {
        validationStatus: 'valid',
        required: false,
        validationFontColorStyle: 'default',
    };
}

export default Base;
