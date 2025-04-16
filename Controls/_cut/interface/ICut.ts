/**
 * @kaizen_zone 15b68a94-a4bb-4fdf-9460-7f62fb494c87
 */
import { TemplateFunction } from 'UI/Base';
import { ICutButton } from '../CutButton';
import { IBackgroundStyleOptions, IExpandableOptions } from 'Controls/interface';

export interface ICutOptions extends ICutButton, IBackgroundStyleOptions, IExpandableOptions {
    /**
     * @name Controls/_cut/interface/ICut#content
     * @cfg {TemplateFunction|String} Контент контрола.
     * @demo Controls-demo/Spoiler/Cut/Content/Index
     */
    content?: TemplateFunction | string;
}

/**
 * Интерфейс для контролов, ограничивающих контент заданным числом строк.
 * @implements Controls/interface:IBackgroundStyle
 * @implements Controls/interface:IExpandable
 * @implements Controls/interface:IIconSize
 * @implements Controls/interface:IHeight
 * @public
 */
export default interface ICut {
    readonly '[Controls/_cut/interface/ICut]': boolean;
}

/**
 * @name Controls/_cut/interface/ICut#buttonPosition
 * @cfg {String} Положение кнопки развертывания.
 * @variant start По левому краю контентной области.
 * @variant center По центру контентной области.
 * @default center
 * @demo Controls-demo/Spoiler/Cut/ButtonPosition/Index
 */

/**
 * @name Controls/_cut/interface/ICut#iconSize
 * @cfg {Controls/cut/TIconSize.typedef}
 * @demo Controls-demo/Spoiler/Cut/IconSize/Index
 * @example
 * Кнопка с размером иконки "s".
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.cut:Cut lines="{{3}}" iconSize="s">
 * </pre>
 */

/**
 * @name Controls/_cut/interface/ICut#contrastBackground
 * @cfg {Boolean} Определяет контрастность фона контрола по отношению к его окружению.
 * @default true
 * @demo Controls-demo/Spoiler/Cut/ContrastBackground/Index
 */
