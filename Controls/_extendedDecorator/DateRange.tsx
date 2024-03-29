import * as React from 'react';
import { timeInterval, TimeIntervalDisplayMode } from 'Types/formatter';
import { IDateRange } from './interfaces/IDateRange';

/**
 * Графический контрол, служащий для отображения формата длительности временных периодов.
 *
 * @class Controls/_extendedDecorator/DateRange
 * @implements Controls/interface:IControl
 * @mixes Controls/extendedDecorator:IDateRange
 * @public
 * @demo Controls-demo/extendedDecorator/DateRange/Default/Index
 * @demo Controls-demo/extendedDecorator/DateRange/Index
 */

export default React.memo(function DateRange({
    displayMode = TimeIntervalDisplayMode.Numeric,
    showNullUnits = false,
    short = true,
    ...props
}: IDateRange): React.ReactElement {
    const formattedDateRange = timeInterval({
        startDate: props.startValue,
        finishDate: props.endValue,
        displayMode,
        displayedUnitsNumber: props.displayedUnitsNumber,
        displayedUnits: props.displayedUnits,
        showNullUnits,
        short,
    });
    return (
        <span
            className={'controls-ExtendedDecorator-DateRange'}
            title={formattedDateRange}
        >
            {formattedDateRange}
        </span>
    );
});
