import { THeaderForCtor } from 'Controls/baseGrid';

/**
 * Пересчитать колонки/ряды, занимаемые заголовками
 * @param header
 * @param headerIdx
 * @param offset
 */
export function recalculateColumnsHeader(
    header: THeaderForCtor,
    headerIdx: number,
    offset: number
) {
    for (let i = headerIdx; i < header.length; i++) {
        header[i] = { ...header[i], startColumn: header[i].startColumn - offset };
        header[i] = { ...header[i], endColumn: header[i].endColumn - offset };
    }
}
