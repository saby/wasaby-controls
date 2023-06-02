import * as rk from 'i18n!Controls';
import { WidgetType, group } from 'Types/meta';
import { IPhoneOptions } from 'Controls/input';
import { ISizeOptionsType } from '../_interface/ISizeOptionsType';
import { INameOptionsType } from '../_interface/INameOptionsType';
import { IPhoneOptionsType } from './IPhoneOptionsType';

export const InputPhoneType = WidgetType.id('Controls/meta:InputPhoneType')
    .title(rk('Поле ввода'))
    .attributes<IPhoneOptions>({
        ...group('', {
            ...IPhoneOptionsType.attributes(),
            field: INameOptionsType.order(1),
            onlyMobile: IPhoneOptionsType
                .attributes()
                .onlyMobile
                .order(2),
            placeholder: IPhoneOptionsType
                .attributes()
                .placeholder
                .order(3)
                .defaultValue('8 (800) 123-45-67'),
        }),
        ...group(' ', {
            contrastBackground: IPhoneOptionsType
                .attributes()
                .contrastBackground
                .order(4),
            ...ISizeOptionsType.attributes(),
        }),
    });
