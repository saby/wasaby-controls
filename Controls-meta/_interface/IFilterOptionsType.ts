import { ObjectType } from 'Meta/types';
import { IFilterOptions } from 'Controls/interface';
import { TFilterExpressionType } from './TFilterExpressionType';

export const IFilterOptionsType = ObjectType.id(
    'Controls/meta:IFilterOptionsType'
).attributes<IFilterOptions>({
    filter: TFilterExpressionType,
});
