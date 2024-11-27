import type { TSortingOptionValue } from 'Controls/interface';

/**
 * Определяет, будет ли отображение списка инвертировано.
 * @variant default По умолчанию.
 * @variant reverse Инвертированное отображение.
 */
export type TItemsOrder = 'reverse' | 'default';

/**
 * Интерфейс состояния для работы с сортировкой в списке с любым типом интерактора(web/mobile).
 */
export interface ISortingState {
    /**
     * Определяет, будет ли отображение списка инвертировано.
     * @remark
     * Инвертирование позволяет отобразить список в обратном направлении без изменения данных или логики бл.
     *
     * **Не путать с {@link https://wi.sbis.ru/page/autodoc-ts/Controls/scroll/Container/Property/initialScrollPosition initialScrollPosition}.**
     *
     * Опция скролла позволяет опуститься в самый низ списка, но порядок данных остается таким же, тогда как при инвертированном
     * отображении первая запись будет отображаться снизу, а последняя - сверху.
     * @default default
     */
    itemsOrder: TItemsOrder;

    sorting?: TSortingOptionValue;
}
