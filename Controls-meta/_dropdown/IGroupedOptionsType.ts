import { ObjectType, StringType } from 'Meta/types';
import { IGroupedOptions } from 'Controls/dropdown';
import { TemplateFunctionType } from '../_interface/TemplateFunctionType';

export const IGroupedOptionsType = ObjectType.id(
    'Controls/meta:IGroupedOptionsType'
).attributes<IGroupedOptions>({
    groupProperty: StringType.optional(),
    groupTemplate: TemplateFunctionType,
});
