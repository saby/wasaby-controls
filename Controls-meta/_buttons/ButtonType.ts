import * as rk from 'i18n!Controls';
import { group, WidgetType, StringType } from 'Meta/types';
import { IButtonOptions } from 'Controls/buttons';
import { ICaptionOptionsType } from '../_interface/ICaptionOptionsType';
import { IIconOptionsType } from '../_interface/IIconOptionsType';
import { IFontSizeOptionsType } from '../_interface/IFontSizeOptionsType';
import { ITooltipOptionsType } from '../_interface/ITooltipOptionsType';
import { IActionOptionsType } from '../_interface/IActionOptionsType';
import { ISizeOptionsType } from '../_interface/ISizeOptionsType';
import { IButtonStyleType } from './IButtonStyleType';
import { IViewModeType } from './IViewModeType';

export const ButtonType = WidgetType.id('Controls/meta:ButtonType')
    .title(rk('Кнопка'))
    .description(
        rk(
            'Графический контрол, который предоставляет пользователю возможность простого запуска события при нажатии на него.'
        )
    )
    .category(rk('Контролы'))
    .attributes<IButtonOptions>({
        ...group(rk('Текст'), {
            ...ICaptionOptionsType.attributes(),
            ...IFontSizeOptionsType.attributes(),
            ...ITooltipOptionsType.attributes(),
            caption: ICaptionOptionsType.attributes().caption.defaultValue(rk('Кнопка')).order(0),
            tooltip: ITooltipOptionsType.attributes().tooltip.order(1),
            ...IIconOptionsType.attributes(),
        }),
        ...group(rk('Действие'), {
            onClick: IActionOptionsType.attributes().onClick.order(2),
        }),
        ...group(rk('Стиль'), {
            viewMode: IViewModeType.optional(),
            ...IButtonStyleType.attributes(),
            ...ISizeOptionsType.attributes(),
        }),
    });
