import * as rk from 'i18n!Controls';
import { WidgetType, group } from 'Types/meta';
import { ITextInputOptions } from 'Controls/input';
import { ISizeOptionsType } from '../_interface/ISizeOptionsType';
import { INameOptionsType } from '../_interface/INameOptionsType';
import { IContrastBackgroundOptionsType } from '../_interface/IContrastBackgroundOptionsType';
import { IPlaceholderOptionsType } from '../_interface/IPlaceholderOptionsType';

export const InputMoneyType = WidgetType.id('Controls/meta:InputMoneyType')
    .title(rk('Поле ввода'))
    .attributes<ITextInputOptions>({
        ...group('', {
            name: INameOptionsType.order(0),
            placeholder:
                IPlaceholderOptionsType.attributes().placeholder.defaultValue(
                    rk('123.00')
                ),
        }),
        ...group(' ', {
            contrastBackground: IContrastBackgroundOptionsType,
            ...ISizeOptionsType.attributes(),
        }),
    });
