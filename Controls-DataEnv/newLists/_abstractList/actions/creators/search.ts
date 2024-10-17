/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { search } from '../types';

/**
 * Конструктор действия, для сброса текущего поиска.
 * @function
 * @return search.TResetSearchAction
 */
export const resetSearch = (): search.TResetSearchAction => ({
    type: 'resetSearch',
    payload: {},
});

/**
 * Тип действий функционала "Взаимодействие с поиском", доступные в любом списке,
 * независимо от типа ViewModel, к которой он подключен (web/mobile).
 *
 * @see https://online.sbis.ru/area/f130be62-b200-4fde-931d-1f32e77a39a4 Зона Kaizen
 */
export type TSearchActions = search.TResetSearchAction;
