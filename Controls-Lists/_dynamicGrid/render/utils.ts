const DYNAMIC_COLUMNS_CELL_CLASS_PREFIX =
    'js-ControlsLists-dynamicGrid__dynamicColumn';

export function getDateClassName(date: Date): string {
    const d = date.getDate();
    const m = date.getMonth();
    const y = date.getFullYear();

    return `${DYNAMIC_COLUMNS_CELL_CLASS_PREFIX}_${d}-${m}-${y}`;
}
