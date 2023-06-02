import * as rk from 'i18n!Controls';
import { BooleanType, group, WidgetType, StringType } from 'Types/meta';
import { IRadioGroupOptions } from 'Controls/RadioGroup';

import { IControlOptionsType } from '../_interface/IControlOptionsType';
import { ISingleSelectableOptionsType } from '../_interface/ISingleSelectableOptionsType';
import { IHierarchyOptionsType } from '../_interface/IHierarchyOptionsType';
import { IToggleGroupOptionsType } from '../_toggle/IToggleGroupOptionsType';
import { ISourceOptionsType } from '../_interface/ISourceOptionsType';
import { RecordSetType } from '../_interface/RecordSetType';
import { IStartEndPositionType } from '../_interface/IStartEndPositionType';

export const RadioGroupType = WidgetType.id('Controls/meta:RadioGroupType')
    .title(rk('Группа радио кнопок'))
    .description(
        rk(
            'Группа контролов, которые предоставляют пользователям возможность выбора между двумя или более параметрами.'
        )
    )
    .category(rk('Контролы'))
    .attributes<IRadioGroupOptions>({
        ...group(rk('Внешний вид'), {
            ...IControlOptionsType.attributes(),
            ...ISingleSelectableOptionsType.attributes(),
            ...IHierarchyOptionsType.attributes(),
            ...ISourceOptionsType.attributes(),
            ...IToggleGroupOptionsType.attributes(),

            captionPosition: IStartEndPositionType.title(
                rk('Расположение заголовка')
            ).description(
                rk('Определяет, с какой стороны расположен заголовок кнопки.')
            ),
            radioCircleVisible: BooleanType.description(
                rk('Определяет, видимость иконки радиокруга.')
            ).optional(),
            items: RecordSetType,
            multiline: BooleanType.optional(),
            itemClassName: StringType.optional(),
        }),
    });
