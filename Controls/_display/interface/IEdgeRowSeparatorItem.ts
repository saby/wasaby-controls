/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
/**
 * Запись, которая учитывается при отображении разделителей у крайних записей списка.
 * Это может быть любая запись, кроме TreeNodeFooter, TreeGridNodeFooter, SearchSeparator, InvisibleItem
 * @private
 */
export default interface IEdgeRowSeparatorItem {
    readonly EdgeRowSeparatorItem: boolean;
}
