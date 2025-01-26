/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
/**
 * Запись, которая учитывается при отображении разделителей у крайних записей списка.
 * Это может быть любая запись, кроме TreeNodeFooter, TreeGridNodeFooter, SearchSeparator, InvisibleItem
 * @private
 */
export default interface IEdgeRowSeparatorItem {
    readonly EdgeRowSeparatorItem: boolean;
}
