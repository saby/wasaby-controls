/**
 * @kaizen_zone 3f785aa8-d36c-4b57-946a-a916e51ded4d
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { descriptor as EntityDescriptor } from 'Types/entity';
import {
    IContrastBackgroundOptions,
    IResetValueOptions,
    ITooltip,
    ITooltipOptions,
    IValidationStatus,
    IValidationStatusOptions,
    IViewModeOptions,
    ICheckable,
    ICheckableOptions,
} from 'Controls/interface';
import 'css!Controls/toggle';
import 'css!Controls/CommonClasses';
import * as CaptionTemplate from 'wml!Controls/_toggle/Switch/resources/CaptionTemplate';
import { SyntheticEvent } from 'Vdom/Vdom';
import { constants } from 'Env/Env';
import SwitchTemplate = require('wml!Controls/_toggle/Switch/Switch');

export interface ISwitchOptions
    extends IControlOptions,
        ICheckableOptions,
        ITooltipOptions,
        IValidationStatusOptions,
        IContrastBackgroundOptions,
        IViewModeOptions,
        IResetValueOptions {
    caption: string | TemplateFunction;
    captionPosition: string;
    captionTemplate?: TemplateFunction;
    size?: string;
    multiline?: boolean;
}

/**
 * Кнопка-переключатель с одним заголовком. Часто используется для настроек "вкл-выкл".
 *
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2ftoggle%2fSwitch%2fIndex демо-пример}
 * * {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_toggle.less переменные тем оформления}
 *
 * @extends UI/Base:Control
 * @implements Controls/toggle:ISwitchButton
 *
 * @public
 * @demo Controls-demo/toggle/Switch/Value/Index
 * @demo Controls-demo/toggle/Switch/Caption/Index
 */

/*
 * Switch button with single caption. Frequently used for 'on-off' settings.
 *
 * <a href="/materials/DemoStand/app/Controls-demo%2ftoggle%2fSwitch%2fIndex">Demo-example</a>.
 *
 * @class Controls/_toggle/Switch
 * @extends UI/Base:Control
 * @implements Controls/interface:ICheckable
 * @implements Controls/interface:ITooltip
 *
 * @public
 * @author Мочалов М.А.
 * @demo Controls-demo/toggle/Switch/Value/Index
 * @demo Controls-demo/toggle/Switch/Caption/Index
 */

class Switch extends Control<ISwitchOptions> implements ITooltip, ICheckable, IValidationStatus {
    '[Controls/_interface/ITooltip]': true;
    '[Controls/_interface/ICheckable]': true;
    '[Controls/_interface/IValidationStatus]': true;
    protected _template: TemplateFunction = SwitchTemplate;
    protected _captionTemplate: TemplateFunction;
    protected _value: boolean;
    protected _highlightedOnFocus: boolean;

    protected _beforeMount(options: ISwitchOptions): void {
        this._setCaptionTemplate(options);
        this._value = !!options.value;
        this._highlightedOnFocus = this.context?.workByKeyboard && !options.readOnly;
    }

    protected _beforeUpdate(newOptions: ISwitchOptions): void {
        if (this._options.caption !== newOptions.caption) {
            this._setCaptionTemplate(newOptions);
        }
        if (this._options.value !== newOptions.value) {
            this._value = !!newOptions.value;
        }
        this._highlightedOnFocus = this.context?.workByKeyboard && !newOptions.readOnly;
    }

    protected _setCaptionTemplate(options: ISwitchOptions): void {
        if (options.captionTemplate) {
            this._captionTemplate = options.captionTemplate;
        } else {
            const stringCaption =
                typeof options.caption === 'string' ||
                options.caption instanceof String ||
                !options.caption;
            this._captionTemplate = stringCaption ? CaptionTemplate : options.caption;
        }
    }

    protected _keyUpHandler(e: SyntheticEvent<KeyboardEvent>): void {
        if (e.nativeEvent.keyCode === constants.key.space && !this._options.readOnly) {
            e.preventDefault();
            this._clickHandler();
        }
    }

    protected _clickHandler(): void {
        if (!this._options.readOnly) {
            const value = !this._value;
            this._notify('valueChanged', [value]);
            if (typeof this._options.value === 'undefined') {
                this._value = value;
            }
        }
    }

    static getDefaultOptions(): object {
        return {
            captionPosition: 'end',
            validationStatus: 'valid',
            viewMode: 'filled',
            contrastBackground: true,
            size: 'm',
        };
    }

    static getOptionTypes(): object {
        return {
            value: EntityDescriptor(Boolean),
            captionPosition: EntityDescriptor(String).oneOf(['start', 'end']),
        };
    }
}

/**
 * @name Controls/_toggle/Switch#multiline
 * @cfg {boolean} Поведение текста, если он не умещается.
 * @variant false Текст обрезается многоточием.
 * @variant true Текст разбивается на несколько строк.
 * @default false
 * @demo Controls-demo/toggle/Switch/Multiline/Index
 */
/**
 * @name Controls/_toggle/Switch#size
 * @cfg {String} Определяет размер переключателя.
 * @variant s
 * @variant m
 * @variant l
 * @default m
 * @demo Controls-demo/toggle/Switch/Size/Index
 */

/**
 * @name Controls/_toggle/Switch#resetValue
 * @cfg {boolean} Предустановленное значение
 * @demo Controls-demo/toggle/Switch/ResetValue/Index
 */

/**
 * @name Controls/_toggle/Switch#viewMode
 * @cfg {string} Определяет заливку фона контрола по отношению к его окружению.
 * @default filled
 * @variant filled Фон с заливкой.
 * @variant outlined Без заливки.
 * @demo Controls-demo/toggle/Switch/ViewMode/Index
 */

/**
 * @name Controls/_toggle/Switch#caption
 * @cfg {String|TemplateFunction} Текст заголовка кнопки.
 * @remark
 * По умолчанию используется шаблон "Controls/toggle:switchCaptionTemplate".
 *
 * Базовый шаблон captionTemplate поддерживает следующие параметры:
 * - additionalCaption {Function|String} — Дополнительный текст заголовка кнопки.
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.toggle:Switch>
 *    <ws:caption>
 *       <ws:partial template="Controls/toggle:switchCaptionTemplate" scope="{{captionTemplate}}" additionalCaption="{{_captionTemplate}}"/>
 *    </ws:caption>
 * </Controls.toggle:Switch>
 * </pre>
 * @demo Controls-demo/toggle/Switch/CaptionTemplate/Index
 */

/*
 * @name Controls/_toggle/Switch#caption
 * @cfg {String} Caption text.
 */

/**
 * @name Controls/_toggle/Switch#captionPosition
 * @cfg {String} Определяет, с какой стороны расположен заголовок кнопки.
 * @variant start Заголовок расположен перед кнопкой.
 * @variant end Заголовок расположен после кнопки.
 * @default end
 * @demo Controls-demo/toggle/Switch/CaptionPosition/Index
 */

/*
 * @name Controls/_toggle/Switch#captionPosition
 * @cfg {String} Determines on which side of the button caption is located.
 * @variant left Caption before toggle.
 * @variant right Toggle before caption.
 * @default right
 */

export default Switch;
