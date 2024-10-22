/**
 * @kaizen_zone 435be96a-5e21-41dc-84ce-32e4e1b3e61b
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import checkBoxTemplate = require('wml!Controls/_checkbox/Checkbox/Checkbox');
import { descriptor as EntityDescriptor } from 'Types/entity';
import {
    ITooltip,
    ITooltipOptions,
    ICaption,
    ICaptionOptions,
    IFontColorStyle,
    IFontColorStyleOptions,
    IIcon,
    IIconOptions,
    IIconSize,
    IIconSizeOptions,
    IIconStyle,
    IIconStyleOptions,
    IValidationStatus,
    IValidationStatusOptions,
    IResetValueOptions,
    IContrastBackgroundOptions,
} from 'Controls/interface';
import { ICheckboxMarkerOptions } from 'Controls/_checkbox/Checkbox/resources/CheckboxMarker';
import { SyntheticEvent } from 'Vdom/Vdom';
import { constants } from 'Env/Env';
import 'css!Controls/checkbox';
import 'css!Controls/CommonClasses';

export interface ICheckboxOptions
    extends IControlOptions,
        ICaptionOptions,
        IIconOptions,
        ITooltipOptions,
        IIconSizeOptions,
        IIconStyleOptions,
        IValidationStatusOptions,
        IResetValueOptions,
        IFontColorStyleOptions,
        ICheckboxMarkerOptions,
        IContrastBackgroundOptions {
    multiline?: boolean;
    captionPosition?: 'start' | 'end';
}

const mapTriState = {false: true, true: null, null: false};
const mapBoolState = {true: false, false: true, null: true};

/**
 * Контрол, позволяющий пользователю управлять параметром с тремя состояниями — включено, отключено и неопределенно. Третье состояние включается с использованием опции triState
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2Ftoggle%2FCheckbox%2FIndex демо-пример}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_toggle.less переменные тем оформления}
 *
 *
 * @extends UI/Base:Control
 * @implements Controls/checkbox:ICheckboxMarker
 * @implements Controls/interface:ICaption
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:ITooltip
 * @implements Controls/interface:IValidationStatus
 * @implements Controls/interface:IResetValue
 *
 * @public
 * @demo Controls-demo/toggle/Checkbox/Value/Index
 * @demo Controls-demo/toggle/Checkbox/Caption/Index
 */

/*
 * Represents a control that a user can select and clear.
 *
 * <a href="/materials/DemoStand/app/Controls-demo%2Ftoggle%2FCheckbox%2FIndex">Demo-example</a>.
 *
 * @class Controls/_checkbox/Checkbox
 * @extends UI/Base:Control
 * @implements Controls/interface:ICaption
 * @implements Controls/interface:IIcon
 * @implements Controls/interface:ITooltip
 * @implements Controls/interface:IIconStyle
 * @implements Controls/interface:IIconSize
 *
 * @public
 * @author Мочалов М.А.
 * @demo Controls-demo/toggle/Checkbox/Value/Index
 * @demo Controls-demo/toggle/Checkbox/Caption/Index
 */
class Checkbox
    extends Control<ICheckboxOptions>
    implements ICaption, IFontColorStyle, IIcon, ITooltip, IIconSize, IIconStyle, IValidationStatus {
    '[Controls/_interface/IFontColorStyle]': boolean = true;
    '[Controls/_interface/ITooltip]': boolean = true;
    '[Controls/_interface/ICaption]': boolean = true;
    '[Controls/_interface/IIcon]': boolean = true;
    '[Controls/_interface/IIconSize]': boolean = true;
    '[Controls/_interface/IIconStyle]': boolean = true;
    '[Controls/_interface/IValidationStatus]': boolean = true;

    // TODO https://online.sbis.ru/opendoc.html?guid=0e449eff-bd1e-4b59-8a48-5038e45cab22
    protected _template: TemplateFunction = checkBoxTemplate;
    protected _value: boolean;
    protected _highlightedOnFocus: boolean;

    protected _beforeMount(options: ICheckboxOptions): void {
        this._value = typeof options.value !== 'undefined' ? options.value : false;
        this._highlightedOnFocus = this.context?.workByKeyboard && !options.readOnly;
    }

    protected _beforeUpdate(newOptions: ICheckboxOptions): void {
        if (this._options.value !== newOptions.value) {
            this._value = typeof newOptions.value !== 'undefined' ? newOptions.value : false;
        }
        this._highlightedOnFocus = this.context?.workByKeyboard && !newOptions.readOnly;
    }

    private _notifyChangeValue(value: boolean | null): void {
        this._notify('valueChanged', [value]);
    }

    protected _clickHandler(): void {
        if (!this._options.readOnly) {
            const map = this._options.triState ? mapTriState : mapBoolState;
            const value = map[this._value + ''];
            this._notifyChangeValue(value);
            if (typeof this._options.value === 'undefined') {
                this._value = value;
            }
        }
    }

    protected _keyUpHandler(e: SyntheticEvent<KeyboardEvent>): void {
        if (e.nativeEvent.keyCode === constants.key.space && !this._options.readOnly) {
            e.preventDefault();
            this._clickHandler();
        }
    }

    static getDefaultOptions(): object {
        return {
            triState: false,
            iconSize: 'default',
            iconStyle: 'secondary',
            validationStatus: 'valid',
            viewMode: 'ghost',
            contrastBackground: false,
            multiline: true,
            size: 's',
            captionPosition: 'end',
        };
    }

    static getOptionTypes(): object {
        return {
            triState: EntityDescriptor(Boolean),
            value: EntityDescriptor(Boolean, null),
            tooltip: EntityDescriptor(String),
            captionPosition: EntityDescriptor(String).oneOf(['start', 'end']),
        };
    }
}

