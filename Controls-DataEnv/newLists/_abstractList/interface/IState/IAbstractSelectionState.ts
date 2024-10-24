/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TKeysSelection } from 'Controls/interface';
import type { CrudEntityKey } from 'Types/source';

/**
 * Статус, определяющий выделен элемент или нет.
 */
type TSelectionModelStatus = boolean | null;

/**
 * Модель выбранных элементов.
 */
type TSelectionModel = Map<CrudEntityKey, TSelectionModelStatus>;

/**
 * Видимость чекбоксов.
 */
export type TMultiSelectVisibility = 'onhover' | 'hidden' | 'visible';

/**
 * Интерфейс состояния для работы с выделением.
 */
export interface IAbstractSelectionState {
    // TODO: Удалить.
    selectedKeys?: TKeysSelection;
    excludedKeys?: TKeysSelection;

    // TODO: Оставить только это
    selectionModel?: TSelectionModel;
    multiSelectVisibility?: TMultiSelectVisibility;
}
