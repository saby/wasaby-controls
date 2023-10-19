import * as rk from 'i18n!Controls';
import { WidgetType, group } from 'Types/meta';
import { IMoneyOptions } from 'Controls/input';
import { ISizeOptionsType } from '../_interface/ISizeOptionsType';
import { INameOptionsType } from '../_interface/INameOptionsType';
import { IMoneyOptionsType } from './IMoneyOptionsType';

export const InputMoneyType = WidgetType.id('Controls/meta:InputMoneyType')
    .title(rk('Поле ввода'))
    .attributes<IMoneyOptions>({
        ...IMoneyOptionsType.attributes(),
        ...group('', {
            field: INameOptionsType.order(0),
            placeholder: IMoneyOptionsType.attributes().placeholder.defaultValue(rk('Введите сумму')),
        }),
        ...group(' ', {
            contrastBackground: IMoneyOptionsType.attributes().contrastBackground.order(1),
            ...ISizeOptionsType.attributes(),
        }),
    });
