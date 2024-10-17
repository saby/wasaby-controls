/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import { TOffsetSize } from 'Controls/interface';

const GAP_SIZES_MAP = {
    null: 0,
    '3xs': 2,
    '2xs': 4,
    xs: 6,
    s: 8,
    m: 12,
    l: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
};

export function getColumnGapSize(columnsSpacing: TOffsetSize | 'null'): number {
    const borderThickness = 1;
    if (!columnsSpacing) {
        return 0;
    }
    return Math.max(GAP_SIZES_MAP[columnsSpacing] + borderThickness, 0);
}
