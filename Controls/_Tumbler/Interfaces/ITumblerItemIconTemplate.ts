/**
 * @kaizen_zone 26dca2da-6261-4215-a9df-c822621bceb3
 */
import { ITumblerItem } from './ITumblerItem';

/**
 * Базовый шаблон Controls/Tumbler:tumblerItemIconTemplate для отображения текста, иконки и счетчика
 *
 * Шаблон поддерживает следующие параметры:
 *      * fontSize {String} — Размер шрифта.
 *      * item {Types/entity:Record} — Отображаемый элемент;
 *          - item.mainCounter {Number} Значение счетчика
 *          - item.mainCounterStyle {String} Стиль отображения счетчика
 *          - item.icon {String} Отображаемая иконка
 *          - item.iconStyle {String} Стиль иконки
 *          - item.iconSize {String} Размер иконки
 * @class Controls/_Tumbler/interface/ITumblerItemIconTemplate
 * @implements Controls/_Tumbler/interface/ITumblerItemIconTemplate
 * @example
 * Использование шаблона Controls/Tumbler:tumblerItemCounterTemplate:
 * <pre>
 *     <Controls.Tumbler:Control>
 *         <ws:itemTemplate>
 *             <ws:partial template="Controls/Tumbler:tumblerItemIconTemplate"
 *                         item="{{itemTemplate.item}}"
 *                         fontSize="{{itemTemplate.fontSize}}"/>
 *         </ws:itemTemplate>
 *     </Controls.Tumbler:Control>
 * </pre>
 * @public
 */
export interface ITumblerItemIconTemplate {
    /**
     * @name Controls/_Tumbler/interface/ITumblerItemIconTemplate#caption
     * @cfg {String} Размер шрифта.
     */
    fontSize?: String;
    /**
     * @name Controls/_Tumbler/interface/ITumblerItemIconTemplate#additionalCaption
     * @cfg {Controls/_Tumbler/interface/ITumblerItem} Отображаемый элемент.
     */
    item?: ITumblerItem;
}
