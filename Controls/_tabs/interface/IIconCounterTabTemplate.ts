/**
 * @kaizen_zone f43717a4-ecb5-4bdd-a32c-4ebbcb125017
 */
import { ITextCounterTabTemplate } from 'Controls/_tabs/interface/ITextCounterTabTemplate';
/**
 * Шаблон IconCounterTabTemplate для отображения вкладки, используется для вывода содержимого:
 * * <иконка>
 * * <иконка> - <счетчик>
 * * <иконка> - <текст>
 * * <картинка> - <текст>
 * Шаблон поддерживает следующие параметры:
 *      * icon {String} —  Название иконки.
 *      * iconStyle {String} — Стиль отображения иконки.
 *      * iconSize {String} - Размер иконки(Доступны значения s и m).
 *      * iconTooltip {String} — Отдельная всплывающая подсказка для иконки.
 *      * mainCounter {Number} — Значение счетчика.
 *      * mainCounterStyle {String} — Стиль отображения счетчика.
 *      * caption {String} — Подпись вкладки.
 *      * imageSize {String} - Размер изображения(Доступны значения s и m).
 *      * image {Object} — Конфигурация для отображения картинки.
 *                 * src {String} — Url картинки.
 *                 * srcSet {String} — Значение для аттрибута srcset.
 *                 * tooltip {String} — Значение для тултипа.
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