/**
 * Определяет, разрешено ли устанавливать чекбоксу третье состояние — "не определен" (null).
 * @name Controls/_checkbox/Checkbox#triState
 * @cfg {Boolean}
 * @default False
 * @remark
 * True - Разрешено устанавливать третье состояние.
 * False - Не разрешено устанавливать третье состояние.
 * Если установлен режим triState, то значение может быть "null".
 * @demo Controls-demo/toggle/Checkbox/Tristate/Index
 * @example
 * Чекбокс с включенным triState.
 * <pre>
 *    Boolean variable value: <Controls.checkbox:Checkbox on:valueChanged="_updateCheckBox()" triState="{{true}}" value="{{_checkBoxValue}}"/>
 * </pre>
 * <pre>
 *    class MyControl extends Control<IControlOptions> {
 *       ...
 *       _updateCheckBox(event, value) {
 *          _checkBoxValue = value;
 *       }
 *       ...
 *    }
 * </pre>
 * @see value
 */

/*
 * Determines whether the Checkbox will allow three check status rather than two.
 * @name Controls/_checkbox/Checkbox#triState
 * @cfg {Boolean}
 * @default False
 * @remark
 * True - Enable triState.
 * False - Disable triState.
 * If the triState mode is set, then the value can be null.
 * @demo Controls-demo/toggle/Checkbox/Tristate/Index
 * @example
 * Checkbox with enabled triState.
 * <pre>
 *    Boolean variable value: <Controls.checkbox:Checkbox on:valueChanged="_updateCheckBox()" triState="{{true}}" value="{{_checkBoxValue}}"/>
 * </pre>
 * <pre>
 *    class MyControl extends Control<IControlOptions> {
 *       ...
 *       _updateCheckBox(event, value) {
 *          _checkBoxValue = value;
 *       }
 *       ...
 *    }
 * </pre>
 * @see option Value
 */

/**
 * Значение, которое определяет текущее состояние.
 * @name Controls/_checkbox/Checkbox#value
 * @cfg {Boolean|null}
 * @default undefined
 * @remark
 * True - Чекбокс в состоянии "отмечено".
 * False - Чекбокс в состоянии "не отмечено". Это состояние по умолчанию.
 * Null - Состояние чекбокса при включенной опции triState.
 * Вариант "null" возможен только при включенной опции triState.
 * @example
 * Чекбокс, регулирующий тему в контроле.
 * <pre>
 *    <Controls.checkbox:Checkbox caption="Enable dark theme" value="{{_checkBoxValue}}" on:valueChanged="_darkThemeSwitched()"/>
 * </pre>
 * <pre>
 *   class MyControl extends Control<IControlOptions> {
 *       ...
 *       _darkThemeSwitched(e, value) {
 *          _checkBoxValue = value;
 *          this._notify('themeChanged', [_checkBoxValue]);
 *       }
 *       ...
 *    }
 * </pre>
 * Чекбокс с включенной опцией triState.
 * <pre>
 *    Boolean variable value: <Controls.checkbox:Checkbox on:valueChanged="_updateCheckBox()" triState="{{true}}" value="{{_checkBoxValue}}"/>
 * </pre>
 * <pre>
 *    class MyControl extends Control<IControlOptions> {
 *       ...
 *       _updateCheckBox(event, value) {
 *          _checkBoxValue = value;
 *       }
 *       ...
 *    }
 * </pre>
 * @see triState
 * @see event valueChanged()
 */

/*
 * Current value, it's determines current state.
 * @name Controls/_checkbox/Checkbox#value
 * @cfg {Boolean|null}
 * @default False
 * @remark
 * True - Selected checkbox state.
 * False - Unselected checkbox state. It is default state.
 * Null - TriState checkbox state.
 * Variant null of value this option is possible only when the triState option is enabled.
 * @example
 * Checkbox regulate theme in control.
 * <pre>
 *    <Controls.checkbox:Checkbox caption="Enable dark theme" value="{{_checkBoxValue}}" on:valueChanged="_darkThemeSwitched()"/>
 * </pre>
 * <pre>
 *    class MyControl extends Control<IControlOptions> {
 *       ...
 *       _darkThemeSwitched(e, value) {
 *          _checkBoxValue = value;
 *          this._notify('themeChanged', [_checkBoxValue]);
 *       }
 *       ...
 *    }
 * </pre>
 * Checkbox value when triState option is true.
 * <pre>
 *    Boolean variable value: <Controls.checkbox:Checkbox on:valueChanged="_updateCheckBox()" triState="{{true}}" value="{{_checkBoxValue}}"/>
 * </pre>
 * <pre>
 *    class MyControl extends Control<IControlOptions> {
 *       ...
 *       _updateCheckBox(event, value) {
 *          _checkBoxValue = value;
 *       }
 *       ...
 *    }
 * </pre>
 * @see option triState
 * @see event valueChanged()
 */

