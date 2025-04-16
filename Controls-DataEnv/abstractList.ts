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
//# region Действия
export {
    /**
     * Конструкторы действий, доступные в любом списке, независимо от типа ViewModel, к которой он подключен (web/mobile).
     */
    AbstractListActionCreators,
    /**
     * Тип действия, доступного в любом списке, независимо от типа ViewModel, к которой он подключен (web/mobile).
     */
    type TAbstractListActions,
} from './newLists/_abstractList/actions';
//# endregion Действия

//# region === middleware типы ===
export { TAbstractListMiddleware } from './newLists/_abstractList/types/TAbstractListMiddleware';
export {
    TAbstractListMiddlewareContext,
    TAbstractListMiddlewareContextGetter,
    TListMiddlewareContextExtension,
} from './newLists/_abstractList/types/TAbstractListMiddlewareContext';
//# endregion  === middleware типы ===

//# region Загрузчик, типы фабрики, аргументов и т.п.
export { IAbstractListDataFactoryArguments } from './newLists/_abstractList/interface/factory/IAbstractListDataFactoryArguments';
export { IAbstractListDataFactoryLoadResult } from './newLists/_abstractList/interface/factory/IAbstractListDataFactoryLoadResult';
export { IAbstractListDataFactory } from './newLists/_abstractList/interface/factory/IAbstractListDataFactory';
export { abstractLoadData } from './newLists/_abstractList/abstractLoadData';
//# endregion Загрузчик, типы фабрики, аргументов и т.п.

//# region Слайс, его состояние и API
export { AbstractListSlice } from './newLists/_abstractList/AbstractListSlice';
export * as IAbstractListStateParts from './newLists/_abstractList/interface/IAbstractListStateParts';
export { IAbstractListState } from './newLists/_abstractList/interface/IAbstractListState';
export { IAbstractListAPI } from './newLists/_abstractList/interface/IAbstractListAPI';
//# endregion Слайс, его состояние и API

//# region Переиспользуемые в других интеракторах сущности.
export { Initializer } from './newLists/_abstractList/Initializer';

export { resolveCollectionType } from './newLists/_abstractList/collection/utils/getCollectionType';
export { TCollectionType } from './newLists/_abstractList/collection/types';
export { default as getError } from './newLists/_abstractList/utils/getError';
export { default as eventRaisingMuteWrapper } from './newLists/_abstractList/utils/eventRaisingMuteWrapper';
export {
    TItemsChange,
    ChangeAction,
    TListChangeSource,
} from './newLists/_abstractList/interface/IAbstractListStateParts/IItemsState';
//# endregion Переиспользуемые в других интеракторах сущности.

//# region Не использовать

// Только для Controls-DataEnv/newLists/_list/middlewares/complexUpdate.ts
export * as _private_DecomposedPromise from './newLists/_abstractList/utils/DecomposedPromise';

//# region === утилиты ===
export { default as _private_extractUtil } from './newLists/_abstractList/collection/factory/extract';
export * as _private_predicates from './newLists/_abstractList/validators/predicates';
//# endregion === утилиты ===

//# region === валидаторы ===
// Только для Controls/_listWebReducers/itemActions.ts
export { isValidActions as _private_isValidActions } from './newLists/_abstractList/validators/actions';
//# endregion === валидаторы ===
//# endregion
