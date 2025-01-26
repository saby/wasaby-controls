import { group, WidgetType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';
import {
    IActionTypeMeta,
    IBaseConntectedButtonPropsMetaType,
    IStyleType,
} from 'Controls-Input-meta/interface';
import { IButtonProps } from 'Controls-Input/buttonConnected';
import * as FrameEditorInline from 'optional!FrameEditor/inline';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;

/**
 * Мета-описание кнопки  {@link Controls-Input/buttonConnected:Button Button}, работающей с контекстом
 */
const buttonConnectedButtonType = WidgetType.id('Controls-Input/buttonConnected:Button')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .devguide(
        '/doc/platform/developmentapl/interface-development/controls/input-elements/widgets-buttons-switches/widget-buttons/'
    )
    .title(translate('Кнопка'))
    .description(
        translate('Виджет, который предоставляет пользователю возможность простого действий.')
    )
    .icon('icon-Button')
    .category(translate('Базовые'))
    .properties<IButtonProps>({
        ...group(null, {
            action: IActionTypeMeta.order(5),
        }),
        ...IBaseConntectedButtonPropsMetaType.properties(),
    })
    .designtimeEditor('Controls-Input/buttonConnected:DesigntimeEditor')
    .appendStyles({
        ...group(translate('Стиль'), '', {
            ...IStyleType.properties(),
        }),
    });

InlineRegistrar?.register(buttonConnectedButtonType.getId());

export default buttonConnectedButtonType;