/**
 * @event valueChanged Происходит при изменении состояния контрола.
 * @name Controls/_checkbox/Checkbox#valueChanged
 * @param {UI/Events:SyntheticEvent} event Дескриптор события.
 * @param {Boolean|null} New value.
 * @remark Событие необходимо для реагирования на изменения, внесенные пользователем в чекбокс. Значение, возвращаемое в событии, не вставляется в контрол, если не передать его обратно в поле в качестве опции. Значение может быть null только тогда, когда включена опция tristate.
 * @example
 * Пример:
 * <pre>
 *    <Controls.checkbox:Checkbox value="{{_checkBoxValue}}" on:valueChanged="_valueChangedHandler()" />
 * </pre>
 * <pre>
 *   class MyControl extends Control<IControlOptions> {
 *       ...
 *       _valueChangedHandler(e, value) {
 *          this._checkBoxValue= value;
 *       }
 *       ...
 *    }
 * </pre>
 * @see value
 * @see triState
 */

/*
 * @event Occurs when state changes.
 * @name Controls/checkbox/Checkbox#valueChanged
 * @param {Boolean|null} New value.
 * @remark This event should be used to react to changes user makes in the checkbox. Value returned in the event is not inserted in control unless you pass it back to the field as an option. Value may be null only when checkbox tristate option is true.
 * @example
 * Example description.
 * <pre>
 *    <Controls.checkbox:Checkbox value="{{_checkBoxValue}}" on:valueChanged="_valueChangedHandler()" />
 * </pre>
 * <pre>
 *    class MyControl extends Control<IControlOptions> {
 *       ...
 *       _valueChangedHandler(e, value) {
 *          this._checkBoxValue= value;
 *       }
 *       ...
 *    }
 * </pre>
 * @see value
 * @see triState
 */
/**
 * @name Controls/_checkbox/Checkbox#multiline
 * @cfg {boolean} Поведение текста, если он не умещается.
 * @variant false Текст обрезается многоточием.
 * @variant true Текст разбивается на несколько строк.
 * @default true
 * @demo Controls-demo/toggle/Checkbox/Multiline/Index
 */
/**
 * @name Controls/_checkbox/Checkbox#icon
 * @cfg {String}
 * @demo Controls-demo/toggle/Checkbox/Icon/Index
 */
/**
 * @name Controls/_checkbox/Checkbox#iconSize
 * @cfg {String}
 * @demo Controls-demo/toggle/Checkbox/Icon/Index
 */
/**
 * @name Controls/_checkbox/Checkbox#iconStyle
 * @cfg {String}
 * @demo Controls-demo/toggle/Checkbox/Icon/Index
 */
/**
 * @name Controls/_checkbox/Checkbox#viewMode
 * @cfg {String}
 * @demo Controls-demo/toggle/Checkbox/ViewMode/Index
 */
/**
 * @name Controls/_checkbox/Checkbox#resetValue
 * @cfg {Boolean}
 * @demo Controls-demo/toggle/Checkbox/ResetValue/Index
 */
/**
 * @typedef {String} TFontColorStyle
 * @description Допустимые значения для опции {@link Controls/_checkbox/Checkbox#fontColorStyle fontColorStyle}.
 * @variant primary
 * @variant secondary
 * @variant success
 * @variant warning
 * @variant danger
 * @variant unaccented
 * @variant link
 * @variant label
 * @variant info
 * @variant default
 */
/**
 * Стиль цвета текста контрола.
 * @name Controls/_checkbox/Checkbox#fontColorStyle
 * @cfg {Controls/interface/TFontColorStyle.typedef}
 * @demo Controls-demo/toggle/Checkbox/FontColorStyle/Index
 */
/**
 * Определяет, с какой стороны расположен заголовок кнопки.
 * @name Controls/_checkbox/Checkbox#captionPosition
 * @cfg {String}
 * @variant start Заголовок расположен перед чекбоксом.
 * @variant end Заголовок расположен после чекбокса.
 * @default end
 * @demo Controls-demo/toggle/Checkbox/CaptionPosition/Index
 */
/**
 * Определяет размер галочки чекбокса.
 * @name Controls/_checkbox/Checkbox#size
 * @cfg {String}
 * @variant s
 * @variant m
 * @variant l
 * @default s
 * @demo Controls-demo/toggle/Checkbox/Size/Index
 */
export default Checkbox;
