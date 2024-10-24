/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
export {
    // Конструкторы абстрактных действий.
    AbstractListActionCreators,
    // Тип действия, доступного в любом списке, объединяет все доступные действия.
    // Тип каждого действия, например TAbstractListActions.marker.TSetMarkedKeyAction.
    // Все действия TAbstractListActions.TAnyAbstractAction
    type TAbstractListActions,
} from './newLists/_abstractList/actions';

// Загрузчик, типы фабрики, аргументов и т.п.
export { IAbstractListDataFactoryArguments } from './newLists/_abstractList/interface/factory/IAbstractListDataFactoryArguments';
export { IAbstractListDataFactoryLoadResult } from './newLists/_abstractList/interface/factory/IAbstractListDataFactoryLoadResult';
export { IAbstractListDataFactory } from './newLists/_abstractList/interface/factory/IAbstractListDataFactory';
export { abstractLoadData } from './newLists/_abstractList/abstractLoadData';

// Слайс, его состояние и API.
export { AbstractListSlice } from './newLists/_abstractList/AbstractListSlice';
export { IAbstractListState } from './newLists/_abstractList/interface/IAbstractListState';
export { IAbstractListAPI } from './newLists/_abstractList/interface/IAbstractListAPI';

//# region Не Использовать
// После удаления файла экспорт будет удален.
// Только для Controls/_listAspects/_expandCollapseListAspect/common/TExpansionModel.ts
export { TExpansionModel as _private_TExpansionModel } from './newLists/_abstractList/interface/IState/IHierarchyState';

// Только для  Controls/_dataFactory/AbstractList/_interface/IAbstractListSliceTypes.ts
export { TCollectionType as _private_TCollectionType } from './newLists/_abstractList/collection/types';
//# endregion
