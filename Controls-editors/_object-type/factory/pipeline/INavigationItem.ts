/**
 * Элемент навигации
 * @private
 */
export interface INavigationItem {
    id: string;
    name: string;
    parent: string | null;
    hasChild: boolean;
}
