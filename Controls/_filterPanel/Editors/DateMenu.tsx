/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import * as React from 'react';
import _DateMenu from './_DateMenu';
import DateMenuFrequent from './DateMenu/Frequent';
import _List from './_List';
import { IDateMenuOptions } from 'Controls/_filterPanel/Editors/_DateMenu';
import { SyntheticEvent } from 'Vdom/Vdom';
import BaseEditor from '../BaseEditor';

/**
 * Контрол используют в качестве редактора для поля фильтра с типом Date.
 * @class Controls/_filterPanel/Editors/DateMenu
 * @extends UI/Base:Control
 * @mixes Controls/date:Input
 * @demo Engine-demo/Controls-widgets/FilterView/Editors/DateMenu/Index
 * @public
 */

export default React.forwardRef(function DateMenu(
    props: IDateMenuOptions,
    ref: React.ForwardedRef<unknown>
): React.ReactElement {
    const extendedCaptionClickHandler = (event: SyntheticEvent) => {
        const extendedValue = {
            value: props.resetValue,
            textValue: '',
            viewMode: 'basic',
        };
        (props.onPropertyvaluechanged || props.onPropertyValueChanged)?.(event, extendedValue);
    };

    if (props.editorsViewMode === 'cloud') {
        return <_DateMenu ref={ref} {...props} />;
    } else if (props.editorsViewMode !== 'default' && props.viewMode === 'extended') {
        return (
            <BaseEditor ref={ref} {...props} onExtendedCaptionClick={extendedCaptionClickHandler} />
        );
    } else if (props.viewMode === 'frequent') {
        return <DateMenuFrequent ref={ref} {...props} />;
    } else {
        return <_List forwardedRef={ref} {...props} />;
    }
});

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
 * @demo Controls-ListEnv-demo/Filter/View/Editors/DateMenuEditor/Frequent/Index
 * @see Controls/dateRange:IRangeSelectable#selectionType
 */
