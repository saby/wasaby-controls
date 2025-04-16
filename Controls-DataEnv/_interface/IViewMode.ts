/**
 * Значение возможных режимов отображения списка.
 */
export const validViewMode = [
    'search',
    'tile',
    'table',
    'list',
    'composite',
    'searchTile',
] as const;
/**
 * Тип возможных режимов отображения списка.
 */
export type TViewMode = (typeof validViewMode)[number];
