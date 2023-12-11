/**
 * @kaizen_zone 98febf5d-f644-4802-876c-9afd0e12cf6a
 */
import { TemplateFunction } from 'UI/Base';
import * as React from 'react';
import { DateContext } from 'Controls/date';
import Selector from './Selector';
import { IControlProps } from 'Controls/interface';

interface ISelectorConsumerReactProps extends IControlProps {
    content: TemplateFunction;
}

/**
 * Контрол позволяет пользователю выбрать временной период: месяц, квартал, полугодие, год. Выбор происходит с помощью панели большого выбора периода.
 * @class Controls/_dateRange/RangeSelectorConsumer
 * @implements Controls/date:IBaseSelectorOptions
 * @implements Controls/interface:IResetValues
 * @implements Controls/dateRange:IDateRange
 * @implements Controls/dateRange:IDateRangeSelectable
 * @remark
 * Контрол используется для работы с кнопками dateRange:ArrowButtonConsumer, которые двигают период.
 * Стоит использовать контрол только в связке с date:ContextProvider.
 * @example
 * @public
 * @demo Controls-demo/dateRange/DateRangeContextProvider/Index
 * @see Controls/_dateRange/DateRangeContextProvider
 * @see Controls/_buttons/ArrowButton
 * @see Controls/_dateRange/ArrowButtonConsumer
 */

/**
 * @name Controls/_dateRange/RangeSelectorConsumer#fontWeight
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
