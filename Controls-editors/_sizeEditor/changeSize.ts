import {
    KeyUnits,
    ISplitResult,
    BASE_UNITS,
    parseStyleValue,
    convertSizeToStyle,
} from './SizeEditorField';
import {
    TValue,
    SizeType,
    BaseSizes,
    LimitSizes,
    LimitSizePrefix,
    ALL_SIZE_TYPES,
} from './constants';

export type TParsedSize = {
    width: ISplitResult;
    height: ISplitResult;
    maxWidth?: ISplitResult;
    maxHeight?: ISplitResult;
    minWidth?: ISplitResult;
    minHeight?: ISplitResult;
};
export type TSplitSizeType = {
    baseSizeType: BaseSizes;
    limitPrefix?: LimitSizePrefix;
};

export const checkIsBaseSize = (type: SizeType) => type in BaseSizes;
export const checkIsBaseUnit = (unit: KeyUnits) => BASE_UNITS.includes(unit);
const compareSize = (a: ISplitResult, operator: '<' | '>' | '=', b: ISplitResult) => {
    if (a.baseUnits !== b.baseUnits) return false;

    const aSize = +a.baseSize;
    const bSize = +b.baseSize;

    if (operator === '<') return aSize < bSize;

    if (operator === '>') return aSize > bSize;

    if (operator === '=') return aSize === bSize;

    return false;
};
const getAdjacentBaseSizeType = (type: BaseSizes): BaseSizes => {
    if (type === BaseSizes.width) return BaseSizes.height;

    return BaseSizes.width;
};
const getOppositeLimitPrefix = (limit: LimitSizePrefix): LimitSizePrefix => {
    if (limit === LimitSizePrefix.max) return LimitSizePrefix.min;

    return LimitSizePrefix.max;
};
// TODO: split тупое название
const splitSizeType = (type: SizeType): TSplitSizeType => {
    const params = (type || '').toLowerCase().match(/^(max|min)?(height|width)$/i);

    // TODO: выглядит не очень надежно
    if (!params) return { baseSizeType: type as BaseSizes };

    return {
        baseSizeType: params[2] as BaseSizes,
        limitPrefix: params[1] as LimitSizePrefix,
    };
};
const joinSizeType = (params: TSplitSizeType): SizeType => {
    const { baseSizeType, limitPrefix } = params;

    if (!limitPrefix) return baseSizeType;

    return `${limitPrefix}${baseSizeType[0].toUpperCase()}${baseSizeType.slice(1)}` as SizeType;
};
const getAdjacentSizeType = (type: SizeType): SizeType => {
    const { baseSizeType, limitPrefix } = splitSizeType(type);

    return joinSizeType({
        baseSizeType: getAdjacentBaseSizeType(baseSizeType),
        limitPrefix: limitPrefix && getOppositeLimitPrefix(limitPrefix),
    });
};
const getOppositeSizeType = (type: LimitSizes): LimitSizes => {
    const { baseSizeType, limitPrefix } = splitSizeType(type);

    return joinSizeType({
        baseSizeType,
        limitPrefix: limitPrefix && getOppositeLimitPrefix(limitPrefix),
    }) as LimitSizes;
};
const getBaseSizeType = (type: SizeType): BaseSizes => {
    const { baseSizeType } = splitSizeType(type);

    return baseSizeType;
};
const parseSizes = (value: TValue): TParsedSize =>
    ALL_SIZE_TYPES.reduce((acc, sizeType) => {
        const { [sizeType]: sizeValue } = value || {};

        if (!sizeValue) return acc;

        return { ...acc, [sizeType]: parseStyleValue(sizeValue) };
    }, {});
