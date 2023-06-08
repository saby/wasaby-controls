import { BooleanType, ObjectType } from 'Types/meta';
import { ISelectorDialogOptions } from 'Controls/interface';
import { ISelectorTemplateType } from './ISelectorTemplateType';

export const ISelectorDialogOptionsType = ObjectType.id(
    'Controls/meta:ISelectorDialogOptionsType'
).attributes<ISelectorDialogOptions>({
    selectorTemplate: ISelectorTemplateType,
    isCompoundTemplate: BooleanType.optional(),
});
