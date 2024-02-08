/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
import { TemplateFunction } from 'UI/Base';
import * as React from 'react';
import { DateContext } from './DateContextReact';
import { IArrowButtonOptions } from 'Controls/buttons';
import Async from 'Controls/Container/Async';

interface IArrowButtonConsumerProps extends IArrowButtonOptions {
    content: TemplateFunction;
}

/**
 * Контрол кнопка для переключения периода.
 * @class Controls/_date/ArrowButtonConsumer
 * @public
 * @demo Controls-demo/dateRange/DateRangeContextProvider/Index
 * @see Controls/_date/ContextProvider
 * @see Controls/_buttons/ArrowButton
 */

function ArrowButtonConsumer(props: IArrowButtonConsumerProps): React.ReactElement {
    const dateContext = React.useContext(DateContext);

    const onClick = () => {
        if (dateContext.shiftPeriod) {
            const delta = props.direction === 'left' ? -1 : 1;
            dateContext.shiftPeriod(delta);
        }
    };

    const arrowOptions = {
        ref: props.$wasabyRef,
        onClick,
        ...props
    };

    return <Async
        templateName='Controls/extButtons:ArrowButton'
        templateOptions={arrowOptions}/>;
}

export default React.memo(ArrowButtonConsumer);
