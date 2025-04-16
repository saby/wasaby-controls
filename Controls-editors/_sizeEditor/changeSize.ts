import { ISplitResult, parseStyleValue, convertSizeToStyle } from './_utils/convert';
import {
    compareSize,
    joinSizeType,
    splitSizeType,
    getBaseSizeType,
    checkIsBaseSize,
    checkIsBaseUnit,
    getAdjacentSizeType,
} from './_utils/functions';
import { TValue, KeyUnits, SizeType, BaseSizes, LimitSizes, LimitSizePrefix } from './constants';

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
    const { width } = value;

    return changeSize(BaseSizes.width, width, { ...value, aspectRatio });
};
