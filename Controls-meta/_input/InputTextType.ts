import * as rk from 'i18n!Controls';
import { WidgetType, group } from 'Types/meta';
import { ITextInputOptions } from 'Controls/input';
import { IContrastBackgroundOptionsType } from '../_interface/IContrastBackgroundOptionsType';
import { IPlaceholderOptionsType } from '../_interface/IPlaceholderOptionsType';
import { ISizeOptionsType } from '../_interface/ISizeOptionsType';
import { INameOptionsType } from '../_interface/INameOptionsType';

export const InputTextType = WidgetType.id('Controls/meta:InputTextType')
    .title(rk('Поле ввода'))
    .attributes<ITextInputOptions>({
        ...group('', {
            field: INameOptionsType.order(0),
            ...IPlaceholderOptionsType.attributes(),
            placeholder: IPlaceholderOptionsType.attributes()
                .placeholder.defaultValue(rk('Как к вам обращаться?'))
                .order(1),
        }),
        ...group(rk('Стиль'), {
            contrastBackground:
                IContrastBackgroundOptionsType.defaultValue(false),
            ...ISizeOptionsType.attributes(),
        }),
    });
