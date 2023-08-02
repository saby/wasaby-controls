/**
 * @kaizen_zone d8c8fc46-4e44-4724-ab3a-104ce17b50fb
 */
import { Control, TemplateFunction } from 'UI/Base';
import { IButton, IButtonOptions } from './interface/IButton';
import { IClick } from './interface/IClick';
import { IViewMode } from './interface/IViewMode';
import { getIcon, isSVGIcon } from '../Utils/Icon';
import {
    ICaption,
    IFontColorStyle,
    IFontSize,
    IHeight,
    IHref,
    IIcon,
    IIconSize,
    IIconStyle,
    ITooltip,
} from 'Controls/interface';
import { SyntheticEvent } from 'Vdom/Vdom';
import { descriptor } from 'Types/entity';
import { constants } from 'Env/Env';
import 'css!Controls/buttons';
import 'css!Controls/CommonClasses';
import ButtonTemplate = require('wml!Controls/_buttons/Button');
import { getFontWidth, loadFontWidthConstants } from 'Controls/Utils/getFontWidth';
import { IWorkByKeyboardOptions } from 'Controls/WorkByKeyboard/Context';

export function defaultHeight(viewMode: string, isCircle: boolean = false): string {
    if (isCircle && viewMode !== 'link' && viewMode !== 'linkButton') {
        return 'l';
    }
    if (viewMode === 'filled' || viewMode === 'outlined') {
        return 'default';
    }
    if (viewMode === 'ghost' || viewMode === 'toolButton' || viewMode === 'pushButton') {
        return 'l';
    }
}

export function defaultFontColorStyle(viewMode: string): string {
    if (viewMode === 'link' || viewMode === 'linkButton') {
        return 'link';
    }
}

function validateOptions(options: IButtonOptions) {
    const props = { ...options };
    if (props.contrastBackground && props.viewMode === 'outlined') {
        props.viewMode = 'filled';
    }
    return props;
}

function getTranslucent(translucent: boolean | string): string {
    if (typeof translucent === 'string') {
        return translucent;
    }
    return translucent ? 'dark' : 'none';
}

export function simpleCssStyleGeneration(props: IButtonOptions): void {
    const options = validateOptions(props);
    this._buttonStyle = options.readOnly
        ? 'readonly'
        : options.viewMode === 'ghost'
        ? 'default'
        : options.buttonStyle;
    this._contrastBackground =
        options.contrastBackground === undefined
            ? options.viewMode === 'filled'
            : options.contrastBackground;
    this._viewMode = options.viewMode;
    const isCircle = (options.icon || options.iconTemplate) && !options.caption;
    this._height = options.inlineHeight
        ? options.inlineHeight
        : defaultHeight(this._viewMode, isCircle);
    this._translucent = getTranslucent(options.translucent);
    if (this._translucent !== 'none') {
        this._fontColorStyle = this._translucent === 'dark' ? 'forTranslucent' : 'default';
    } else {
        this._fontColorStyle = options.fontColorStyle
            ? options.fontColorStyle
            : defaultFontColorStyle(this._viewMode);
    }
    this._fontSize = options.fontSize;
    this._hasIcon = !!options.icon || !!options.iconTemplate;
    if (!['filled', 'outlined', 'ghost'].includes(this._viewMode)) {
        this._textAlign = 'none';
    } else {
        this._textAlign = options.textAlign;
    }

    if (isCircle || (this._viewMode === 'ghost' && !options.textAlign)) {
        this._textAlign = 'center';
    }

    if (
        this._buttonStyle === 'unaccented' &&
        this._contrastBackground &&
        (!this._fontColorStyle || this._fontColorStyle === 'contrast')
    ) {
        this._fontColorStyle = 'default';
    }

    this._caption = options.caption;
    // На сервере rk создает инстанс String'a, проверки на typeof недостаточно
    this._stringCaption = typeof options.caption === 'string' || options.caption instanceof String;
    this._captionPosition = options.captionPosition || 'end';
    this._isSVGIcon = isSVGIcon(options.icon);
    this._icon = getIcon(options.icon);
    if (options.icon || options.iconTemplate) {
        this._iconSize = options.iconSize;
        if (options.readOnly) {
            this._iconStyle = 'readonly';
        } else {
            if (this._translucent !== 'none') {
                this._iconStyle = this._translucent === 'dark' ? 'forTranslucent' : 'default';
            } else {
                this._iconStyle = options.iconStyle;
            }
        }
    }

    if (options.color && this._translucent === 'none') {
        switch (this._viewMode) {
            case 'filled':
                this._iconStyle = 'contrast';
                break;
            case 'outlined':
                this._iconStyle = options.color;
                break;
            case 'link':
            case 'linkButton':
                this._fontColorStyle = options.fontColorStyle
                    ? options.fontColorStyle
                    : options.color;
                this._iconStyle = options.color;
                break;
        }
    }

    if (this._viewMode === 'linkButton') {
        this._viewMode = 'link';
        if (!this._height) {
            this._height = 'default';
        }
    }
}

