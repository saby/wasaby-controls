import { UnionType } from 'Types/meta';
import { IHashMapType } from './IHashMapType';
import { TFilterFunctionType } from './TFilterFunctionType';

export const TFilterExpressionType = UnionType.of([
    IHashMapType,
    TFilterFunctionType,
]);
