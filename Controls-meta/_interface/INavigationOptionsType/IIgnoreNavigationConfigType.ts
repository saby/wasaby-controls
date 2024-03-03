import { ArrayType, ObjectType, StringType, UnionType } from 'Meta/types';
import { INavigationPositionSourceConfig } from 'Controls/interface';
import { IBasePositionSourceConfigType } from './IBasePositionSourceConfigType';

export const IIgnoreNavigationConfigType = ObjectType.id(
    'Controls/meta:IIgnoreNavigationConfigType'
).attributes<INavigationPositionSourceConfig>({
    ...IBasePositionSourceConfigType.attributes(),
    field: UnionType.of([ArrayType.of(StringType), StringType]),
});
