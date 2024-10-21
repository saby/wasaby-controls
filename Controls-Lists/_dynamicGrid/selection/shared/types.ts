/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import { TColumnKey as TBaseColumnKey, TItemKey } from '../../shared/types';

export { TItemKey };
export type TColumnKey = TBaseColumnKey;
export type TColumnKeys = TColumnKey[];

export type TKeyPair = { itemKey: TItemKey; columnKey: TColumnKey };
