/**
 * @kaizen_zone f43717a4-ecb5-4bdd-a32c-4ebbcb125017
 */
import { IBaseIcon } from './IBaseIcon';

/**
 * Шаблон IconTextSelectedTabTemplate для отображения вкладки, используется для вывода содержимого:
 *  В выбранном состоянии <иконка> - <текст>
 *  В состоянии покоя <иконка>
 *
 * Шаблон поддерживает следующие параметры:
 * <ul>
 *     <li>icon {String} — название иконки.</li>
 *     <li>iconStyle {String} — стиль отображения иконки.</li>
 *     <li>iconSize {String} - размер иконки (доступны значения s и m).</li>
 *     <li>iconTooltip {String} — отдельная всплывающая подсказка для иконки.</li>
 *     <li>caption {String} — подпись вкладки.</li>
 * </ul>
 *
 * @class Controls/_tabs/interface/IconTextSelectedTabTemplate
 * @implements Controls/_tabs/interface/IBaseIcon
 * @example
 * Вкладки с использованием шаблона IconTextSelectedTabTemplate.
 * <pre>
 *     <Controls.tabs:Buttons
 *                      bind:selectedKey='SelectedKey'
 *                      itemTemplate="Controls/tabs:IconTextSelectedTabTemplate"
 *                      items="{{_items}}"
 *                      keyProperty="id"/>
 * </pre>
 * <pre>
 *     {
 *        id: '1',
 *        caption: 'Сотрудники',
 *        icon: 'icon-AddContact'
 *     },
 *     {
 *        id: '2',
 *        caption: 'Контакты',
 *        icon: 'icon-EmptyMessage'
 *     },
 *     {
 *        id: '3',
 *        caption: 'Звонки',
 *        icon: 'icon-Call'
 *     }
 * </pre>
 * @demo Controls-demo/Tabs/Buttons/NewTemplate/Index
 * @public
 */
export interface IIconTextSelectedTabTemplate extends IBaseIcon {
    /**
     * @name Controls/_tabs/interface/IconTextSelectedTabTemplate#caption
     * @cfg {String} Подпись вкладки.
     */
    caption?: string;
}
