import * as rk from 'i18n!Controls';
import { ObjectType, StringType } from 'Types/meta';
import { IToggleGroupOptions } from 'Controls/interface';
import { TemplateFunctionOrStringType } from '../_interface/TemplateFunctionOrStringType';
import { TDirectionType } from '../_interface/TDirectionType';

export const IToggleGroupOptionsType = ObjectType.id(
    'Controls/meta:IToggleGroupOptionsType'
).attributes<IToggleGroupOptions>({
    direction: TDirectionType.optional(),
    itemTemplate: TemplateFunctionOrStringType.description(
        rk('Шаблон для рендеринга элемента.')
    ).optional(),
    itemTemplateProperty: StringType.description(
        rk(
            'Имя свойства элемента, которое содержит шаблон для рендеринга элемента.'
        )
    ).optional(),
});
