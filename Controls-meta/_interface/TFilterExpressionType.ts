import { UnionType } from 'Meta/types';
import { IHashMapType } from './IHashMapType';
import { TFilterFunctionType } from './TFilterFunctionType';

export const TFilterExpressionType = UnionType.of([IHashMapType, TFilterFunctionType]);
