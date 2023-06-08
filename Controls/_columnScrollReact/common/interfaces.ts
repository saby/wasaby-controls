export interface IColumnScrollWidths {
    // Ширина контейнера таблицы.
    viewPortWidth: number;

    // Ширина контента таблицы.
    contentWidth: number;

    // Ширина скролируемой части таблицы.
    fixedWidth: number;
    // Остальное можно рассчитать из этих. Это делается в ./resources/helpers
}
