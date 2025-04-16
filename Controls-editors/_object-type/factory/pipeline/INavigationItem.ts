/**
 * Элемент навигации
 * @private
 */
export interface INavigationItem {
    id: string | undefined;
    name: string | undefined;
    parent: string | null;
    hasChild: boolean;
}
