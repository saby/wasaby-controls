/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
import * as React from 'react';
import { date as formatDate } from 'Types/formatter';
import IValueOptions from './interface/IValue';
import { delimitProps } from 'UICore/Jsx';
import 'css!Controls/date';

const getWeekday = (props: IValueOptions): string => {
    if (props.value instanceof Date && !isNaN(props.value.getTime())) {
        return formatDate(props.value, 'ddl');
    } else {
        return '';
    }
};

/**
 * Контрол - день недели. Преобразует дату в день недели. Контрол используется для отображения для недели по
 * стандарту внутри шаблона {@link Controls/_dateRange/Input#rightFieldTemplate rightFieldTemplate}
 *
 * @class Controls/_date/WeekdayFormatter
 * @public
 * @demo Controls-demo/dateRange/WeekdayFormatter/Index
 *
 */

function WeekdayFormatter(
    props: IValueOptions,
    forwardedRef: React.ForwardedRef<unknown>
): React.ReactElement {
    const weekday = React.useMemo(() => getWeekday(props), [props.value]);

    const { userAttrs } = delimitProps(props);

    const isWorkday = (): boolean => {
        const weekday = props.value?.getDay();
        // В Американской системе воскресенье считается первым днем недели
        const sunday = 0;
        const saturday = 6;
        return weekday !== saturday && weekday !== sunday;
    };

    const getClassName = () => {
        let className = `controls-PeriodDialog_weekday controls-PeriodDialog_weekday__${
            isWorkday() ? 'workday' : 'weekend'
        }`;
        if (userAttrs.className) {
            className += ` ${userAttrs.className}`;
        }
        return className;
    };

    return (
        <div
            ref={forwardedRef}
            className={getClassName()}
            onTouchStart={props.onTouchStart}
            onMouseDown={props.onMouseDown}
            onMouseEnter={props.onMouseEnter}
            onMouseOver={props.onMouseOver}
            onMouseMove={props.onMouseMove}
            onMouseLeave={props.onMouseLeave}
            onClick={props.onClick}
            onKeyDown={props.onKeyDown}
        >
            {weekday}
        </div>
    );
}

export default React.forwardRef(WeekdayFormatter);

/**
 * @name Controls/_date/WeekdayFormatter#value
 * @cfg {Date} Дата, которая будет отформатирована в день недели.
 */
