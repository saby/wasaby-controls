/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
export {
    // Конструкторы действий в web списке.
    ListActionCreators,
    // Тип действия, доступного в web списке, объединяет все доступные действия
    TListAction,
    // Тип каждого действия, например TListActions.marker.TActivateMarkerAction
    type TListActions,
} from './newLists/_list/actions';

// Только для Controls/_dataFactory/ListWebDispatcher/actions/TAbstractComplexUpdateAction.ts
// После удаления файла экспорт будет удален.
export { TAbstractComplexUpdateAction as _private_TAbstractComplexUpdateAction } from './newLists/_list/actions/types/TAbstractComplexUpdateAction';
