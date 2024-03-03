import { ObjectType, StringType } from 'Meta/types';
import { ISelectorTemplate } from 'Controls/interface';
import { IStackPopupOptionsType } from '../_popup/IStackPopupOptionsType';

export const ISelectorTemplateType = ObjectType.id(
    'Controls/meta:ISelectorTemplateType'
).attributes<ISelectorTemplate>({
    templateName: StringType,
    templateOptions: ObjectType,
    popupOptions: IStackPopupOptionsType,
});
