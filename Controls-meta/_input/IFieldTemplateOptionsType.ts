import { ObjectType } from 'Types/meta';
import { IFieldTemplateOptions } from 'Controls/input';
import { TemplateFunctionType } from '../_interface/TemplateFunctionType';

export const IFieldTemplateOptionsType = ObjectType.id(
    'Controls/meta:IFieldTemplateOptionsType'
).attributes<IFieldTemplateOptions>({
    leftFieldTemplate: TemplateFunctionType.optional(),
    rightFieldTemplate: TemplateFunctionType.optional(),
});
