import { ObjectType, StringType } from 'Meta/types';
import { IInputDisplayValueOptions } from 'Controls/input';
import { TDateInputModeType } from '../_date/TDateInputModeType';

export const IInputDisplayValueOptionsType = ObjectType.attributes<IInputDisplayValueOptions>({
    displayValue: StringType.optional(),
    inputMode: TDateInputModeType.optional(),
});
