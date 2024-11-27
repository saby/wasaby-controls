import type { selection } from '../types';
import type { CrudEntityKey } from 'Types/source';

/**
 * Конструктор действия, для отметки записи с помощью множественного выделения.
 * @function
 * @param {CrudEntityKey} key Ключ записи.
 * @param {'backward' | 'forward'} direction Направление движения при последовательной отметке записей.
 * @return selection.TSelectAction
 */
export const select = (
    key: CrudEntityKey,
    direction?: 'backward' | 'forward'
): selection.TSelectAction => ({
    type: 'select',
    payload: {
        key,
        direction,
    },
});

/**
 * Конструктор действия, для сброса текущей отметки записей.
 * @function
 * @return selection.TResetSelectionAction
 */
export const resetSelection = (): selection.TResetSelectionAction => ({
    type: 'resetSelection',
    payload: {},
});

/**
 * Конструктор действия, для отметки всех записей.
 * @function
 * @return selection.TSelectAllAction
 */
export const selectAll = (): selection.TSelectAllAction => ({
    type: 'selectAll',
    payload: {},
});

/**
 * Конструктор действия, для инверртирования состояния выбора записей.
 * @function
 * @return selection.TInvertSelectionAction
 */
export const invertSelection = (): selection.TInvertSelectionAction => ({
    type: 'invertSelection',
    payload: {},
});

/**
 * Конструктор действия, для установки новой модели выделенных элементов.
 */
export const setSelectionModel = (
    selectionModel: Map<CrudEntityKey, boolean | null>
): selection.TSetSelectionModelAction => ({
    type: 'setSelectionModel',
    payload: {
        selectionModel,
    },
});
