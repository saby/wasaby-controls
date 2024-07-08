import { group, WidgetType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';
import {
    IActionTypeMeta,
    ICaptionTypeMeta,
    IIconOptionsType,
    ITooltipTypeMeta,
} from 'Controls-Input-meta/interface';
import { IButtonProps } from 'Controls-Input/buttonConnected';
import * as FrameEditorInline from 'optional!FrameEditor/inline';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;

/**
 * Мета-описание кнопки  {@link Controls-Input/buttonConnected:Button Button}, работающей с контекстом
 */
const buttonConnectedButtonType = WidgetType.id('Controls-Input/buttonConnected:Button')
    .title(translate('Кнопка'))
    .description(
        translate('Виджет, который предоставляет пользователю возможность простого действий.')
    )
    .icon('icon-Button')
    .category(translate('Базовые'))
    .properties<IButtonProps>({
        ...group('', {
            caption: ICaptionTypeMeta.order(10).optional().defaultValue(translate('Название')),
            tooltip: ITooltipTypeMeta.order(20).optional(),
            ...IIconOptionsType.properties(),
        }),
        ...group(translate('Действие'), {
            action: IActionTypeMeta.order(30),
        }),
    });

const buttonConnectedButtonTypeMeta = Object.assign(buttonConnectedButtonType, {
    toolbarConfigurationCallback: (toolbarId) => {
        if (toolbarId === 'secondary') {
            return { enabled: true };
        }
    },
});

InlineRegistrar?.register(buttonConnectedButtonTypeMeta.getId());

export default buttonConnectedButtonTypeMeta;
