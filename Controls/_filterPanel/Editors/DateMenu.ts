/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { Control, TemplateFunction } from 'UI/Base';
import { IDateMenuOptions } from 'Controls/_filterPanel/Editors/_DateMenu';
import * as template from 'wml!Controls/_filterPanel/Editors/DateMenu/DateMenu';

/**
 * Контрол используют в качестве редактора для поля фильтра с типом Date.
 * @class Controls/_filterPanel/Editors/DateMenu
 * @extends UI/Base:Control
 * @mixes Controls/date:Input
 * @demo Engine-demo/Controls-widgets/FilterView/Editors/DateMenu/Index
 * @public
 */

export default class DateMenuEditor extends Control<IDateMenuOptions> {
    protected _template: TemplateFunction = template;

    protected _extendedCaptionClickHandler(): void {
        const extendedValue = {
            value: this._options.resetValue,
            textValue: '',
            viewMode: 'basic',
        };
        this._notify('propertyValueChanged', [extendedValue], {
            bubbling: true,
        });
    }
}

/**
 * @name Controls/_filterPanel/Editors/DateMenu#dateMenuItems
 * @cfg {Types/collection:RecordSet} Записи для выпадающего списка.
 * К этим записям будет добавлен пункт, клик по которому откроет календарь для выбора даты.
 * Для выбора одной даты добавляется запись "На дату", для выбора периода - "За период".
 * @remark Чтобы отобразить значение в быстром доступе, у записи нужно указать поле frequent: true
 * @example
 * <pre class="brush: js">
 * this._filterSource = [ {
 *     ...,
 *     editorTemplateName: 'Controls/filterPanel:DateMenuEditor',
 *     editorOptions: {
 *         dateMenuItems: new RecordSet({
 *             rawData: [
 *                 {id: 'Today', title: 'Сегодня'},
 *                 {id: 'Week', title: 'На этой неделе'},
 *                 {id: 'Month', title: 'В этом месяце'},
 *                 {id: 'Overdue', title: 'Просроченные', frequent: true}
 *             ],
 *             keyProperty: 'id'
 *         }),
 *         selectionType: 'single',
 *         displayProperty: 'title',
 *         keyProperty: 'id'
 *     }
 * }];
 * </pre>
 * @demo Controls-demo/Filter_new/FilterView/Frequent/DateMenu/Index
 * @see Controls/dateRange:IRangeSelectable#selectionType
 */
