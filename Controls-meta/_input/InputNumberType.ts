import * as rk from 'i18n!Controls';
import { WidgetType, group } from 'Types/meta';
import { INumberInputOptions } from 'Controls/input';
import { INumberLengthOptionsType } from './INumberLengthOptionsType';
import { IOnlyPositiveOptionsType } from './IOnlyPositiveOptionsType';
import { INameOptionsType } from '../_interface/INameOptionsType';
import { IPlaceholderOptionsType } from '../_interface/IPlaceholderOptionsType';
import { IContrastBackgroundOptionsType } from '../_interface/IContrastBackgroundOptionsType';
import { ISizeOptionsType } from '../_interface/ISizeOptionsType';
import { IUseGroupingOptionsType } from '../_interface/IUseGroupingOptionsType';

export const InputNumberType = WidgetType.id(
    'Controls/meta:InputNumberType'
).attributes<INumberInputOptions>({
    ...group('', {
        field: INameOptionsType.order(0),
        onlyPositive: IOnlyPositiveOptionsType.defaultValue(true).order(1),
        useGrouping: IUseGroupingOptionsType.defaultValue(true).order(2),
        ...INumberLengthOptionsType.attributes(),
        integersLength:
            INumberLengthOptionsType.attributes().integersLength.order(3),
        precision: INumberLengthOptionsType.attributes().precision.order(4),
        ...IPlaceholderOptionsType.attributes(),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(rk('1 2345.67'))
            .order(5),
    }),
    ...group(rk('Стиль'), {
        contrastBackground:
            IContrastBackgroundOptionsType.defaultValue(false).order(6),
        ...ISizeOptionsType.attributes(),
    }),
});
