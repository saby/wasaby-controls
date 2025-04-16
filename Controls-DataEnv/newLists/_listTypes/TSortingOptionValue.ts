import { TSortingValue } from './TSorting';

/**
 *
 */
export type TSorting = Record<string, TSortingValue>;

/**
 *
 */
export type TSortingOptionValue = TSorting[] | TSorting;
