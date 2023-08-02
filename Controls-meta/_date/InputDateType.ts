import * as rk from 'i18n!Controls';
import { WidgetType, group } from 'Types/meta';
import { IDateInput } from 'Controls/date';
import { IContrastBackgroundOptionsType } from '../_interface/IContrastBackgroundOptionsType';
import { ISizeOptionsType } from '../_interface/ISizeOptionsType';
import { INameOptionsType } from '../_interface/INameOptionsType';
import { IPlaceholderOptionsType } from '../_interface/IPlaceholderOptionsType';
import { IDateInputOptionsType } from './IDateInputOptionsType';

export const InputDateType = WidgetType.id('Controls/meta:InputDateType')
    .title(rk('Поле ввода'))
    .attributes<IDateInput>({
        ...IDateInputOptionsType.attributes(),
        ...group('', {
            field: INameOptionsType.order(0),
            mask: IDateInputOptionsType.attributes().mask.order(1),
            placeholder: IPlaceholderOptionsType.attributes()
                .placeholder.defaultValue(rk('12.12.12'))
                .order(3),
        }),
        ...group(rk('Стиль'), {
            contrastBackground: IContrastBackgroundOptionsType.defaultValue(false).order(4),
            ...ISizeOptionsType.attributes(),
        }),
    });
