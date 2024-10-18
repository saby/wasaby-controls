/**
 * @kaizen_zone 2b102d0c-fd4d-4044-be66-780184ba4e71
 */
import { TNavigationResetButtonMode } from 'Controls/interface';

/**
 * @typedef Controls/_paging/interface/IArrowState/TArrowStateVisibility
 * @description Варианты значений для видимости кнопок в пэйджинге.
 */
export type TArrowStateVisibility = 'visible' | 'hidden' | 'readonly';

/**
 * @typedef Controls/_paging/interface/IArrowState/TResetButtonState
 * @description Варианты значений для видимости кнопки возврата к начальной позиции.
 */
export type TResetButtonState = TNavigationResetButtonMode | 'hidden';

/**
 * Интерфейс настройки видимости кнопок в пэйджинге.
 * @public
 */
export interface IArrowState {
    /**
     * Кнопка "Переход в начало".
     */
    begin: TArrowStateVisibility;

    /**
     * Кнопка "Переход к предыдущей странице".
     */
    prev: TArrowStateVisibility;

    /**
     * Кнопка "Переход к следующей странице".
     */
    next: TArrowStateVisibility;

    /**
     * Кнопка "Переход в конец".
     */
    end: TArrowStateVisibility;

    /**
     * Кнопка возврата к начальной позиции.
     */
    reset?: TResetButtonState;
}
