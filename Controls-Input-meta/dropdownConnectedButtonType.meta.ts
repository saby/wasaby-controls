import * as rk from 'i18n!Controls-Input';
import { group, WidgetType } from 'Meta/types';
import { ISelectorProps } from 'Controls-Input/dropdownConnected';
import {
    ICaptionTypeMeta,
    IIconOptionsType,
    ITooltipTypeMeta,
} from 'Controls-Input-meta/interface';
import * as FrameEditorInline from 'optional!FrameEditor/inline';
import { IItemsOptionsType } from 'Controls-Input-meta/interface';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;

/**
 * Мета-описание типа редактора {@link Controls-Input/dropdownConnected:Button dropdownConnected:Button}
 */
const dropdownConnectedSelectorTypeMeta = WidgetType.id('Controls-Input/dropdownConnected:Button')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title(rk('Кнопка с меню'))
    .description(rk('Кнопка с меню'))
    .category(rk('Базовые'))
    .icon('icon-ExpandList')
    .properties<ISelectorProps>({
        ...group('', {
            caption: ICaptionTypeMeta.order(10).optional().defaultValue(rk('Кнопка')),
            tooltip: ITooltipTypeMeta.order(20).optional(),
            ...IIconOptionsType.order(30).properties(),
        }),
        ...group(null, {
            ...IItemsOptionsType.order(40).properties(),
        }),
    });

InlineRegistrar?.register(dropdownConnectedSelectorTypeMeta.getId());

export default dropdownConnectedSelectorTypeMeta;
