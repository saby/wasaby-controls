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
 * @implements Controls/interface:IControl
 * @implements Controls/interface:IResetValues
 * @implements Controls/interface/IDateRange
 * @implements Controls/date:ILinkView
 * @implements Controls/interface:IOpenPopup
 * @implements Controls/dateRange:IDatePickerSelectors
 * @implements Controls/dateRange:IDayTemplate
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontWeight
 * @implements Controls/date:ICaption
 * @implements Controls/date:IValue
 * @implements Controls/date:IDatePopupType
 * @mixes Controls/dateRange:IDateSelector
 * @mixes Controls/dateRange:IMonthCaptionTemplate
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

    componentDidMount(): void {
        const { setShiftPeriod } = this.context;
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
