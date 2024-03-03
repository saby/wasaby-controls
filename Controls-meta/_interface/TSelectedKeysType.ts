import { TSelectedKeys } from 'Controls/interface';
import { Meta, UnionType, ArrayType, NumberType, StringType, NullType } from 'Meta/types';

export const TSelectedKeysType: Meta<TSelectedKeys> = ArrayType.of(
    UnionType.of([NumberType, StringType, NullType])
);
