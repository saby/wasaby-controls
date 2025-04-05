import { ISingleItem } from 'Controls-Graphs/base';

/**
 * @interface
 * @public
 */
export interface IHasDataCallback {
    hasDataCallback?: (data: ISingleItem[]) => boolean;
}