export function getDefaultOptions(): object {
    return {
        viewMode: 'outlined',
        iconStyle: 'secondary',
        iconSize: 'm',
        captionPosition: 'end',
        fontSize: 'm',
        buttonStyle: 'secondary',
        textAlign: 'center',
        translucent: 'none',
    };
}

/**
 * Графический контрол, который предоставляет пользователю возможность простого запуска события при нажатии на него.
 * @class Controls/_buttons/Button
 * @remark
 * Кнопки могут отображаться в нескольких режимах, отличающихся друга от друга внешне.
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FButtons%2FIndex демо-пример}
 * * {@link /doc/platform/developmentapl/interface-development/controls/input-elements/buttons-switches/new-buttons/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_buttons.less переменные тем оформления}
 *
 * @extends UI/Base:Control
 * @mixes Controls/buttons:IButton
 * @mixes Controls/buttons:IClick
 * @mixes Controls/buttons:IViewMode
 * @implements Controls/interface:IHref
 * @implements Controls/interface:ICaption
 * @implements Controls/interface:IIcon
 * @implements Controls/interface:IIconStyle
 * @implements Controls/interface:IIconSize
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IHeight
 * @implements Controls/interface:ITooltip
 *
 * @public
 * @demo Controls-demo/Buttons/ViewModes/Index
 */

/*
 * Graphical control element that provides the user a simple way to trigger an event.
 *
 * <a href="/materials/DemoStand/app/Controls-demo%2FButtons%2FStandart%2FIndex">Demo-example</a>.
 *
 * @class Controls/_buttons/Button
 * @extends UI/Base:Control
 * @implements Controls/interface:IHref
 * @mixes Controls/buttons:IButton
 * @implements Controls/interface:ICaption
 * @mixes Controls/buttons:IClick
 * @implements Controls/interface:IIcon
 * @implements Controls/interface:IIconStyle
 * @implements Controls/interface:IIconSize
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IHeight
 * @implements Controls/interface:ITooltip
 *
 * @public
 * @author Мочалов М.А.
 * @demo Controls-demo/Buttons/ViewModes/Index
 */
class Button
    extends Control<IButtonOptions>
    implements
        IHref,
        ICaption,
        IIcon,
        IIconStyle,
        ITooltip,
        IIconSize,
        IClick,
        IFontColorStyle,
        IFontSize,
        IHeight,
        IButton,
        IViewMode
{
    protected _template: TemplateFunction = ButtonTemplate;

    // Называть _style нельзя, так как это состояние используется для темизации
    protected _buttonStyle: string;
    protected _fontColorStyle: string;
    protected _fontSize: string;
    protected _contrastBackground: boolean;
    protected _hasIcon: boolean;
    protected _viewMode: string;
    protected _height: string;
    protected _caption: string | TemplateFunction;
    protected _stringCaption: boolean;
    protected _captionPosition: string;
    protected _icon: string;
    protected _iconSize: string;
    protected _iconStyle: string;
    protected _hoverIcon: boolean = true;
    protected _isSVGIcon: boolean = false;
    protected _textAlign: string;
    protected _tooltip: string;
    protected _translucent: string;
    protected _workByKeyBoard: boolean;

    constructor(...args) {
        super(...args);
        this._setWorkByKeyboard = this._setWorkByKeyboard.bind(this);
    }

    protected _beforeMount(options: IButtonOptions): void {
        simpleCssStyleGeneration.call(this, options);
        this._tooltip = options.tooltip;
    }

    protected _beforeUpdate(newOptions: IButtonOptions): void {
        simpleCssStyleGeneration.call(this, newOptions);
        if (this._options.tooltip !== newOptions.tooltip) {
            this._tooltip = newOptions.tooltip;
        }
        if (this._options.caption !== newOptions.caption && !newOptions.tooltip) {
            this._tooltip = '';
        }
    }

    protected _getReadOnly(): boolean {
        return this._options.readOnly || this._options.loading;
    }

    protected _setWorkByKeyboard(workByKeyboard: IWorkByKeyboardOptions): void {
        this._workByKeyBoard = workByKeyboard?.status;
    }

    protected _getFocusedClass(workByKeyBoard: boolean): string {
        const highlightedOnFocus = (workByKeyBoard || this._workByKeyBoard) && !this._getReadOnly();
        if (highlightedOnFocus) {
            if (this._options.contrastBackground || this._viewMode !== 'link') {
                return 'controls-focused-item_shadow';
            }
            return 'controls-focused-item_background controls-focused-item_text-decoration';
        }
        return '';
    }

    protected _keyUpHandler(e: SyntheticEvent<KeyboardEvent>): void {
        if (e.nativeEvent.keyCode === constants.key.enter && !this._getReadOnly()) {
            this._container.click();
        }
    }

    protected _clickHandler(e: SyntheticEvent<MouseEvent>): void {
        if (this._getReadOnly()) {
            e.stopPropagation();
        }
    }

    protected _onMouseEnterHandler(): void {
        if (!this._getReadOnly()) {
            if (
                !this._tooltip &&
                !this._options.hasOwnProperty('tooltip') &&
                typeof this._options.caption === 'string' &&
                this._tooltip !== this._options.caption
            ) {
                loadFontWidthConstants().then(() => {
                    const captionWidth = Math.floor(
                        getFontWidth(this._options.caption, this._fontSize || 'm')
                    );
                    if (captionWidth > this._container.clientWidth) {
                        this._tooltip = this._options.caption;
                    }
                });
            }
        }
    }

    static getDefaultOptions(): object {
        return getDefaultOptions();
    }

    static getOptionTypes(): object {
        return {
            contrastBackground: descriptor(Boolean),
        };
    }
}

