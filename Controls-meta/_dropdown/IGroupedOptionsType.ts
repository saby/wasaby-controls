import { ObjectType, StringType } from 'Types/meta';
import { IGroupedOptions } from 'Controls/dropdown';
import { TemplateFunctionType } from '../_interface/TemplateFunctionType';

export const IGroupedOptionsType = ObjectType.id(
    'Controls/meta:IGroupedOptionsType'
).attributes<IGroupedOptions>({
    groupProperty: StringType.optional(),
    groupTemplate: TemplateFunctionType,
});
