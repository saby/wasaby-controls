/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
import { TemplateFunction } from 'UI/Base';
import * as React from 'react';
import { DateContext } from './DateContextReact';
import Selector from './Selector';
import { IControlProps } from 'Controls/interface';

interface ISelectorConsumerReactProps extends IControlProps {
    content: TemplateFunction;
}

/**
 * Consumer контрола Controls/date:Selector для свзяи выбора периода и кнопок-стрелок.
 *
 * @class Controls/_date/SelectorConsumer
 * @implements Controls/date:IBaseSelectorOptions
 * @implements Controls/date:IValue
 * @implements Controls/date:IResetValue
 *
 * @public
 * @demo Controls-demo/Input/Date/Link
 *
 */

/**
 * @name Controls/_date/Selector#fontWeight
 * @demo Controls-demo/dateRange/LinkView/FontWeight/Index
 * @default bold
 * @private
 */

export default class SelectorConsumerReact extends React.Component<ISelectorConsumerReactProps> {
    protected _ref: React.RefObject<Selector> = React.createRef();

    constructor(props: ISelectorConsumerReactProps, context) {
        super(props);
        const { setShiftPeriod } = context;
        setShiftPeriod(() => {
            return this._ref.current.shiftPeriod;
        });
    }

    openPopup(): void {
        this._ref.current.openPopup();
    }

    render() {
        return <Selector ref={this._ref} {...this.props} forwardedRef={this.props.forwardedRef} />;
    }
}
SelectorConsumerReact.contextType = DateContext;
