export enum KeyUnits {
    pixel = 'px',
    percent = '%',
    fit = 'fit',
    fill = 'fill',
}
export const BASE_UNITS = [KeyUnits.pixel, KeyUnits.percent];
export const ALL_UNITS = Object.values(KeyUnits);

export enum BaseSizes {
    width = 'width',
    height = 'height',
}
export enum LimitSizes {
    minWidth = 'minWidth',
    maxWidth = 'maxWidth',
    minHeight = 'minHeight',
    maxHeight = 'maxHeight',
}
export enum LimitSizePrefix {
    min = 'min',
    max = 'max',
}

export type TValue = {
    width: string;
    height: string;
    maxWidth?: string;
    maxHeight?: string;
    minWidth?: string;
    minHeight?: string;
    aspectRatio?: number;
};
export type SizeType = BaseSizes | LimitSizes;

export const BASE_SIZE_TYPES: BaseSizes[] = Object.values(BaseSizes);
export const LIMIT_SIZE_TYPES: LimitSizes[] = Object.values(LimitSizes);
export const ALL_SIZE_TYPES: SizeType[] = Object.values({ ...BaseSizes, ...LimitSizes });
export const DEFAULT_ASPECT_RATIO = 16 / 9;

export const DEFAULT_RADIX = 10;
export const FILL_UNIT_STYLE = '100%';
export const FIT_UNIT_STYLE = 'auto';
