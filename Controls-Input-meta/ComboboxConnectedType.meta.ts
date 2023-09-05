import { INameOptionsType } from './_interface/base/INameOptionsType';
import { IRequiredOptionsType } from './_interface/checkboxGroup/IRequiredOptionsType';
import * as rk from 'i18n!Controls-Input';
import { group, WidgetType, extended } from 'Types/meta';
import { ILabelOptionsType } from './_interface/combobox/ILabelOptionsType';
import { TComboboxVariantsType } from './_interface/combobox/TComboboxVariantsType';
import { IMultiSelectType } from './_interface/combobox/IMultiSelectType';
import { IVisibleItemsCountType } from './_interface/combobox/IVisibleItemsCountType';
import { IComboboxProps } from 'Controls-Input/ComboboxConnected';
import { IPlaceholderOptionsType } from 'Controls-Input-meta/interface';

/**
 * Мета-описание типа редактора {@link Controls-Input/ComboboxConnected ComboboxConnected}
 */
const ComboboxConnectedTypeMeta = WidgetType.id('Controls-Input/ComboboxConnected')
    .title(rk('Список'))
    .description(rk('Выпадающий список'))
    .category(rk('Ввод данных'))
    .icon('icon-ExpandList')
    .attributes<IComboboxProps>({
        name: INameOptionsType.order(0),
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
                ...IRequiredOptionsType.attributes(),
                ...IVisibleItemsCountType.attributes(),
            })
        ),
    });

export default ComboboxConnectedTypeMeta;
