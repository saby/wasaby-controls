import { BooleanType, FunctionType, ObjectType, StringType } from 'Types/meta';
import { IBaseOptions } from 'Controls/input';
import { IContrastBackgroundOptionsType } from '../_interface/IContrastBackgroundOptionsType';
import { IBorderVisibilityOptionsType } from './IBorderVisibilityOptionsType';
import { ITextAlignType } from '../_interface/ITextAlignType';
import { IHeightOptionsType } from '../_interface/IHeightOptionsType';
import { ITooltipOptionsType } from '../_interface/ITooltipOptionsType';
import { IFontSizeOptionsType } from '../_interface/IFontSizeOptionsType';
import { TFontWeightType } from '../_interface/TFontWeightType';
import { IFontColorStyleOptionsType } from '../_interface/IFontColorStyleOptionsType';

export const IBaseOptionsType = ObjectType.id(
    'Controls/meta:IBaseOptionsType'
).attributes<IBaseOptions>({
    ...IBorderVisibilityOptionsType.attributes(),
    ...ITooltipOptionsType.attributes(),
    ...IHeightOptionsType.attributes(),
    ...IFontSizeOptionsType.attributes(),
    ...IFontColorStyleOptionsType.attributes(),
    contrastBackground: IContrastBackgroundOptionsType,
    autoComplete: StringType.optional(),
    textAlign: ITextAlignType.optional(),
    selectOnClick: BooleanType.optional(),
    spellCheck: BooleanType.optional(),
    name: StringType.optional(),
    fontWeight: TFontWeightType.optional(),
    paste: FunctionType.arguments(StringType).optional(),
    bubbling: BooleanType.optional(),
});