/**
 * @name Controls/_buttons/Button#textAlign
 * @cfg {String} Выравнивание текста кнопки.
 * @variant left Текст выравнивается по левой стороне.
 * @variant right Текст выравнивается по правой стороне.
 * @variant center Текст выравнивается по центру.
 * @variant justify Текст и иконка прижаты к разным краям.
 * @default center
 * @demo Controls-demo/Buttons/TextAlign/Index
 */

/**
 * @name Controls/_buttons/Button#fontColorStyle
 * @cfg {Controls/interface/TFontColorStyle.typedef}
 * @demo Controls-demo/Buttons/FontStyles/Index
 */

/**
 * @name Controls/_buttons/Button#href
 * @cfg {String}
 * @demo Controls-demo/Buttons/Href/Index
 */

/**
 * @name Controls/_buttons/Button#iconStyle
 * @cfg {String}
 * @demo Controls-demo/Buttons/IconStyles/Index
 */

/**
 * @name Controls/_buttons/Button#tooltip
 * @cfg {String}
 * @remark Если в кнопку передан длинный текст, который не помещается, а также не указана опция,
 * то значение в tooltip устанавливается автоматически, и равно caption.
 * @demo Controls-demo/Buttons/Tooltip/Index
 */

/**
 * @name Controls/_buttons/Button#translucent
 * @cfg {String}
 * @demo Controls-demo/Buttons/Translucent/Index
 */

/**
 * @name Controls/_buttons/Button#captionPosition
 * @cfg {String} Определяет, с какой стороны расположен текст кнопки относительно иконки.
 * @variant start Текст расположен перед иконкой.
 * @variant end Текст расположен после иконки.
 * @default end
 * @demo Controls-demo/Buttons/CaptionPosition/Index
 */

/*
 * @name Controls/_buttons/Button#captionPosition
 * @cfg {String} Determines on which side of the icon caption is located.
 * @variant left Caption before icon.
 * @variant right Icon before caption.
 * @default right
 */

/**
 * @name Controls/_buttons/Button#fontSize
 * @cfg {String}
 * @demo Controls-demo/Buttons/SizesAndHeights/Index
 * @default m
 * @example
 * <pre class="brush: html">
 * <Controls.buttons:Button icon="icon-Add" fontSize="xl" viewMode="outlined"/>
 * </pre>
 */

/**
 * @name Controls/_buttons/Button#loading
 * @cfg {Boolean} Определяет состояние загрузки. В активном состоянии отобразит ромашку внутри кнопки.
 * @demo Controls-demo/Buttons/LoadingButton/Index
 */

/**
 * @name Controls/_buttons/Button#loadingIndicator
 * @cfg {TemplateFunction} Определяет шаблон, который будет отображаться вместо стандартного состояния загрузки.
 * @see Controls/_buttons/Button#loading
 * @demo Controls-demo/Buttons/LoadingButton/Index
 */

export default Button;
