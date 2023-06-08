import * as rk from 'i18n!Controls';
import { WidgetType, group } from 'Types/meta';
import { IAreaOptions } from 'Controls/input';
import { ISizeOptionsType } from '../_interface/ISizeOptionsType';
import { INameOptionsType } from '../_interface/INameOptionsType';
import { IFieldTemplateOptionsType } from './IFieldTemplateOptionsType';
import { IAreaOptionsType } from './IAreaOptionsType';

export const InputAreaType = WidgetType.id('Controls/meta:InputAreaType')
    .title(rk('Поле ввода'))
    .attributes<IAreaOptions>({
        ...IAreaOptionsType.attributes(),
        ...IFieldTemplateOptionsType.attributes(),
        ...group('', {
            field: INameOptionsType.order(0),
            minLines: IAreaOptionsType.attributes()
                .minLines.title(rk('Минимум'))
                .defaultValue(3)
                .order(1),
            maxLines: IAreaOptionsType.attributes()
                .maxLines.title(rk('Максимум'))
                .defaultValue(4)
                .order(2),
            placeholder: IAreaOptionsType.attributes()
                .placeholder.defaultValue(rk('Полезная подсказка'))
                .order(3),
        }),
        ...group(rk('Стиль'), {
            contrastBackground: IAreaOptionsType.attributes()
                .contrastBackground.defaultValue(false)
                .order(4),
            ...ISizeOptionsType.attributes(),
        }),
    });
