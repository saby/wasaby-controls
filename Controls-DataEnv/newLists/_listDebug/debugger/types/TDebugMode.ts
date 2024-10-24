/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
/**
 * @typedef {String} TDebugMode Режимы отладки списочного слайса
 * @variant DevMax Наиболее полная отладочная информация.
 * @variant Dev Отладочная информация, без логирования незначительных действий.
 * Незначительные действия это те действия, в результате
 * обработки которых состояние никак не изменялось.
 * @variant DevMin Аналогично Dev, но вывод осуществляется в укороченной
 * нотации (сокращено текстовое описание без потери смысла).
 * @variant Time Режим отладки производительности слайса. Выводится только время обновления.
 * @variant Changes Режим отладки изменения состояния слайса.
 * @variant State Аналогично Dev, но дополнительно выводятся
 * модификации внутренних состояний Slice(состояния при распространении действий).
 */
export type TDebugMode = 'Dev' | 'DevMin' | 'DevMax' | 'Time' | 'State' | 'Changes';
