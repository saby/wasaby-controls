/**
 * @name Controls/_interface/TItemsOrder
 * @cfg {String} Определяет, будет ли отображение списка инвертировано.
 * @variant default По умолчанию.
 * @variant reverse Инвертированное отображение.
 * @default default
 * @remark
 * Инвертирование позволяет отобразить список в обратном направлении без изменения данных или логики бл.
 * Не путать с {@link https://wi.sbis.ru/page/autodoc-ts/Controls/scroll/Container/Property/initialScrollPosition initialScrollPosition}. Опция скролла позволяет опуститься в самый низ списка, но порядок данных остается таким же, тогда как при инвертированном отображении первая запись будет отображаться снизу, а последняя - сверху.
 */
export type TItemsOrder = 'reverse' | 'default';
