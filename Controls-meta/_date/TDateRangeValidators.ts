import { ArrayType, FunctionType, UnionType } from 'Meta/types';
import { IValueValidatorObjectType } from '../_date/IValueValidatorObjectType';

export const TDateRangeValidators = UnionType.of([
    ArrayType.of(IValueValidatorObjectType),
    ArrayType.of(FunctionType),
]);
