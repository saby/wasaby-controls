import { group, WidgetType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';
import {
    IActionTypeMeta,
    ICaptionTypeMeta,
    IIconOptionsType,
    ITooltipTypeMeta,
} from 'Controls-Input-meta/interface';

/**
 * Мета-описание кнопки  {@link Controls-Input/buttonConnected:Button Button}, работающей с контекстом
 */
const buttonConnectedButtonTypeMeta = WidgetType.id('Controls-Input/buttonConnected:Button')
    .title(translate('Кнопка'))
    .description(
        translate('Виджет, который предоставляет пользователю возможность простого действий.')
    )
    .category(translate('Базовые'))
    .attributes({
        ...group('', {
            caption: ICaptionTypeMeta.order(10).optional().defaultValue(translate('Название')),
            tooltip: ITooltipTypeMeta.order(20).optional(),
            ...IIconOptionsType.attributes(),
        }),
        ...group(translate('Действие'), {
            action: IActionTypeMeta.order(30),
        }),
    });

export default buttonConnectedButtonTypeMeta;
