import type { IBaseDataFactoryArguments } from 'Controls-DataEnv/dataFactory';
import type { TCollectionType } from '../../collection/types';
import type { TViewMode } from 'Controls-DataEnv/interface';

/**
 * Интерфейс аргументов абстрактной фабрики данных списка.
 */
export interface IAbstractListDataFactoryArguments extends IBaseDataFactoryArguments {
    collectionType?: TCollectionType;

    viewMode?: TViewMode;

    // Только пока существует старая LoadData.
    // Это не для прикладного использования.
    // По этому флагу платформа отличает новейшие списки от всех остальных.
    // Должно быть удалено из аргументов и оставлено только в результатах фабрики.
    isLatestInteractorVersion?: boolean;
}
