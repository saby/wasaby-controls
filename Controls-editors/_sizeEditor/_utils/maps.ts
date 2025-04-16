import { SizeType, BaseSizes, LimitSizes, KeyUnits } from '../constants';

import * as rk from 'i18n!Controls-editors';

export const keyUnitToStringMap = (unit: KeyUnits): string => {
    if (unit === KeyUnits.fit) return rk('По контенту');

    if (unit === KeyUnits.fill) return rk('Заполнить');

    return unit;
};

export const sizeTypeToStringMap = (type: SizeType): string => {
    switch (type) {
        case BaseSizes.width:
            return rk('Ширина');
        case BaseSizes.height:
            return rk('Высота');
        case LimitSizes.maxWidth:
            return rk('Max ширина');
        case LimitSizes.maxHeight:
            return rk('Max высота');
        case LimitSizes.minWidth:
            return rk('Min ширина');
        case LimitSizes.minHeight:
            return rk('Min высота');
    }
};
