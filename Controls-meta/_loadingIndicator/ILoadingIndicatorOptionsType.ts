import { ArrayType, BooleanType, NumberType, ObjectType, StringType, UnionType } from 'Meta/types';
import { ILoadingIndicatorOptions } from 'Controls/LoadingIndicator';
import { IControlOptionsType } from '../_interface/IControlOptionsType';

export const ILoadingIndicatorOptionsType = ObjectType.id(
    'Controls/meta:ILoadingIndicatorOptionsType'
).attributes<ILoadingIndicatorOptions>({
    ...IControlOptionsType.attributes(),
    delay: NumberType.optional(),
    message: StringType.optional(),
    mods: UnionType.of([ArrayType.of(StringType), StringType]).optional(),
    overlay: StringType.optional(),
    scroll: StringType.optional(),
    small: StringType.optional(),
    isGlobal: BooleanType.optional(),
    id: StringType.optional(),
    visible: BooleanType.optional(),
});
