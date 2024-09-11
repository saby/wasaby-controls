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
    const getShiftPeriodRef = React.useRef(null);

    React.useEffect(() => {
        getShiftPeriodRef.current = () => {
            return dateContext.shiftPeriod;
        };
    }, [dateContext]);

    const onClick = () => {
        const shiftPeriod = getShiftPeriodRef.current();
        if (shiftPeriod) {
            const delta = props.direction === 'left' ? -1 : 1;
            shiftPeriod(delta);
        }
    };

    const arrowOptions = {
        ref: props.$wasabyRef,
        onClick,
        ...props,
    };

    return <Async templateName="Controls/extButtons:ArrowButton" templateOptions={arrowOptions} />;
}

export default React.memo(ArrowButtonConsumer);

/**
 * @name Controls/_date/ArrowButtonConsumer#direction
 * @cfg {String} Выбор стороны, куда будет указывать стрелка в кнопке.
 * @variant left Стрелка будет указывать влево, период переключится в будущее.
 * @variant right Стрелка будет указывать вправо, период переключится в прошлое.
 */
