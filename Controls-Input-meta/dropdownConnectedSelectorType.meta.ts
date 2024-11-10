import * as rk from 'i18n!Controls-Input';
import { extended, group, WidgetType } from 'Meta/types';
import { ISelectorProps } from 'Controls-Input/dropdownConnected';
import {
    ICheckboxRequiredOptionsType,
    IComboboxLabelOptionsType as ILabelOptionsType,
    IMultiSelectType,
    INameOptionsType,
    IPlaceholderOptionsType,
    ISizeOptionsType,
    IVisibleItemsCountType,
} from 'Controls-Input-meta/interface';
import * as FrameEditorInline from 'optional!FrameEditor/inline';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;

/**
 * Мета-описание типа редактора {@link Controls-Input/dropdownConnected:Selector dropdownConnected:Selector}
 */
const dropdownConnectedSelectorTypeMeta = WidgetType.id('Controls-Input/dropdownConnected:Selector')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title(rk('Список'))
    .description(rk('Выпадающий список'))
    .category(rk('Ввод данных'))
    .icon('icon-ExpandList')
    .properties<ISelectorProps>({
        name: INameOptionsType.order(0).required(),
        ...ILabelOptionsType.properties(),
        placeholder: IPlaceholderOptionsType.properties()
            .placeholder.defaultValue(rk('Выберите вариант'))
            .order(2),
        ...group('', {
            ...IMultiSelectType.properties(),
        }),
        ...extended(
            group(rk('Ограничения'), {
                ...ICheckboxRequiredOptionsType.properties(),
                ...IVisibleItemsCountType.properties(),
            })
        ),
    })
    .styles({
        ...group(rk('Стиль'), {
            ...ISizeOptionsType.properties(),
        }),
    });

InlineRegistrar?.register(dropdownConnectedSelectorTypeMeta.getId());

export default dropdownConnectedSelectorTypeMeta;
