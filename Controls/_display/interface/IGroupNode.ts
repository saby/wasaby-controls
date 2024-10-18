/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
/**
 * Интерфейс записи дерева, которая может быть или не быть узлом-группой
 * @public
 */
export default interface IGroupNode {
    GroupNodeItem: boolean;
    /**
     * Возвращает true, если узел необходимо показать как группу.
     */
    isGroupNode(): boolean;
}
