import { ObjectType } from 'Types/meta';
import { IBaseTextInputOptions } from 'Controls/input';
import { ITextOptionsType } from './ITextOptionsType';
import { TInputModeType } from '../_input/TInputModeType';
import { IBaseInputOptionsType } from './IBaseInputOptionsType';

export const IBaseTextInputOptionsType =
    ObjectType.attributes<IBaseTextInputOptions>({
        ...IBaseInputOptionsType.attributes(),
        ...ITextOptionsType.attributes(),
        inputMode: TInputModeType.optional(),
    });
