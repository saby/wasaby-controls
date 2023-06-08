/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
export interface IDragPosition<T> {
    index: number;
    position?: 'after' | 'before' | 'on';
    dispItem: T;
}
