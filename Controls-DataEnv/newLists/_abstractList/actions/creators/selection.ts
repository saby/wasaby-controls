import type { selection } from '../types';
import type { TSingleAxisDirection } from 'Controls-DataEnv/interface';
import type { CrudEntityKey } from 'Types/source';
import type { TSelectionModel } from '../../interface/IAbstractListStateParts/ISelectionState';
import aCreator from './_actionCreator';

/**
 * Конструктор действия, для отметки записи с помощью множественного выделения.
 */
export const select = (
    key: CrudEntityKey,
    direction?: TSingleAxisDirection
): selection.TSelectAction =>
    aCreator('select', {
        key,
        direction,
    });

/**
 * Конструктор действия, для сброса текущей отметки записей.
 */
export const resetSelection = (): selection.TResetSelectionAction => aCreator('resetSelection');

/**
 * Конструктор действия, для отметки всех записей.
 */
export const selectAll = (): selection.TSelectAllAction => aCreator('selectAll');

/**
 * Конструктор действия, для инвертирования состояния выбора записей.
 */
export const invertSelection = (): selection.TInvertSelectionAction => aCreator('invertSelection');

/**
 * Конструктор действия, для установки новой модели выделенных элементов.
 */
export const setSelectionModel = (
    selectionModel: TSelectionModel
): selection.TSetSelectionModelAction =>
    aCreator('setSelectionModel', {
        selectionModel,
    });
