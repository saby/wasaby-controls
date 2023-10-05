/**
 * @kaizen_zone 4efc1ffa-202d-406f-befe-efa4a5d4ee0c
 */
import { IControlOptions, TemplateFunction } from 'UI/Base';
import {
    ICaptionOptions,
    IContrastBackground,
    IFontColorStyleOptions,
    IFontSizeOptions,
    IHeightOptions,
    IHrefOptions,
    IIconOptions,
    IIconSizeOptions,
    IIconStyleOptions,
    ITooltipOptions,
} from 'Controls/interface';
import { TInternalProps } from 'UICore/Executor';
import { IViewModeOptions } from './IViewMode';

/**
 * @description Значение для вида отображения кнопки
 * @variant link
 * @variant filled
 * @variant outlined
 * @variant ghost
 */
export type IViewMode = 'link' | 'linkButton' | 'filled' | 'outlined' | 'ghost';
export type TextAlign = 'left' | 'right' | 'center';

/**
 * @description Значения для стиля отображения кнопки.
 * @variant primary
 * @variant warning
 * @variant secondary
 * @variant success
 * @variant danger
 * @variant info
 * @variant unaccented
 * @variant default
 * @variant pale
 * @variant navigation
 * @variant brand
 */
export type TButtonStyle =
    | 'primary'
    | 'warning'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'info'
    | 'unaccented'
    | 'default'
    | 'pale'
    | 'navigation'
    | 'brand';

export interface IButtonOptions
    extends IControlOptions,
        IHrefOptions,
        ICaptionOptions,
        IIconOptions,
        IIconStyleOptions,
        IIconSizeOptions,
        IFontColorStyleOptions,
        IFontSizeOptions,
        IHeightOptions,
        ITooltipOptions,
        IViewModeOptions,
        TInternalProps {
    contrastBackground?: boolean;
    buttonStyle?: string;
    viewMode?: IViewMode;
    captionPosition?: 'start' | 'end';
    iconTemplate?: TemplateFunction;
    iconOptions?: object;
    textAlign?: TextAlign;
    translucent?: 'dark' | 'none' | 'light';
    loading?: boolean;
    loadingIndicator?: TemplateFunction;
    underlineVisible?: boolean;
    color?: TButtonStyle;
    onClick?: (event: React.SyntheticEvent<HTMLElement, React.MouseEvent>) => void;
    onTouchStart?: (event: React.SyntheticEvent<HTMLElement, React.TouchEvent>) => void;
    onMouseDown?: (event: React.SyntheticEvent<HTMLElement, React.MouseEvent>) => void;
    onMouseEnter?: (event: React.SyntheticEvent<HTMLElement, React.MouseEvent>) => void;
    onMouseOver?: (event: React.SyntheticEvent<HTMLElement, React.MouseEvent>) => void;
    onMouseMove?: (event: React.SyntheticEvent<HTMLElement, React.MouseEvent>) => void;
    onMouseLeave?: (event: React.SyntheticEvent<HTMLElement, React.MouseEvent>) => void;
    onKeyPress?: (event: React.SyntheticEvent<HTMLElement, React.KeyboardEvent>) => void;
    onKeyDown?: (event: React.SyntheticEvent<HTMLElement, React.KeyboardEvent>) => void;
    /**
     * Имя атрибута data-qa, которое навесится на корневой контейнер компонента. Используется для автотестирования.
     */
    'data-qa'?: string;
}

/**
 * Интерфейс для стилевого оформления кнопки.
 * @public
 */

/*
 * Interface for Button control.
 *
 * @interface Controls/_buttons/interface/IButton
 * @public
 * @author Мочалов М.А.
 */
export interface IButton extends IContrastBackground {
    readonly '[Controls/_buttons/interface/IButton]': boolean;
}

/**
 * @name Controls/_buttons/interface/IButton#buttonStyle
 * @cfg {String} Стиль отображения кнопки.
 * @variant primary
 * @variant secondary
 * @variant success
 * @variant danger
 * @variant warning
 * @variant info
 * @variant unaccented
 * @variant default
 * @variant pale
 * @variant navigation
 * @variant brand
 * @default secondary
 * @remark
 * Стиль может влиять на цвет фона или цвет границы для различных значений режима отображения (см. {@link Controls/buttons:Button#viewMode viewMode}).
 * @demo Controls-demo/Buttons/ButtonStyle/Index
 * @example
 * Кнопка со стилем "Primary" с иконкой по умолчанию.
 * <pre class="brush: html; highlight: [4]">
 * <!-- WML -->
 * <Controls.buttons:Button
 *    viewMode="outlined"
 *    buttonStyle="primary"/>
 * </pre>
 */

/*
 * @name Controls/_buttons/interface/IButton#buttonStyle
 * @cfg {String} Set style parameters for button. These are background color or border color for different values of viewMode
 * @variant primary
 * @variant secondary
 * @variant success
 * @variant danger
 * @variant warning
 * @variant info
 * @variant unaccented
 * @variant default
 * @variant pale
 * @default secondary
 * @example
 * Primary button with default icon style.
 * <pre>
 *    <Controls.buttons:Button viewMode="outlined" buttonStyle="primary"/>
 * </pre>
 */

/**
 * @name Controls/_buttons/interface/IButton#translucent
 * @cfg {String} Режим полупрозрачного отображения кнопки.
 * @variant dark Темная полупрозрачность
 * @variant light Светлая полупрозрачность
 * @variant none Полупрозрачность отсутствует
 * @default none
 */

/**
 * @name Controls/_buttons/interface/IButton#iconTemplate
 * @cfg {TemplateFunction} Определяет шаблон с иконкой контрола.
 * @demo Controls-demo/Buttons/Icon/Index
 */

/**
 * @name Controls/_buttons/interface/IButton#underlineVisible
 * @cfg {Boolean} Определяет наличие подчеркивания у ссылки.
 * @default false
 * @demo Controls-demo/Buttons/Underline/Index
 */
