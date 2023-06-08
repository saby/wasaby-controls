import * as rk from 'i18n!Controls';
import { WidgetType, group } from 'Types/meta';
import { ITextInputOptions } from 'Controls/input';
import { ISizeOptionsType } from '../_interface/ISizeOptionsType';
import { INameOptionsType } from '../_interface/INameOptionsType';
import { IContrastBackgroundOptionsType } from '../_interface/IContrastBackgroundOptionsType';
import { IPlaceholderOptionsType } from '../_interface/IPlaceholderOptionsType';
import { IPhoneType } from '../_interface/IPhoneType';
import { IFlagType } from '../_interface/IFlagType';

export const InputPhoneType = WidgetType.id('Controls/meta:InputPhoneType')
    .title(rk('Поле ввода'))
    .attributes<ITextInputOptions>({
        ...group('', {
            name: INameOptionsType.order(1),
            onlyMobile: IPhoneType.order(2),
            ...IFlagType.attributes(),
            placeholder:
                IPlaceholderOptionsType.attributes().placeholder.defaultValue(
                    '8 (800) 123-45-67'
                ),
        }),
        ...group(' ', {
            contrastBackground: IContrastBackgroundOptionsType,
            ...ISizeOptionsType.attributes(),
        }),
    });
