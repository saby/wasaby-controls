import { ArrayType, FunctionType, UnionType } from 'Types/meta';
import { IValueValidatorObjectType } from '../_date/IValueValidatorObjectType';

export const TDateRangeValidators = UnionType.of([
    ArrayType.of(IValueValidatorObjectType),
    ArrayType.of(FunctionType),
]);
