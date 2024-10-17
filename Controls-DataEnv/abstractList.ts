/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
export {
    // Конструкторы абстрактных действий.
    AbstractListActionCreators,
    // Тип действия, доступного в любом списке, объединяет все доступные действия
    TAbstractListAction,
    // Тип каждого действия, например TAbstractListActions.marker.TSetMarkedKeyAction
    type TAbstractListActions,
} from './newLists/_abstractList/actions';

// Слайс, его состояние и API.
export { AbstractListSlice } from './newLists/_abstractList/AbstractListSlice';
export { IAbstractListState } from './newLists/_abstractList/interface/IAbstractListState';
export { IAbstractListAPI } from './newLists/_abstractList/interface/IAbstractListAPI';

// Только для Controls/_listAspects/_expandCollapseListAspect/common/TExpansionModel.ts
// После удаления файла экспорт будет удален.
export { TExpansionModel as _private_TExpansionModel } from './newLists/_abstractList/interface/IState/IHierarchyState';
