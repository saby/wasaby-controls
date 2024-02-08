import * as rk from 'i18n!Controls-Input';
import { extended, group, WidgetType } from 'Meta/types';
import { IComboboxProps } from 'Controls-Input/ComboboxConnected';
import {
    ICheckboxRequiredOptionsType,
    IComboboxLabelOptionsType as ILabelOptionsType,
    IMultiSelectType,
    INameOptionsType,
    IPlaceholderOptionsType,
    IVisibleItemsCountType,
    TComboboxVariantsType,
} from 'Controls-Input-meta/interface';
import * as FrameEditorInline from 'optional!FrameEditor/inline';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;

/**
 * Мета-описание типа редактора {@link Controls-Input/ComboboxConnected ComboboxConnected}
 */
const ComboboxConnectedTypeMeta = WidgetType.id('Controls-Input/ComboboxConnected')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title(rk('Список'))
    .devguide(
        '/doc/platform/developmentapl/interface-development/controls/input-elements/buttons-switches/new-switches/'
    )
    .description(rk('Выпадающий список'))
    .category(rk('Ввод данных'))
    .icon('icon-ExpandList')
    .attributes<IComboboxProps>({
        name: INameOptionsType.order(0).required(),
        ...ILabelOptionsType.attributes(),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(rk('Выберите вариант'))
            .order(2),
        ...group('Варианты', {
            ...TComboboxVariantsType.attributes(),
        }),
        ...group('', {
            ...IMultiSelectType.attributes(),
        }),
        ...extended(
            group(rk('Ограничения'), {
                ...ICheckboxRequiredOptionsType.attributes(),
                ...IVisibleItemsCountType.attributes(),
            })
        ),
    });

InlineRegistrar?.register(ComboboxConnectedTypeMeta.getId());

export default ComboboxConnectedTypeMeta;
