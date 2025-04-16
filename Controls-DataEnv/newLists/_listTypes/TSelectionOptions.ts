import type { TSingleAxisDirection } from 'Controls-DataEnv/interface';

/**
 * Дополнительные опции выбора элемента
 * */
export type TSelectionOptions = {
    direction?: TSingleAxisDirection;
    isRangeSelection?: boolean;
};
