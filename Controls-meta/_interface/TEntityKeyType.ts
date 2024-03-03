import { Meta, NumberType, StringType, UnionType } from 'Meta/types';
import { CrudEntityKey } from 'Types/source';

export const TEntityKeyType: Meta<CrudEntityKey> = UnionType.of([NumberType, StringType]);
