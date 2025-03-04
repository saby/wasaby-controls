import type { TKey } from 'Controls-DataEnv/interface';
import type { CrudEntityKey } from 'Types/source';

/**
 * Статус, определяющий выделен элемент или нет.
 */
export type TSelectionModelStatus = boolean | null;

/**
 * Модель выбранных элементов.
 */
export type TSelectionModel = Map<CrudEntityKey, TSelectionModelStatus>;

/**
 * Видимость чекбоксов.
 */
export type TMultiSelectVisibility = 'onhover' | 'hidden' | 'visible';

/**
 * Интерфейс состояния для работы с выделением в списке с любым типом интерактора(web/mobile).
 */
export interface ISelectionState {
    // TODO: Удалить.
    selectedKeys: TKey[];
    excludedKeys: TKey[];

    // TODO: Оставить только это
    selectionModel: TSelectionModel;
    /**
     * Видимость чекбоксов.
     * @variant visible Показать.
     * @variant hidden Скрыть.
     * @variant onhover Показывать при наведении.
     * @default onhover
     */
    multiSelectVisibility: TMultiSelectVisibility;
    lastCheckedKey?: TKey;
}
