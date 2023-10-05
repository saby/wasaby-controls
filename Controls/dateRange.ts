/**
 * @kaizen_zone a6f7e3ef-ed43-410d-9cea-ff0ee79dcaee
 */
export { default as Input } from './_dateRange/Input';
export {
    default as Selector,
    IRangeSelectorProps,
    TRangeChangedHandler,
} from './_dateRange/Selector';
export { default as RelationController } from './_dateRange/RelationController';
export { default as RelationWrapper } from './_dateRange/RelationWrapper';
export { default as RelationButton } from './_dateRange/RelationButton';
export { default as Utils } from './_dateRange/Utils';
export { default as LinkView } from './_dateRange/LinkView';
export { default as RangeSelectionController } from './_dateRange/Controllers/RangeSelectionController';
export { default as DateRangeSelectionController } from './_dateRange/Controllers/DateRangeSelectionController';
export { default as DateRangeModel } from './_dateRange/DateRangeModel';
export { default as IRangeSelectable } from './_dateRange/interfaces/IRangeSelectable';
export { default as IPeriodLiteDialog } from './_dateRange/interfaces/IPeriodLiteDialog';
export { default as keyboardPeriodController } from './_dateRange/Utils/keyboardPeriodController';
export { default as SelectorConsumer } from './_dateRange/RangeSelectorConsumerReact';
export { IDateRangeInputOptions } from './_dateRange/Input';
export {
    IDateRangeSelectableOptions,
    IRangeSelectableOptions,
    TSelectionType,
} from 'Controls/_dateRange/interfaces/IDateRangeSelectable';
export { IDateRangeOptions } from 'Controls/_dateRange/interfaces/IDateRange';
import IDateRangeSelectable = require('Controls/_dateRange/interfaces/IDateRangeSelectable');
export { default as ICaptionFormatter } from 'Controls/_dateRange/interfaces/ICaptionFormatter';

export { IDateRangeSelectable };

/**
 * Библиотека контролов, которые служат для отображения диапазона дат и выбора дат из выпадающей панели.
 * @library
 * @includes Input Controls/_dateRange/Input
 * @includes Selector Controls/_dateRange/Selector
 * @includes RelationController Controls/_dateRange/RelationController
 * @includes RelationWrapper Controls/_dateRange/RelationWrapper
 * @includes RelationButton Controls/_dateRange/RelationButton
 * @includes IInput Controls/_dateRange/interfaces/IInput
 * @includes IPeriodLiteDialog Controls/_dateRange/interfaces/IPeriodLiteDialog
 * @includes IDateRangeSelectable Controls/_dateRange/interfaces/IDateRangeSelectable
 * @includes IRangeSelectable Controls/_dateRange/interfaces/IRangeSelectable
 * @includes ICaptionFormatter Controls/_dateRange/interfaces/ICaptionFormatter
 * @includes Utils Controls/_dateRange/Utils
 * @includes RangeSelectionController Controls/_dateRange/Controllers/RangeSelectionController
 * @includes DateRangeSelectionController Controls/_dateRange/Controllers/DateRangeSelectionController
 * @includes IDatePickerSelectors Controls/_dateRange/interfaces/IDatePickerSelectors
 * @includes IDateRange Controls/_dateRange/interfaces/IDateRange
 * @includes IRangeInputTag Controls/_dateRange/interfaces/IRangeInputTag
 * @public
 */

/*
 * Date range library
 * @library
 * @includes Input Controls/_dateRange/Input
 * @includes RangeSelector Controls/_dateRange/RangeSelector
 * @includes RangeShortSelector Controls/_dateRange/RangeShortSelector
 * @includes RelationController Controls/_dateRange/RelationController
 * @includes RelationWrapper Controls/_dateRange/RelationWrapper
 * @includes RelationButton Controls/_dateRange/RelationButton
 * @includes IInput Controls/_dateRange/interfaces/IInput
 * @includes IPeriodLiteDialog Controls/_dateRange/interfaces/IPeriodLiteDialog
 * @includes IDateRangeSelectable Controls/_dateRange/interfaces/IDateRangeSelectable
 * @includes Utils Controls/_dateRange/Utils
 * @includes RangeSelectionController Controls/_dateRange/Controllers/RangeSelectionController
 * @includes DateRangeSelectionController Controls/_dateRange/Controllers/DateRangeSelectionController
 * @includes IRangeSelectable Controls/_dateRange/interfaces/IRangeSelectable
 * @includes IDatePickerSelectors Controls/_dateRange/interfaces/IDatePickerSelectors
 * @includes IDateRange Controls/_dateRange/interfaces/IDateRange
 * @includes IRangeInputTag Controls/_dateRange/interfaces/IRangeInputTag
 * @public
 * @author Ковалев Г.Д.
 */
