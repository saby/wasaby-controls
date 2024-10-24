/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
// FIXME: Не должно быть так, нужно вынести контекст скролла и брать из него.
export const START_FIXED_PART_OBSERVER = 'ColumnScrollReact__contentObserver__fixedPartStart';
export const END_FIXED_PART_OBSERVER = 'ColumnScrollReact__contentObserver__fixedPartEnd';

export const AUTOSCROLL_TARGET = 'js-ControlsLists-dynamicGrid__autoScrollTarget';

export const DYNAMIC_GRID_CELL_BASE_CLASS_NAME = 'controlsLists_dynamicGrid__gridCell';

export const DYNAMIC_HEADER_PREFIX = '$DYNAMIC_HEADER_';
export const CLASS_DYNAMIC_HEADER_CELL = 'ControlsLists-dynamicGrid__dynamicHeaderCell';

export const DYNAMIC_FOOTER_PREFIX = '$DYNAMIC_FOOTER_';

// Расчётный z-index для скроллируемой колонки стики-шапки динамической таблицы
export const DYNAMIC_GRID_CELL_STICKIED_Z_INDEX = 4;

// Расчётный z-index для зафиксированной по горизонтали колонки стики-шапки динамической таблицы
export const DYNAMIC_GRID_CELL_FIXED_STICKIED_Z_INDEX = DYNAMIC_GRID_CELL_STICKIED_Z_INDEX + 1;
