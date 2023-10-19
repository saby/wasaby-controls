import { group, WidgetType } from 'Types/meta';
import * as translate from 'i18n!Controls';
import {
    IActionTypeMeta,
    IButtonStyleType,
    ICaptionTypeMeta,
    IIconOptionsType,
    ISizeTypeMeta,
    ITooltipTypeMeta,
    IViewModeType
} from './interface';

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
