import {
    ArrayType,
    BooleanType,
    NumberType,
    ObjectType,
    StringType,
    UnionType,
} from 'Types/meta';
import { IBasePositionSourceConfig } from 'Controls/interface';
import { TNavigationDirectionType } from './TNavigationDirectionType';

export const IBasePositionSourceConfigType = ObjectType.id(
    'Controls/meta:IBasePositionSourceConfigType'
).attributes<IBasePositionSourceConfig>({
    position: UnionType.of([
        ArrayType.of(UnionType.of([StringType, NumberType])),
        StringType,
        NumberType,
    ]).optional(),
    direction: TNavigationDirectionType.optional(),
    limit: NumberType.optional(),
    multiNavigation: BooleanType.optional(),
});
