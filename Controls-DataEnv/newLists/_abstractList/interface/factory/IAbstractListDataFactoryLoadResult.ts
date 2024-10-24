/**
 * Интерфейс результата загрузки абстрактной фабрики данных списка.
 */
export interface IAbstractListDataFactoryLoadResult {
    // По этому флагу платформа отличает новейшие списки от всех остальных.
    isLatestInteractorVersion: boolean;
}
