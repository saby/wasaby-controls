/**
 * @kaizen_zone f43717a4-ecb5-4bdd-a32c-4ebbcb125017
 */
import { IBaseIcon } from './IBaseIcon';
/**
 * Шаблон TextCounterTabTemplate для отображения вкладки, используется для вывода содержимого:
 * <ul>
 *     <li><текст> - <счетчик></li>
 *     <li><текст> - <иконка></li>
 *     <li><текст> - <иконка> - <счетчик></li>
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
 *     <li>additionalCaption {String} - дополнительная подпись вкладки.</li>
 *     <li>horizontalPadding {String} - определяет наличие отступа.</li>
 * </ul>
 *
 * @class Controls/_tabs/interface/TextCounterTabTemplate
 * @implements Controls/_tabs/interface/IBaseIcon
 * @example
 * Вкладки с использованием шаблона TextCounterTabTemplate.
 * <pre>
 *     <Controls.tabs:Buttons
 *                      bind:selectedKey='SelectedKey'
 *                      itemTemplate="Controls/tabs:TextCounterTabTemplate"
 *                      items="{{_items}}"
 *                      keyProperty="id"/>
 * </pre>
 * <pre>
 *     {
 *        id: '1',
 *        caption: 'Вкладка',
 *        mainCounter: 12
 *     },
 *     {
 *        id: '2',
 *        caption: 'Вкладка',
 *        mainCounter: 12
 *     },
 *     {
 *        id: '3',
 *        caption: 'Вкладка',
 *        mainCounter: 12,
 *        additionalCaption: 'Доп. текст'
 *     }
 * </pre>
 * @demo Controls-demo/Tabs/Buttons/NewTemplate/Index
 * @public
 */
export interface ITextCounterTabTemplate extends IBaseIcon {
    /**
     * @name Controls/_tabs/interface/TextCounterTabTemplate#mainCounter
     * @cfg {String} Значение счетчика.
     */
    mainCounter?: string;
    /**
     * @name Controls/_tabs/interface/TextCounterTabTemplate#mainCounterStyle
     * @cfg {String} Стиль отображения счетчика.
     */
    mainCounterStyle?: string;
    /**
     * @name Controls/_tabs/interface/TextCounterTabTemplate#caption
     * @cfg {String} Подпись вкладки.
     */
    caption?: string;
    /**
     * @name Controls/_tabs/interface/TextCounterTabTemplate#additionalCaption
     * @cfg {String} Дополнительная подпись вкладки.
     */
    additionalCaption?: string;
    /**
     * @cfg {String} Определяет наличие отступа.
     * @variant left
     * @variant right
     * @variant none
     * @default left
     */
    horizontalPadding?: string;
}
