/**
 * @kaizen_zone 3f785aa8-d36c-4b57-946a-a916e51ded4d
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import { descriptor as EntityDescriptor } from 'Types/entity';
import {
    IContrastBackgroundOptions,
    IResetValueOptions,
    ITooltip,
    ITooltipOptions,
    IViewModeOptions,
    ICheckable,
    ICheckableOptions,
    IValidationStatus,
    IValidationStatusOptions
} from 'Controls/interface';
import 'css!Controls/toggle';
import DoubleSwitchTemplate = require('wml!Controls/_toggle/DoubleSwitch/DoubleSwitch');
import textTemplate = require('wml!Controls/_toggle/DoubleSwitch/resources/DoubleSwitchText');
import {constants} from 'Env/Env';

export interface IDoubleSwitchOptions
    extends IControlOptions,
        ICheckableOptions,
        ITooltipOptions,
        IContrastBackgroundOptions,
        IViewModeOptions,
        IResetValueOptions,
        IValidationStatusOptions {
    captions?: string[];
    orientation?: string;
    size?: string;
    offCaption?: TemplateFunction | string;
    onCaption?: TemplateFunction | string;
}

/**
 * Двойной переключатель, который позволяет выбрать один из двух взаимоисключающих вариантов.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2Ftoggle%2FDoubleSwitch%2FIndex демо-пример}
 * * {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_toggle.less переменные тем оформления}
 *
 * @extends UI/Base:Control
 * @implements Controls/toggle:ISwitchButton
 *
 * @public
 *
 * @demo Controls-demo/toggle/DoubleSwitch/Base/Index
 */

/*
 * Switch with two captions and with support two orientation.
 *
 * @class Controls/_toggle/DoubleSwitch
 * @extends UI/Base:Control
 * @implements Controls/interface:ICheckable
 * @implements Controls/interface:ITooltip
 *
 * @public
 * @author Мочалов М.А.
 *
 * @demo Controls-demo/toggle/DoubleSwitch/Base/Index
 *
 */
class DoubleSwitch extends Control<IDoubleSwitchOptions> implements ICheckable, ITooltip, IValidationStatus {
    '[Controls/_interface/ITooltip]': true;
    '[Controls/_interface/ICheckable]': true;
    '[Controls/_interface/IValidationStatus]': true;

    // TODO https://online.sbis.ru/opendoc.html?guid=0e449eff-bd1e-4b59-8a48-5038e45cab22
    protected _template: TemplateFunction = DoubleSwitchTemplate;
    protected _offCaptionTemplate: TemplateFunction;
    protected _onCaptionTemplate: TemplateFunction;
    protected _toggleHoverState: boolean = false;
    protected _highlightedOnFocus: boolean = false;

    private _checkCaptions(options: IDoubleSwitchOptions): void {
        if (typeof options.offCaption === 'undefined' || typeof options.onCaption === 'undefined') {
            throw new Error('You must set offCaption and onCaption.');
        }
    }

    private _toggleSwitchHoverState(e: SyntheticEvent<Event>, toggledState?: boolean): void {
        this._toggleHoverState = !!toggledState;
    }

    protected _clickTextHandler(e: SyntheticEvent<Event>, _nextValue: boolean): void {
        if (this._options.value !== _nextValue && !this._options.readOnly) {
            this._notifyChanged();
            this._toggleSwitchHoverState(e, false);
        }
    }

    protected _getResetValue(): boolean {
        if (this._options.hasOwnProperty('resetValue')) {
            return !this._options.resetValue;
        }
    }

    private _notifyChanged(): void {
        if (!this._options.readOnly) {
            this._notify('valueChanged', [!this._options.value]);
        }
    }

    protected _keyUpHandler(event: SyntheticEvent<KeyboardEvent>): void {
        if (event.nativeEvent.keyCode === constants.key.space && !this._options.readOnly) {
            event.preventDefault();
            this._clickToggleHandler();
        }
    }

    protected _clickToggleHandler(): void {
        this._notifyChanged();
    }

    protected _beforeMount(options: IDoubleSwitchOptions): void {
        this._checkCaptions(options);
        this._setOffCaptionTemplate(options.offCaption);
        this._setOnCaptionTemplate(options.onCaption);
        this._highlightedOnFocus = this.context?.workByKeyboard && !options.readOnly;
    }

