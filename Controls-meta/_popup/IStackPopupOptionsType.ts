import { BooleanType, NumberType, ObjectType, StringType } from 'Types/meta';
import { IStackPopupOptions } from 'Controls/popup';
import { IBasePopupOptionsType } from './IBasePopupOptionsType';

export const IStackPopupOptionsType = ObjectType.id(
    'Controls/meta:IStackPopupOptionsType'
).attributes<IStackPopupOptions>({
    ...IBasePopupOptionsType.attributes(),
    asyncShow: BooleanType.optional(),
    maximized: BooleanType.optional(),
    hasDefaultStackTemplate: BooleanType.optional(),
    workspaceWidth: NumberType.optional(),
    minimizedWidth: NumberType.optional(),
    minWidth: NumberType.optional(),
    width: NumberType.optional(),
    maxWidth: NumberType.optional(),
    propStorageId: StringType.optional(),
    restrictiveContainer: StringType.optional(),
    stackPosition: StringType.optional(),
});
