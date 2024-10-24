/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import * as React from 'react';
import _DateMenu from './_DateMenu';
import DateMenuFrequent from './DateMenu/Frequent';
import { BaseEditor, ListEditor } from 'Controls/filterPanel';
import { IDateMenuOptions } from 'Controls/_filterPanelEditors/DateMenu/IDateMenu';
import { SyntheticEvent } from 'Vdom/Vdom';

/**
 * Контрол используют в качестве редактора для поля фильтра с типом Date.
 *
 * @remark
 * Полезные ссылки:
 *
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-panel/ руководство разработчика по настройке Controls-ListEnv/filterPanelConnected:View}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-view/base/ руководство разработчика по настройке Controls-ListEnv/filterConnected:View}
 *
 * @class Controls/_filterPanelEditors/DateMenu
 * @implements Controls/date:Input
 * @implements Controls/date:ICaption
 * @implements Controls/interface:IDateRangeValidators
 * @implements Controls/filter:IPeriodsConfig
 * @demo Controls-ListEnv-demo/FilterPanel/View/Editors/DateMenuEditor/Index
 * @demo Controls-ListEnv-demo/Filter/View/Editors/DateMenuEditor/Index
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
        props.onPropertyValueChanged?.(event, extendedValue);
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
        return <ListEditor forwardedRef={ref} {...props} />;
    }
});

/**
 * @name Controls/_filterPanelEditors/DateMenu#shouldPositionBelow
 * @cfg {Boolean} Определяет, нужно ли позиционировать выбранный период снизу.
 * @remark Большинство реестров/отчётов отображают данные из прошлого, поэтому логичней календарь в фильтрах показывать в положении ДО текущего периода.
 * @default true
 * @example
 * <pre class="brush: js">
 * this._filterSource = [ {
 *     ...,
 *     editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
 *     editorOptions: {
 *         customPeriod: true,
 *         periodType: 'last'
 *     }
 * }];
 * </pre>
 */