    protected _beforeUpdate(newOptions: IDoubleSwitchOptions): void {
        this._checkCaptions(newOptions);
        if (this._options.onCaption !== newOptions.onCaption) {
            this._setOnCaptionTemplate(newOptions.onCaption);
        }
        if (this._options.offCaption !== newOptions.offCaption) {
            this._setOffCaptionTemplate(newOptions.offCaption);
        }
        this._highlightedOnFocus = this.context?.workByKeyboard && !newOptions.readOnly;
    }

    protected _setOffCaptionTemplate(offCaption: TemplateFunction | string): void {
        const stringCaption =
            typeof offCaption === 'string' || offCaption instanceof String || !offCaption;
        this._offCaptionTemplate = stringCaption ? textTemplate : offCaption;
    }

    protected _setOnCaptionTemplate(onCaption: TemplateFunction | string): void {
        const stringCaption =
            typeof onCaption === 'string' || onCaption instanceof String || !onCaption;
        this._onCaptionTemplate = stringCaption ? textTemplate : onCaption;
    }

    static getDefaultOptions(): object {
        return {
            value: false,
            viewMode: 'filled',
            validationStatus: 'valid',
            contrastBackground: true,
            orientation: 'horizontal',
            size: 'm',
        };
    }

    static getOptionTypes(): object {
        return {
            value: EntityDescriptor(Boolean),
            orientation: EntityDescriptor(String).oneOf(['vertical', 'horizontal']),
        };
    }
}

/**
 * @name Controls/_toggle/DoubleSwitch#viewMode
 * @cfg {string}
 * @demo Controls-demo/toggle/DoubleSwitch/ViewMode/Index
 */

/**
 * @name Controls/_toggle/DoubleSwitch#size
 * @cfg {String} Определяет размер переключателя.
 * @variant s
 * @variant m
 * @variant l
 * @default m
 * @demo Controls-demo/toggle/DoubleSwitch/Size/Index
 */

/**
 * @name Controls/_toggle/DoubleSwitch#resetValue
 * @cfg {boolean}
 * @demo Controls-demo/toggle/DoubleSwitch/ResetValue/Index
 */

/**
 * @name Controls/_toggle/DoubleSwitch#tooltip
 * @cfg {String}
 * @demo Controls-demo/toggle/DoubleSwitch/Tooltip/Index
 */

/**
 * @name Controls/_toggle/DoubleSwitch#onCaption
 * @cfg {String | TemplateFunction} Подпись у активного состояния.
 * @remark
 * По умолчанию используется шаблон "Controls/toggle:doubleSwitchCaptionTemplate".
 *
 * Базовый шаблон captionTemplate поддерживает следующие параметры:
 * - additionalCaption {Function|String} — Дополнительный текст заголовка кнопки.
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.toggle:DoubleSwitch>
 *    <ws:onCaption>
 *       <ws:partial template="Controls/toggle:doubleSwitchCaptionTemplate" scope="{{captionTemplate}}" additionalCaption="{{_captionTemplate}}"/>
 *    </ws:onCaption>
 * </Controls.toggle:DoubleSwitch>
 * </pre>
 */

/**
 * @name Controls/_toggle/DoubleSwitch#offCaption
 * @cfg {String | TemplateFunction} Подпись у не активного состояния.
 * @remark
 * По умолчанию используется шаблон "Controls/toggle:doubleSwitchCaptionTemplate".
 *
 * Базовый шаблон captionTemplate поддерживает следующие параметры:
 * - additionalCaption {Function|String} — Дополнительный текст заголовка кнопки.
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.toggle:DoubleSwitch>
 *    <ws:offCaption>
 *       <ws:partial template="Controls/toggle:doubleSwitchCaptionTemplate" scope="{{captionTemplate}}" additionalCaption="{{_captionTemplate}}"/>
 *    </ws:offCaption>
 * </Controls.toggle:DoubleSwitch>
 * </pre>
 */

/*
 * @name Controls/_toggle/DoubleSwitch#captions
 * @cfg {Array.<String>} Array of two captions. If caption number is not equal to two, then an error occurs.
 */

/**
 * @name Controls/_toggle/DoubleSwitch#orientation
 * @cfg {String} Ориентация двойного переключателя в пространстве.
 * @demo Controls-demo/toggle/DoubleSwitch/Orientation/Index
 * @variant horizontal Горизонтальная ориентация. Значение по умолчанию.
 * @variant vertical Вертикальная ориентация.
 */

/*
 * @name Controls/_toggle/DoubleSwitch#orientation
 * @cfg {String} Double switch orientation in space.
 * @variant horizontal Horizontal orientation. It is default value.
 * @variant vertical Vertical orientation.
 */

export default DoubleSwitch;
