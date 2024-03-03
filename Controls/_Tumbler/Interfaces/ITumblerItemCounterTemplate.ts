/**
 * @kaizen_zone 26dca2da-6261-4215-a9df-c822621bceb3
 */
import { ITumblerItem } from './ITumblerItem';

/**
 * Базовый шаблон Controls/Tumbler:tumblerItemCounterTemplate для отображения текста и счетчика
 *
 * Шаблон поддерживает следующие параметры:
 *      * fontSize {String} —  Размер шрифта.
 *      * item {Types/entity:Record} — Отображаемый элемент;
 *          - item.mainCounter {Number} Значение счетчика
 *          - item.mainCounterStyle {String} Стиль отображения счетчика
 * @class Controls/_Tumbler/interface/ITumblerItemCounterTemplate
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
export interface ITumblerItemCounterTemplate {
    /**
     * @name Controls/_Tumbler/interface/ITumblerItemCounterTemplate#caption
     * @cfg {String} Размер шрифта.
     */
    fontSize?: String;
    /**
     * @name Controls/_Tumbler/interface/ITumblerItemCounterTemplate#additionalCaption
     * @cfg {Controls/_Tumbler/interface/ITumblerItem} Отображаемый элемент.
     */
    item?: ITumblerItem;
}
