import { ObjectType, StringType } from 'Types/meta';
import { IItemTemplateOptions } from 'Controls/interface';
import { TemplateFunctionType } from './TemplateFunctionType';

export const IItemTemplateOptionsType = ObjectType.id(
    'Controls/meta:IItemTemplateOptionsType'
).attributes<IItemTemplateOptions>({
    itemTemplateProperty: StringType.optional(),
    itemTemplate: TemplateFunctionType,
});
