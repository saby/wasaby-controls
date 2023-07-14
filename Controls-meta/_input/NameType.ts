import * as rk from 'i18n!Controls';
import { WidgetType, group } from 'Types/meta';
import { ITextInputOptions } from 'Controls/input';
import { ISizeOptionsType } from '../_interface/ISizeOptionsType';
import { INameType } from '../_interface/INameType';
import { IBaseTextInputOptionsType } from './IBaseTextInputOptionsType';
import { IFieldTemplateOptionsType } from './IFieldTemplateOptionsType';

interface INameInputOptions extends ITextInputOptions {
    nameField: object;
    surnameField: object;
    patronymicField: object;
}

export const NameType = WidgetType.id('Controls/meta:InputFioType')
    .title(rk('Поле ввода'))
    .attributes<INameInputOptions>({
        ...IBaseTextInputOptionsType.attributes(),
        ...IFieldTemplateOptionsType.attributes(),
        ...group('', {
            nameField: INameType.title('Фамилия').order(0),
            surnameField: INameType.title('Имя').order(1),
            patronymicField: INameType.title('Отчество').order(2),
        }),
        ...group(' ', {
            contrastBackground: IBaseTextInputOptionsType.attributes().contrastBackground.order(3),
            ...ISizeOptionsType.attributes(),
        }),
    });
