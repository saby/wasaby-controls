/**
 * Библиотека, содержащая абстрактный интерактор любого списка.
 * Библиотека поставляет:
 * * базовые механики, которые могут быть имплементированы в любом списке;
 * * интерфейсы, на которые могут полагаться пользователи любого списочного интерактора.
 *
 * Подробнее о интеракторах написано в {@link https://n.sbis.ru/shared/disk/eebbf702-d40d-4d35-b55c-8b8793f99f3d документе}.
 * @library
 * @public
 * @module
 * @kaizenZone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
export {
    AbstractListActionCreators,
    /**
     * sdsdsd
     */
    type TAbstractListActions,
} from './newLists/_abstractList/actions';

// Загрузчик, типы фабрики, аргументов и т.п.
export { IAbstractListDataFactoryArguments } from './newLists/_abstractList/interface/factory/IAbstractListDataFactoryArguments';
export { IAbstractListDataFactoryLoadResult } from './newLists/_abstractList/interface/factory/IAbstractListDataFactoryLoadResult';
export { IAbstractListDataFactory } from './newLists/_abstractList/interface/factory/IAbstractListDataFactory';
export { abstractLoadData } from './newLists/_abstractList/abstractLoadData';

// Слайс, его состояние и API.
export { AbstractListSlice } from './newLists/_abstractList/AbstractListSlice';
export * as IAbstractListStateParts from './newLists/_abstractList/interface/IAbstractListStateParts';
export { IAbstractListState } from './newLists/_abstractList/interface/IAbstractListState';
export { IAbstractListAPI } from './newLists/_abstractList/interface/IAbstractListAPI';

//# region Не Использовать
// После удаления файла экспорт будет удален.
// Только для Controls/_listAspects/_expandCollapseListAspect/common/TExpansionModel.ts
export { TExpansionModel as _private_TExpansionModel } from './newLists/_abstractList/interface/IAbstractListStateParts/IHierarchyState';

// Только для  Controls/_dataFactory/AbstractList/_interface/IAbstractListSliceTypes.ts
export { TCollectionType as _private_TCollectionType } from './newLists/_abstractList/collection/types';

// Только для  Controls-DataEnv/newLists/_list/actions/types/complexUpdate.ts
export { TMiddlewaresPropsForMigrationToDispatcher as _private_TMiddlewaresPropsForMigrationToDispatcher } from './newLists/_abstractList/actions/types/complexUpdate';
//# endregion
