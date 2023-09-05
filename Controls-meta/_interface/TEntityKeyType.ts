import { Meta, NumberType, StringType, UnionType } from 'Types/meta';
import { CrudEntityKey } from 'Types/source';

export const TEntityKeyType: Meta<CrudEntityKey> = UnionType.of([NumberType, StringType]);
