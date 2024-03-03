import { TColumnKey as TBaseColumnKey, TItemKey } from '../../shared/types';

export { TItemKey };
export type TColumnKey = TBaseColumnKey;
export type TColumnKeys = TColumnKey[];

export type TKeyPair = { itemKey: TItemKey; columnKey: TColumnKey };
