import { KeyUnits } from '../constants';

export interface IConstraint {
    min: number;
    max: number;
}

export const DEFAULT_CONSTRAINT = { min: 0, max: Infinity };
export const DEFAULT_CONSTRAINTS: Record<KeyUnits.pixel | KeyUnits.percent, IConstraint> = {
    [KeyUnits.pixel]: DEFAULT_CONSTRAINT,
    [KeyUnits.percent]: DEFAULT_CONSTRAINT,
};

export const constrainValue = (
    value: string,
    unit: string,
    constraints: Record<string, IConstraint>
): string => {
    if (!constraints?.[unit]) return value;

    const { min, max } = constraints?.[unit];

    if (+value < min) {
        return min.toString();
    }

    if (+value > max) {
        return max.toString();
    }

    return value;
};
