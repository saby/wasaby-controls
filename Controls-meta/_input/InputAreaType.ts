import * as rk from 'i18n!controls';
import { WidgetType, group } from 'Types/meta';
import { ITextInputOptions } from 'Controls/input';
import { IContrastBackgroundOptionsType } from '../_interface/IContrastBackgroundOptionsType';
import { ISizeOptionsType } from '../_interface/ISizeOptionsType';
import { INameOptionsType } from '../_interface/INameOptionsType';
import { IPlaceholderOptionsType } from '../_interface/IPlaceholderOptionsType';
import { ILengthStringType } from '../_interface/ILengthStringType';

export const InputAreaType = WidgetType.id('Controls/meta:InputAreaType')
    .title(rk('Поле ввода'))
    .attributes<ITextInputOptions>({
        ...group('', {
            field: INameOptionsType.order(0),
            minLines: ILengthStringType.title(rk('Минимум'))
                .defaultValue(3)
                .order(1),
            maxLines: ILengthStringType.title(rk('Максимум'))
                .defaultValue(4)
                .order(2),
            ...IPlaceholderOptionsType.attributes(),
            placeholder: IPlaceholderOptionsType.attributes()
                .placeholder.defaultValue(rk('Полезная подсказка'))
                .order(3),
        }),
        ...group(rk('Стиль'), {
            contrastBackground:
                IContrastBackgroundOptionsType.defaultValue(false).order(4),
            ...ISizeOptionsType.attributes(),
        }),
    });
