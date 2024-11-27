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
 * Интерфейс состояния для работы с выделением в списке с любым типом интерактора(web/mobile).
 */
export interface ISelectionState {
    // TODO: Удалить.
    selectedKeys: TKeysSelection;
    excludedKeys: TKeysSelection;

    // TODO: Оставить только это
    selectionModel: TSelectionModel;
    multiSelectVisibility: TMultiSelectVisibility;
}
