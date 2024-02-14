import { BooleanType, FunctionType, group, StringType, WidgetType, NullType } from 'Types/meta';
import { ICheckboxOptions } from 'Controls/checkbox';
import * as rk from 'i18n!Controls';

import { IControlOptionsType } from '../_interface/IControlOptionsType';
import { ICaptionOptionsType } from '../_interface/ICaptionOptionsType';
import { IIconOptionsType } from '../_interface/IIconOptionsType';
import { ITooltipOptionsType } from '../_interface/ITooltipOptionsType';
import { IIconSizeOptionsType } from '../_interface/IIconSizeOptionsType';
import { IIconStyleOptionsType } from '../_interface/IIconStyleOptionsType';
import { IFontColorStyleOptionsType } from '../_interface/IFontColorStyleOptionsType';
import { IContrastBackgroundOptionsType } from '../_interface/IContrastBackgroundOptionsType';
import { IBooleanNullType } from './IBooleanNullType';
import { ICheckboxSizeType } from './ICheckboxSizeType';
import { IViewModeType } from './IViewModeType';
import { IValidationStatusOptionsType } from '../_interface/IValidationStatusOptionsType';
import { ICaptionPositionType } from '../_interface/ICaptionPositionType';

export const CheckboxType = WidgetType.id('Controls/meta:Checkbox')
    .title(rk('Чекбокс'))
    .description(
        rk(
            'Графический контрол, позволяющий пользователю управлять параметром с двумя состояниями — включено и отключено.'
        )
    )
    .category(rk('Контролы'))
    .attributes<ICheckboxOptions>({
        ...group(rk('Текст'), {
            ...ICaptionOptionsType.attributes(),
            ...ITooltipOptionsType.attributes(),
            ...IFontColorStyleOptionsType.attributes(),
            captionPosition: ICaptionPositionType,
        }),
        ...group(rk('Внешний вид'), {
            ...IControlOptionsType.attributes(),
            ...IValidationStatusOptionsType.attributes(),
            contrastBackground: IContrastBackgroundOptionsType,
            triState: BooleanType.description(
                rk(
                    'Определяет, разрешено ли устанавливать чекбоксу третье состояние — "не определен" (null).'
                )
            ).optional(),
            horizontalPadding: StringType.title(rk('Горизонтальный внутренний отступ'))
                .description(rk('Горизонтальный внутренний отступ'))
                .optional(),
            size: ICheckboxSizeType.optional(),
            multiline: BooleanType.optional(),
            viewMode: IViewModeType.optional(),
        }),
        ...group(rk('Иконка'), {
            ...IIconOptionsType.attributes(),
            ...IIconSizeOptionsType.attributes(),
            ...IIconStyleOptionsType.attributes(),
        }),
        value: IBooleanNullType.description(
            rk('Значение, которое определяет текущее состояние.')
        ).optional(),
        resetValue: IBooleanNullType.description(rk('Предустановленное значение')).optional(),
        onClick: FunctionType.optional(),
        onKeyUp: FunctionType.optional(),

        '[Controls/_interface/IViewMode]': NullType,
    });
