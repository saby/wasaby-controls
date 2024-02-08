import * as rk from 'i18n!Controls';
import { WidgetType, group } from 'Meta/types';
import { ITextInputOptions } from 'Controls/input';
import { ISizeOptionsType } from '../_interface/ISizeOptionsType';
import { INameOptionsType } from '../_interface/INameOptionsType';
import { IBaseTextInputOptionsType } from './IBaseTextInputOptionsType';
import { IFieldTemplateOptionsType } from './IFieldTemplateOptionsType';

export const InputTextType = WidgetType.id('Controls/meta:InputTextType')
    .title(rk('Поле ввода'))
    .attributes<ITextInputOptions>({
        ...IBaseTextInputOptionsType.attributes(),
        ...IFieldTemplateOptionsType.attributes(),
        ...group('', {
            field: INameOptionsType.order(0),
            placeholder: IBaseTextInputOptionsType.attributes()
                .placeholder.defaultValue(rk('Как к вам обращаться?'))
                .order(1),
        }),
        ...group(rk('Стиль'), {
            contrastBackground:
                IBaseTextInputOptionsType.attributes().contrastBackground.defaultValue(false),
            ...ISizeOptionsType.attributes(),
        }),
    });
