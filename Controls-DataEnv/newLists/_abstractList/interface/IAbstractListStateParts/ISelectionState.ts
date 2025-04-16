import type { TKey } from 'Controls-DataEnv/interface';
import type { CrudEntityKey } from 'Types/source';

/**
 * Статус, определяющий выделен элемент или нет.
 */
export type TSelectionModelStatus = boolean | null;

/**
 * Тип модели выбранных элементов
 */
export type TSelectionModel = Map<CrudEntityKey, TSelectionModelStatus>;

/**
 * Видимость чекбоксов.
 */
export type TMultiSelectVisibility = 'onhover' | 'hidden' | 'visible';

/**
 * Интерфейс состояния для работы с {@link /doc/platform/developmentapl/interface-development/controls/list/actions/multiselect/ множественным выделением} в списке с любым типом интерактора(web/mobile).
 */
export interface ISelectionState {
    /**
     * Набор ключей выбранных элементов
     * @default []
     * @remark
     * Чтобы {@link /doc/platform/developmentapl/interface-development/controls/list/actions/multiselect/select/#all выбрать все элементы}, необходимо в selectedKeys передать значение <b>[null]</b>.
     * @see excludedKeys
     */
    // TODO: Удалить.
    selectedKeys: TKey[];

    /**
     * Набор ключей исключенных элементов
     * @default []
     * @remark
     * Узел будет отмечен как частично выбранный, если ключ любого из его дочерних элементов находится в excludedKeys.
     * Такие узлы обычно отображаются с флагом в неопределенном состоянии рядом с ними.
     * @see selectedKeys
     */
    // TODO: Удалить.
    excludedKeys: TKey[];

    /**
     * Модель выбранных элементов
     * @private
     */
    // TODO: Оставить только это
    selectionModel: TSelectionModel;

    /**
     * Видимость чекбоксов
     * @variant visible Показать.
     * @variant hidden Скрыть.
     * @variant onhover Показывать при наведении.
     * @default onhover
     */
    multiSelectVisibility: TMultiSelectVisibility;

    /**
     * Название поля в item по которому можно определить видимость чекбокса
     */
    multiSelectAccessibilityProperty?: string;

    /**
     * НЕ ДЛЯ ПРИКЛАДНОГО ИСПОЛЬЗОВАНИЯ.
     * -
     * Состояние исключительно для внутреннего использования и может быть удалено/изменено в любое время.
     * Никакой поддержки и обратной совместимости не запланировано.
     * @private
     */
    lastCheckedKey?: TKey;
}
