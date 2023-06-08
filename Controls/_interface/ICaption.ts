/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
import { TemplateFunction } from 'UI/Base';
export interface ICaptionOptions {
    caption?: string | TemplateFunction;
}

/**
 * Текст заголовка.
 * @interface Controls/_interface/ICaption
 * @public
 */

/*
 * Caption text.
 *
 * @public
 * @author Мочалов М.А.
 */
export default interface ICaption {
    readonly '[Controls/_interface/ICaption]': boolean;
}
/**
 * @name Controls/_interface/ICaption#caption
 * @cfg {String|TemplateFunction} Определяет текст заголовка контрола.
 * @example
 * <pre class="brush: html">
 *    <Controls.buttons:Button caption="Hello Wasaby"/>
 * </pre>
 */

/*
 * @name Controls/_interface/ICaption#caption
 * @cfg {String|TemplateFunction} Control caption text.
 * @example
 * Control has caption 'Dialog'.
 * <pre>
 *    <ControlsDirectory.Control caption="Dialog"/>
 * </pre>
 */
