import { TSelectedKeys } from 'Controls/interface';
import { Meta, UnionType, ArrayType, NumberType, StringType, NullType } from 'Types/meta';

export const TSelectedKeysType: Meta<TSelectedKeys> = ArrayType.of(
    UnionType.of([NumberType, StringType, NullType])
);
