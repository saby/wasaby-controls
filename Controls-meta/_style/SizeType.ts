import { CSSProperties } from 'react';
import { ObjectType, StringType, NumberType, group, CSSType } from 'Meta/types';

import * as rk from 'i18n!Controls-meta';

export const WidthType = StringType.title(rk('Ширина')).optional();
export const HeightType = StringType.title(rk('Высота')).optional();
export const MaxWidthType = StringType.title(rk('Max ширина')).optional();
export const MaxHeightType = StringType.title(rk('Max высота')).optional();
export const MinWidthType = StringType.title(rk('Min ширина')).optional();
export const MinHeightType = StringType.title(rk('Min высота')).optional();
export const AspectRatioType = NumberType.optional();

const sizeProperties = {
    width: WidthType,
    height: HeightType,
    maxWidth: MaxWidthType,
    maxHeight: MaxHeightType,
    minWidth: MinWidthType,
    minHeight: MinHeightType,
    aspectRatio: AspectRatioType,
};

export const disabledWidthStylesProps = {
    width: CSSType.hidden(),
    minWidth: CSSType.hidden(),
    maxWidth: CSSType.hidden(),
};

export const disabledHeightStylesProps = {
    height: CSSType.hidden(),
    minHeight: CSSType.hidden(),
    maxHeight: CSSType.hidden(),
};

export const disabledSizeStylesProps = {
    ...disabledWidthStylesProps,
    ...disabledHeightStylesProps,
};

export const SizeType = ObjectType.properties({
    ...group(rk('Размер'), '', sizeProperties),
})
    .optional()
    .editor('Controls-editors/sizeEditor:ComplexSizeEditor');

export const getSizeType = (defaultValues: CSSProperties = {}): ObjectType => {
    const properties = {
        ...sizeProperties,
    };

    Object.keys(defaultValues).forEach((key) => {
        properties[key] = properties[key].defaultValue(defaultValues[key]);
    });

    return ObjectType.properties({ ...group(rk('Размер'), '', properties) })
        .optional()
        .editor('Controls-editors/sizeEditor:ComplexSizeEditor');
};
