import * as rk from 'i18n!Controls';
import { WidgetType, group } from 'Types/meta';
import { ITextInputOptions } from 'Controls/input';
import { ISizeOptionsType } from '../_interface/ISizeOptionsType';
import { IContrastBackgroundOptionsType } from '../_interface/IContrastBackgroundOptionsType';
import { INameType } from '../_interface/INameType';

export const NameType = WidgetType.id('Controls/meta:InputFioType')
    .title(rk('Поле ввода'))
    .attributes<ITextInputOptions>({
        ...group('', {
            name: INameType.defaultValue().title('Фамилия').order(0),
            surname: INameType.defaultValue().title('Имя').order(1),
            patronymic: INameType.defaultValue().title('Отчество').order(2),
        }),
        ...group(' ', {
            contrastBackground: IContrastBackgroundOptionsType,
            ...ISizeOptionsType.attributes(),
        }),
    });
