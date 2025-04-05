/**
 * @kaizen_zone f43717a4-ecb5-4bdd-a32c-4ebbcb125017
 */
import { ITextCounterTabTemplate } from 'Controls/_tabs/interface/ITextCounterTabTemplate';
/**
 * Шаблон IconCounterTabTemplate для отображения вкладки, используется для вывода содержимого:
 * <ul>
 *     <li><иконка></li>
 *     <li><иконка> - <счетчик></li>
 *     <li><иконка> - <текст></li>
 *     <li><картинка> - <текст></li>
 * </ul>
 *
 * Шаблон поддерживает следующие параметры:
 * <ul>
 *     <li>icon {String} — название иконки.</li>
 *     <li>iconStyle {String} — стиль отображения иконки.</li>
 *     <li>iconSize {String} - размер иконки (доступны значения s и m).</li>
 *     <li>iconTooltip {String} — отдельная всплывающая подсказка для иконки.</li>
 *     <li>mainCounter {Number} — значение счетчика.</li>
 *     <li>mainCounterStyle {String} — стиль отображения счетчика.</li>
 *     <li>caption {String} — подпись вкладки.</li>
 *     <li>imageSize {String} - размер изображения (доступны значения s и m).</li>
 *     <li>image {Object} — конфигурация для отображения картинки.
 *          <ul>
 *               <li>src {String} — url картинки.</li>
 *               <li>srcSet {String} — значение для аттрибута srcset.</li>
 *               <li>tooltip {String} — значение для тултипа.</li>
 *          </ul>
 *     </li>
 * </ul>
 *
 * @class Controls/_tabs/interface/IconCounterTabTemplate
 * @implements Controls/_tabs/interface/TextCounterTabTemplate
 * @example
 * Вкладки с использованием шаблона IconCounterTabTemplate.
 * <pre>
 *     <Controls.tabs:Buttons
 *                      bind:selectedKey='SelectedKey'
 *                      itemTemplate="Controls/tabs:IconCounterTabTemplate"
 *                      items="{{_items}}"
 *                      keyProperty="id"/>
 * </pre>
 * <pre>
 *     {
 *        id: '1',
 *        icon: 'Show',
 *        caption: 'Вкладка'
 *     },
 *     {
 *        id: '2',
 *        icon: 'Show',
 *        caption: 'Вкладка'
 *     },
 *     {
 *        id: '3',
 *        icon: 'Show',
 *        caption: 'Вкладка'
 *     }
 * </pre>
 * @demo Controls-demo/Tabs/Buttons/NewTemplate/Index
 * @public
 */
export interface IIconCounterTabTemplate extends ITextCounterTabTemplate {
    /**
     * @name Controls/_tabs/interface/IconCounterTabTemplate#image
     * @cfg {Controls/_tabs/interface/ITabsButtons/image.typedef} Конфигурация для отображения картинки.
     */
    image?: object;
    /**
     * @name Controls/_tabs/interface/IconCounterTabTemplate#imageSize
     * @cfg {String} Размер картинки
     */
    imageSize?: string;
}
/**
 * @typedef {Object} Controls/_tabs/interface/IconCounterTabTemplate/image
 * @property {String} [image.src] Url картинки.
 * @property {Number} [image.srcSet] Значение аттрибута srcset.
 * @property {String} [image.tooltip] Значение тултипа.
 */
