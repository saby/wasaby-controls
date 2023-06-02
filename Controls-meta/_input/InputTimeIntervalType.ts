import * as rk from 'i18n!Controls';
import { WidgetType, group } from 'Types/meta';
import { ITextInputOptions } from 'Controls/input';
import { ISizeOptionsType } from '../_interface/ISizeOptionsType';
import { INameOptionsType } from '../_interface/INameOptionsType';
import { ITimeIntervalType } from '../_interface/ITimeIntervalType';
import { IBaseTextInputOptionsType } from './IBaseTextInputOptionsType';
import { IFieldTemplateOptionsType } from './IFieldTemplateOptionsType';

export const InputTimeIntervalType = WidgetType.id(
    'Controls/meta:InputTimeIntervalType'
)
    .title(rk('Поле ввода'))
    .attributes<ITextInputOptions>({
        ...IBaseTextInputOptionsType.attributes(),
        ...IFieldTemplateOptionsType.attributes(),
        ...group('', {
            field: INameOptionsType.order(0),
            mask: ITimeIntervalType.order(2),
            placeholder: IBaseTextInputOptionsType
                .attributes()
                .placeholder.defaultValue(rk('12:00'))
                .order(3),
        }),
        ...group(rk('Стиль'), {
            contrastBackground: IBaseTextInputOptionsType
                .attributes()
                .contrastBackground
                .defaultValue(false)
                .order(4),
            ...ISizeOptionsType.attributes(),
        }),
    });