// TODO: тут специально сделано так, что единицы измерения меняются, если надо сохранить пропорции
const correctAspectRatio = (type: SizeType, size: ISplitResult, value: TValue): TValue => {
    const { aspectRatio } = value;

    if (!aspectRatio || !checkIsBaseUnit(size.baseUnits)) return value;

    const adjacentType = getAdjacentSizeType(type);
    const adjacentSize = parseStyleValue(value[adjacentType]) as ISplitResult;
    const aspectSize = Math.round(
        getBaseSizeType(type) === BaseSizes.width
            ? +size.baseSize / aspectRatio
            : +size.baseSize * aspectRatio
    );
    const adjacentSizeValue =
        Math.abs(aspectSize - +adjacentSize.baseSize) > 1 ? aspectSize : +adjacentSize.baseSize;

    return {
        ...value,
        [type]: convertSizeToStyle(size.baseSize, size.baseUnits),
        [adjacentType]: convertSizeToStyle(adjacentSizeValue.toString(), size.baseUnits),
    };
};
const correctBaseSizes = (type: BaseSizes, size: ISplitResult, value: TValue) => {
    const sizeStyle = convertSizeToStyle(size.baseSize, size.baseUnits);
    const maxSizeType = joinSizeType({ baseSizeType: type, limitPrefix: LimitSizePrefix.max });
    const minSizeType = joinSizeType({ baseSizeType: type, limitPrefix: LimitSizePrefix.min });
    const maxSizeValue = value[maxSizeType];
    const minSizeValue = value[minSizeType];
    const changes: Partial<TValue> = {};

    if (maxSizeValue) {
        const maxSize = parseStyleValue(maxSizeValue);

        changes[maxSizeType] = compareSize(size, '>', maxSize) ? sizeStyle : maxSizeValue;
    }

    if (minSizeValue) {
        const minSize = parseStyleValue(minSizeValue);

        changes[minSizeType] = compareSize(size, '<', minSize) ? sizeStyle : minSizeValue;
    }

    return {
        ...value,
        ...changes,
    };
};
const correctLimitSizes = (type: LimitSizes, size: ISplitResult, value: TValue) => {
    const sizeStyle = convertSizeToStyle(size.baseSize, size.baseUnits);
    const { baseSizeType, limitPrefix } = splitSizeType(type);
    const baseSizeValue = value[baseSizeType];
    const baseSize = parseStyleValue(baseSizeValue);
    const compareOp = limitPrefix === LimitSizePrefix.max ? '>' : '<';

    return {
        ...value,
        [baseSizeType]: compareSize(baseSize, compareOp, size) ? sizeStyle : baseSizeValue,
    };
};
const correctSizes = (type: SizeType, size: ISplitResult, value: TValue): TValue => {
    if (!checkIsBaseUnit(size.baseUnits)) return value;

    if (checkIsBaseSize(type)) {
        return correctBaseSizes(type, size, value);
    }

    return correctLimitSizes(type, size, value);
};

const getSizeChanges = (initialValue: TValue, changedValue: TValue) => {
    return Object.entries(initialValue).reduce((changes, [key, value]) => {
        if (changedValue[key] === value) return changes;

        return { ...changes, [key]: changedValue[key] };
    }, {});
};
export const changeSize = (type: SizeType, size: string, value: TValue): TValue => {
    const { aspectRatio } = value || {};
    const newValue = { ...value, [type]: size };
    const parsedSize = parseStyleValue(size) as ISplitResult;
    const isBaseSizeType = checkIsBaseSize(type);
    const isBaseSizeUnit = checkIsBaseUnit(parsedSize.baseUnits);

    let updatedValue = { ...value, [type]: size };

    if (type === BaseSizes.width && aspectRatio) {
        updatedValue = correctAspectRatio(type, parsedSize, updatedValue);

        // TODO: временно, после дорабатываться будет и этого не должно быть
        updatedValue = { ...updatedValue, height: 'auto' };
    }

    if (type === BaseSizes.height && parsedSize.baseUnits !== KeyUnits.fit) {
        updatedValue = { ...updatedValue, aspectRatio: 0 };
    }

    updatedValue = correctSizes(type, parsedSize, updatedValue);

    const changes = Object.entries(getSizeChanges(newValue, updatedValue));

    if (!changes.length) return updatedValue;

    return changes.reduce(
        (acc, [sizeType, sizeValue]) => changeSize(sizeType, sizeValue, acc),
        updatedValue
    );
};

export const changeAspectRatio = (aspectRatio: number, value: TValue): TValue => {
    const { width, height } = value;
    const parsedWidth = parseStyleValue(width) as ISplitResult;
    const parsedHeight = parseStyleValue(height) as ISplitResult;

    return changeSize(BaseSizes.width, width, { ...value, aspectRatio });
};
