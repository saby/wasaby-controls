import { ObjectType, StringType, AnyType, DateType, BooleanType, FunctionType } from 'Types/meta';
import { IDateLitePopupOptions } from 'Controls/shortDatePicker';
import { TemplateFunctionType } from '../_interface/TemplateFunctionType';
import { IControlOptionsType } from '../_interface/IControlOptionsType';
import { IDisplayedRangesOptionsType } from '../_input/IDisplayedRangesOptionsType';

export const IDateLitePopupOptionsType = ObjectType.id(
    'Controls/meta:IDateLitePopupOptionsType'
).attributes<IDateLitePopupOptions>({
    ...IControlOptionsType.attributes(),
    ...IDisplayedRangesOptionsType.attributes(),
    year: DateType.optional().hidden(),
    chooseMonths: BooleanType.optional().hidden(),
    chooseQuarters: BooleanType.optional().hidden(),
    chooseHalfyears: BooleanType.optional().hidden(),
    chooseYears: BooleanType.optional().hidden(),
    emptyCaption: StringType.optional().hidden(),
    popupClassName: StringType.optional().hidden(),
    captionFormatter: FunctionType.optional().hidden(),
    startValue: DateType.optional().hidden(),
    endValue: DateType.optional().hidden(),
    dateConstructor: FunctionType.optional().hidden(),
    monthTemplate: TemplateFunctionType.optional().hidden(),
    itemTemplate: TemplateFunctionType.optional().hidden(),
    stickyPosition: ObjectType.optional().hidden(),
    headerContentTemplate: TemplateFunctionType.optional().hidden(),
    arrowVisible: BooleanType.optional().hidden(),
    yearItemsCallback: AnyType.optional().hidden(),
});
