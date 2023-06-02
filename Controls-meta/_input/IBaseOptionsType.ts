import { BooleanType, FunctionType, ObjectType, StringType } from 'Types/meta';
import { IBaseOptions } from 'Controls/input';
import { IBorderVisibilityOptionsType } from './IBorderVisibilityOptionsType';
import { ITextAlignType } from '../_interface/ITextAlignType';
import { IHeightOptionsType } from '../_interface/IHeightOptionsType';
import { ITooltipOptionsType } from '../_interface/ITooltipOptionsType';
import { IFontSizeOptionsType } from '../_interface/IFontSizeOptionsType';
import { TFontWeightType } from '../_interface/TFontWeightType';
import { IFontColorStyleOptionsType } from '../_interface/IFontColorStyleOptionsType';
import { IContrastBackgroundOptionsType } from '../_interface/IContrastBackgroundOptionsType';
import { IPlaceholderOptionsType } from '../_interface/IPlaceholderOptionsType';

export const IBaseOptionsType = ObjectType.id(
    'Controls/meta:IBaseOptionsType'
).attributes<IBaseOptions>({
    ...IBorderVisibilityOptionsType.attributes(),
    ...ITooltipOptionsType.attributes(),
    ...IHeightOptionsType.attributes(),
    ...IFontSizeOptionsType.attributes(),
    ...IFontColorStyleOptionsType.attributes(),
    ...IPlaceholderOptionsType.attributes(),
    tooltip: null,
    fontColorStyle: null,
    contrastBackground: IContrastBackgroundOptionsType,
    autoComplete: StringType.optional().hidden(),
    textAlign: ITextAlignType.optional().hidden(),
    selectOnClick: BooleanType.optional().hidden(),
    spellCheck: BooleanType.optional().hidden(),
    name: StringType.optional().hidden(),
    fontWeight: TFontWeightType.optional().hidden(),
    paste: FunctionType.arguments(StringType).optional().hidden(),
    bubbling: BooleanType.optional().hidden(),
});
