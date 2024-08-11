import type { TVisibility as TBaseVisibility } from 'Controls/interface';

export type TVisibility = Extract<TBaseVisibility, 'visible' | 'hidden'> | 'onactivated';
