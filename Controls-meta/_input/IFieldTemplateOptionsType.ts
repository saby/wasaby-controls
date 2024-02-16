import { ObjectType } from 'Meta/types';
import { IFieldTemplateOptions } from 'Controls/input';
import { TemplateFunctionType } from '../_interface/TemplateFunctionType';

export const IFieldTemplateOptionsType = ObjectType.id(
    'Controls/meta:IFieldTemplateOptionsType'
).attributes<IFieldTemplateOptions>({
    leftFieldTemplate: TemplateFunctionType.optional().hidden(),
    rightFieldTemplate: TemplateFunctionType.optional().hidden(),
});
