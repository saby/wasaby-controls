/**
 * @kaizen_zone 4f556a12-3d12-4c5d-bfd8-53e193344358
 */
import { TemplateFunction } from 'UI/Base';
import { ICutButton } from '../CutButton';
import {
    IBackgroundStyleOptions,
    IExpandableOptions,
} from 'Controls/interface';

type TIconSize = 's' | 'm' | 'l';

export interface ICutOptions
    extends ICutButton,
        IBackgroundStyleOptions,
        IExpandableOptions {
    /**
     * @name Controls/_spoiler/interface/ICut#content
     * @cfg {TemplateFunction|String} Контент контрола.
     * @demo Controls-demo/Spoiler/Cut/Content/Index
     */
    content: TemplateFunction | string;
    /**
     * @name Controls/_spoiler/interface/ICut#iconSize
     * @cfg
     * @demo Controls-demo/Spoiler/Cut/IconSize/Index
     * @example
     * Кнопка с размером иконки "s".
     * <pre class="brush: html">
     * <!-- WML -->
     * <Controls.spoiler:Cut lines="{{3}}" iconSize="s">
     * </pre>
     */
    iconSize?: TIconSize;
    /**
     * @name Controls/_spoiler/interface/ICut#contrastBackground
     * @cfg
     * @demo Controls-demo/Spoiler/Cut/ContrastBackground/Index
     */
    contrastBackground: boolean;
}

/**
 * Интерфейс для контролов, ограничивающих контент заданным числом строк.
 * @interface Controls/_spoiler/interface/ICut
 * @implements Controls/interface:IBackgroundStyle
 * @implements Controls/interface:IExpandable
 * @implements Controls/interface:IIconSize
 * @implements Controls/interface:IHeight
 * @implements Controls/interface:IContrastBackground
 * @public
 */
export default interface ICut {
    readonly '[Controls/_spoiler/interface/ICut]': boolean;
}

/**
 * @name Controls/_spoiler/interface/ICut#buttonPosition
 * @cfg {String} Положение кнопки развертывания.
 * @variant start По левому краю контентной области.
 * @variant center По центру контентной области.
 * @default center
 * @demo Controls-demo/Spoiler/Cut/ButtonPosition/Index
 */
