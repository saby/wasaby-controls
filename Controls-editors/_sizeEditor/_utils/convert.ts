import { KeyUnits, FIT_UNIT_STYLE, FILL_UNIT_STYLE } from '../constants';
import { IConstraint, constrainValue } from './constraint';

export interface ISplitResult {
    baseUnits: KeyUnits;
    baseSize: string;
}

export function parseStyleValue(value: string | number, units?: KeyUnits[]): ISplitResult | void {
    // TODO: для поддержки обратной совместимост
    // чтобы не падало из-за sizeUnits
    // @see ModuleEditor/_image/View.tsx sizeUnits
    if (typeof value === 'number') return { baseUnits: KeyUnits.fit };

    const match = value?.toString().match(/(\d+\.*\d*)(\D*)/);

    if (!match) {
        if (units?.length && !units.includes(KeyUnits.fit)) return;

        return {
            baseSize: value,
            baseUnits: KeyUnits.fit,
        };
    }

    if (value === FILL_UNIT_STYLE && (!units?.length || units.includes(KeyUnits.fill))) {
        return {
            baseSize: match[1],
            baseUnits: KeyUnits.fill,
        };
    }

    return {
        baseSize: match[1],
        baseUnits: match[2] as KeyUnits,
    };
}

// fix
export const convertSizeToStyle = (
    size: string,
    unit: KeyUnits,
    constrains?: Record<string, IConstraint>
): string => {
    if (unit === KeyUnits.fit) return FIT_UNIT_STYLE;

    if (unit === KeyUnits.fill) return FILL_UNIT_STYLE;

    return `${constrainValue(size, unit, constrains)}${unit}`;
};
