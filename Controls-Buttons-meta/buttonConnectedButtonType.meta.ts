import { WidgetType, group } from 'Types/meta';
import * as translate from 'i18n!Controls';
import { ICaptionTypeMeta } from './_interface/base/ICaptionTypeMeta';
import { IFontType } from './_interface/base/IFontTypeMeta';
import { ITooltipTypeMeta } from './_interface/base/ITooltipTypeMeta';
import { IIconOptionsType } from './_interface/base/IIconOptionsType';
import { IViewModeType } from './_interface/types/IViewModeType';
import { IButtonStyleType } from './_interface/base/IButtonStyleType';
import { ISizeTypeMeta } from './_interface/base/ISizeType';
import { IActionTypeMeta } from './_interface/IActionTypeMeta';

/**
 * Мета-описание кнопки  {@link Controls-Button/buttonConnected:Button Button}, работающей с контекстом
 */
const buttonConnectedButtonTypeMeta = WidgetType.id('Controls-Buttons/buttonConnected:Button')
    .title(translate('Кнопка'))
    .description(
        translate('Виджет, который предоставляет пользователю возможность простого действий.')
    )
    .category(translate('Базовые'))
    .attributes({
        ...group('', {
            caption: ICaptionTypeMeta.order(10),
            tooltip: ITooltipTypeMeta.order(20),
            ...IIconOptionsType.attributes(),
        }),
        ...group(translate('Действие'), {
            action: IActionTypeMeta.order(30),
        }),
        ...group(translate('Стиль'), {
            viewMode: IViewModeType.order(40),
            ...IButtonStyleType.attributes(),
            ...ISizeTypeMeta.attributes(),
        }),
    });

export default buttonConnectedButtonTypeMeta;
