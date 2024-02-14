/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
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
