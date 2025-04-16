import { ISplitResult } from './convert';
import {
    KeyUnits,
    SizeType,
    BaseSizes,
    LimitSizes,
    LimitSizePrefix,
    BASE_UNITS,
} from '../constants';

export type TSplitSizeType = {
    baseSizeType: BaseSizes;
    limitPrefix?: LimitSizePrefix;
};

export const checkIsBaseSize = (type: SizeType) => type in BaseSizes;

export const checkIsBaseUnit = (unit: KeyUnits) => ![KeyUnits.fill, KeyUnits.fit].includes(unit);

export const compareSize = (a: ISplitResult, operator: '<' | '>' | '=', b: ISplitResult) => {
    if (a.baseUnits !== b.baseUnits) return false;

    const aSize = +a.baseSize;
    const bSize = +b.baseSize;

    if (operator === '<') return aSize < bSize;

    if (operator === '>') return aSize > bSize;

    if (operator === '=') return aSize === bSize;

    return false;
};

export const getAdjacentBaseSizeType = (type: BaseSizes): BaseSizes => {
    if (type === BaseSizes.width) return BaseSizes.height;

    return BaseSizes.width;
};

export const getOppositeLimitPrefix = (limit: LimitSizePrefix): LimitSizePrefix => {
    if (limit === LimitSizePrefix.max) return LimitSizePrefix.min;

    return LimitSizePrefix.max;
};

// TODO: split тупое название
export const splitSizeType = (type: SizeType): TSplitSizeType => {
    const params = (type || '').toLowerCase().match(/^(max|min)?(height|width)$/i);

    // TODO: выглядит не очень надежно
    if (!params) return { baseSizeType: type as BaseSizes };

    return {
        baseSizeType: params[2] as BaseSizes,
        limitPrefix: params[1] as LimitSizePrefix,
    };
};

export const joinSizeType = (params: TSplitSizeType): SizeType => {
    const { baseSizeType, limitPrefix } = params;

    if (!limitPrefix) return baseSizeType;

    return `${limitPrefix}${baseSizeType[0].toUpperCase()}${baseSizeType.slice(1)}` as SizeType;
};

export const getAdjacentSizeType = (type: SizeType): SizeType => {
    const { baseSizeType, limitPrefix } = splitSizeType(type);

    return joinSizeType({
        baseSizeType: getAdjacentBaseSizeType(baseSizeType),
        limitPrefix: limitPrefix && getOppositeLimitPrefix(limitPrefix),
    });
};
export const getOppositeSizeType = (type: LimitSizes): LimitSizes => {
    const { baseSizeType, limitPrefix } = splitSizeType(type);

    return joinSizeType({
        baseSizeType,
        limitPrefix: limitPrefix && getOppositeLimitPrefix(limitPrefix),
    }) as LimitSizes;
};
export const getBaseSizeType = (type: SizeType): BaseSizes => {
    const { baseSizeType } = splitSizeType(type);

    return baseSizeType;
};
