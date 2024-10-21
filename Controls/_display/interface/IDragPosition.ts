/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
export interface IDragPosition<T> {
    index: number;
    position?: 'after' | 'before' | 'on';
    dispItem: T;
}
