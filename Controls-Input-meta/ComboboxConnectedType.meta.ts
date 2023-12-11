import * as rk from 'i18n!Controls-Input';
import { group, WidgetType, extended } from 'Types/meta';
import { IComboboxProps } from 'Controls-Input/ComboboxConnected';
import {
    IPlaceholderOptionsType,
    INameOptionsType,
    ICheckboxRequiredOptionsType,
    IComboboxLabelOptionsType as ILabelOptionsType,
    TComboboxVariantsType,
    IMultiSelectType,
    IVisibleItemsCountType,
} from 'Controls-Input-meta/interface';
import * as FrameEditorInline from 'optional!FrameEditor/inline';
import * as FrameEditorSelection from 'optional!FrameEditor/selection';

const InlineRegistrar = FrameEditorInline?.InlineRegistrar;
const SelectionRuleRegistrer = FrameEditorSelection?.SelectionRuleRegistrer;

/**
 * Мета-описание типа редактора {@link Controls-Input/ComboboxConnected ComboboxConnected}
 */
const ComboboxConnectedTypeMeta = WidgetType.id('Controls-Input/ComboboxConnected')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title(rk('Список'))
    .description(rk('Выпадающий список'))
    .category(rk('Ввод данных'))
    .icon('icon-ExpandList')
    .attributes<IComboboxProps>({
        name: INameOptionsType.order(0).required(),
        label: ILabelOptionsType.order(1),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(rk('Выберите вариант'))
            .order(2),
        ...group('Варианты', {
            ...TComboboxVariantsType.attributes(),
        }),
        ...group('', {
            multiSelect: IMultiSelectType,
        }),
        ...extended(
            group(rk('Ограничения'), {
                ...ICheckboxRequiredOptionsType.attributes(),
                ...IVisibleItemsCountType.attributes(),
            })
        ),
    });

InlineRegistrar?.register(ComboboxConnectedTypeMeta.getId());
SelectionRuleRegistrer?.registerUnselectable(ComboboxConnectedTypeMeta.getId());

export default ComboboxConnectedTypeMeta;
