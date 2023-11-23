import * as rk from 'i18n!Controls';
import { WidgetType, group } from 'Types/meta';
import { IDateRangeInputOptions } from 'Controls/dateRange';
import { IContrastBackgroundOptionsType } from '../_interface/IContrastBackgroundOptionsType';
import { ISizeOptionsType } from '../_interface/ISizeOptionsType';
import { INameOptionsType } from '../_interface/INameOptionsType';
import { IPlaceholderOptionsType } from '../_interface/IPlaceholderOptionsType';
import { IDateMaskType } from '../_interface/IDateMaskType';
import { IDateRangeInputOptionsType } from './IDateRangeInputOptionsType';

export const InputDateRangeType = WidgetType.id('Controls/meta:InputDateRangeType')
    .title(rk('Поле ввода'))
    .attributes<IDateRangeInputOptions>({
        ...IDateRangeInputOptionsType.attributes(),
        ...group('', {
            startDateField: INameOptionsType.title(rk('Начало')).order(0),
            endDateField: INameOptionsType.title(rk('Окончание')).order(1),
            mask: IDateMaskType,
            placeholder: IPlaceholderOptionsType.attributes()
                .placeholder.defaultValue(rk('12.12.12'))
                .order(3),
        }),
        ...group(rk('Стиль'), {
            contrastBackground: IContrastBackgroundOptionsType.defaultValue(false).order(4),
            ...ISizeOptionsType.attributes(),
        }),
    });
