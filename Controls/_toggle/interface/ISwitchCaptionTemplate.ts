/**
 * @kaizen_zone 3f785aa8-d36c-4b57-946a-a916e51ded4d
 */
import { TemplateFunction } from 'UI/Base';

/**
 * Базовый шаблон Controls/toggle:switchCaptionTemplate для отображения текста заголовка кнопки используется
 * по умолчанию.
 *
 * Шаблон поддерживает следующие параметры:
 *      * caption {TemplateFunction|String} —  Шаблон основной подписи.
 *      * additionalCaption {TemplateFunction|String} — Шаблон дополнительной подписи.
 * @class Controls/_toggle/interface/ISwitchCaptionTemplate
 * @implements Controls/_toggle/interface/ISwitchCaptionTemplate
 * @example
 * Использование шаблона Controls/toggle:switchCaptionTemplate:
 * <pre>
 *     <Controls.toggle:Switch>
 *         <ws:captionTemplate>
 *             <ws:partial template="Controls/toggle:switchCaptionTemplate"
 *                         scope="{{captionTemplate}}"
 *                         additionalCaption="{{_captionTemplate}}"/>
 *         </ws:captionTemplate>
 * </Controls.toggle:Switch>
 * </pre>
 * @demo Controls-demo/toggle/Switch/CaptionTemplate/Index
 * @public
 */

export interface ISwitchCaptionTemplate {
    /**
     * @name Controls/_toggle/interface/ISwitchCaptionTemplate#caption
     * @cfg {TemplateFunction|String} Шаблон основной подписи.
     */
    caption?: TemplateFunction | String;
    /**
     * @name Controls/_toggle/interface/ISwitchCaptionTemplate#additionalCaption
     * @cfg {TemplateFunction|String} Шаблон дополнительной подписи.
     */
    additionalCaption?: TemplateFunction | String;
}
