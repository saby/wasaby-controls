/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
import { TemplateFunction } from 'UI/Base';
import * as React from 'react';
import { DateContext } from './DateContextReact';

interface IDateContextProviderProps {
    content: TemplateFunction;
}

/**
 * Контрол-обертка для связи выбора периода и кнопок-стрелок, которые будут сдвигать период.
 *
 * @class Controls/_date/ContextProvider
 * @public
 * @demo Controls-demo/dateRange/DateRangeContextProvider/Index
 * @see Controls/_date/ArrowButton
 */

export default function DateContextProvider(props: IDateContextProviderProps) {
    const [shiftPeriod, setShiftPeriod] = React.useState();
    const [getArrowButtonReadOnly, setGetArrowButtonReadOnly] = React.useState();

    const contextData = React.useMemo(() => {
        return {
            shiftPeriod,
            setShiftPeriod,
            getArrowButtonReadOnly,
            setGetArrowButtonReadOnly,
        };
    }, [shiftPeriod]);

    return (
        <DateContext.Provider value={contextData}>
            <props.content {...props} />
        </DateContext.Provider>
    );
}
