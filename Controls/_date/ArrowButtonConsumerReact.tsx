/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
import { TemplateFunction } from 'UI/Base';
import * as React from 'react';
import { DateContext } from './DateContextReact';
import { ArrowButton, IArrowButtonOptions } from 'Controls/buttons';

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
        const delta = props.direction === 'left' ? -1 : 1;
        dateContext.shiftPeriod(delta);
    };

    return <ArrowButton ref={props.$wasabyRef} onClick={onClick} {...props} />;
}

export default React.memo(ArrowButtonConsumer);
