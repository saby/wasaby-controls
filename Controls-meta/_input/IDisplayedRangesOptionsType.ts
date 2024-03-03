import { ObjectType, AnyType } from 'Meta/types';
import { IDisplayedRangesOptions } from 'Controls/interface';
import { TemplateFunctionType } from '../_interface/TemplateFunctionType';

export const IDisplayedRangesOptionsType = ObjectType.id(
    'Controls/meta:IDisplayedRangesOptionsType'
).attributes<IDisplayedRangesOptions>({
    displayedRanges: AnyType.optional().hidden(),
    stubTemplate: TemplateFunctionType.optional().hidden(),
});
