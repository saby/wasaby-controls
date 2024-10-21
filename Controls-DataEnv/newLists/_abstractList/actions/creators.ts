/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import * as marker from './creators/marker';
import * as selection from './creators/selection';
import * as operationsPanel from './creators/operationsPanel';
import * as root from './creators/root';
import * as search from './creators/search';
import * as source from './creators/source';
import * as expandCollapse from './creators/expandCollapse';
import * as filter from './creators/filter';
import * as interactorCore from './creators/interactorCore';

/**
 * Конструкторы действий, доступные в любом списке, независимо от типа ViewModel, к которой он подключен (web/mobile).
 */
export const AbstractListActionCreators = {
    /**
     * Конструкторы действий ядра интерактивности.
     * @see https://online.sbis.ru/area/039c82f1-a0a3-4548-82d6-c9e1dbaf5de0 Зона Kaizen
     */
    interactorCore,

    /**
     * Конструкторы действий функционала "Отметка маркером".
     * @see https://online.sbis.ru/area/c233c9ee-01af-439d-a82f-85d6ef988869 Зона Kaizen
     */
    marker,

    /**
     * Конструкторы действий функционала "Отметка чекбоксом".
     * @see https://online.sbis.ru/area/02f42333-cf50-42e8-bc08-b451cc483285 Зона Kaizen
     */
    selection,

    /**
     * Конструкторы действий функционала "Взаимодействие с панелью массовых операций".
     * @see https://online.sbis.ru/area/ccc545f6-e213-4e99-bd2c-41421c3068b6 Зона Kaizen
     */
    operationsPanel,

    /**
     * Конструкторы действий функционала "Проваливание".
     * @see https://online.sbis.ru/area/f77b7722-2f7f-4c69-b029-a00480c0d33b Зона Kaizen
     */
    root,

    /**
     * Конструкторы действий функционала "Разворот и сворачивание узлов".
     * @see https://online.sbis.ru/area/4dc07e22-16bc-4793-9b70-c6819cf515fb Зона Kaizen
     */
    expandCollapse,

    /**
     * Конструкторы действий функционала "Фильтрация".
     * @see https://online.sbis.ru/area/849d2ba6-201e-467e-ae1a-d32fca6084bd Зона Kaizen
     */
    filter,

    /**
     * Конструкторы действий функционала "Взаимодействие с поиском".
     * @see https://online.sbis.ru/area/849d2ba6-201e-467e-ae1a-d32fca6084bd Зона Kaizen
     */
    search,

    /**
     * Конструкторы действий для работы ViewModel с источником данных.
     */
    source,
};
