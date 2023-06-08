import * as rk from 'i18n!Controls';
import { WidgetType, group } from 'Types/meta';
import { ITextInputOptions } from 'Controls/input';
import { IContrastBackgroundOptionsType } from '../_interface/IContrastBackgroundOptionsType';
import { ISizeOptionsType } from '../_interface/ISizeOptionsType';
import { INameOptionsType } from '../_interface/INameOptionsType';
import { IPlaceholderOptionsType } from '../_interface/IPlaceholderOptionsType';
import { ITimeIntervalType } from '../_interface/ITimeIntervalType';

export const InputTimeIntervalType = WidgetType.id(
    'Controls/meta:InputTimeIntervalType'
)
    .title(rk('Поле ввода'))
    .attributes<ITextInputOptions>({
        ...group('', {
            field: INameOptionsType.order(0),
            mask: ITimeIntervalType.order(2),
            placeholder: IPlaceholderOptionsType.attributes()
                .placeholder.defaultValue(rk('12:00'))
                .order(3),
        }),
        ...group(rk('Стиль'), {
            contrastBackground:
                IContrastBackgroundOptionsType.defaultValue(false).order(4),
            ...ISizeOptionsType.attributes(),
        }),
    });
