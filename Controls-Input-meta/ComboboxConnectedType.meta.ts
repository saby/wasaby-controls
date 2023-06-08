import { INameOptionsType } from './_interface/_base/INameOptionsType';
import { IRequiredOptionsType } from './_interface/_checkboxGroup/IRequiredOptionsType';
import * as rk from 'i18n!Controls';
import { group, WidgetType } from 'Types/meta';
import { ILabelOptionsType } from './_interface/_combobox/ILabelOptionsType';
import { TComboboxVariantsType } from './_interface/_combobox/TComboboxVariantsType';
import { IVisibleItemsCountType } from './_interface/_combobox/IVisibleItemsCountType';
import { IComboboxProps } from 'Controls-Input/ComboboxConnected';

/**
 * Мета-описание типа редактора {@link Controls-Input/ComboboxConnected ComboboxConnected}
 */
const ComboboxConnectedTypeMeta = WidgetType.id('Controls-Input/ComboboxConnected')
    .title(rk('Выпадающий список'))
    .category(rk('Ввод данных'))
    .attributes<IComboboxProps>({
        name: INameOptionsType.order(0),
        label: ILabelOptionsType.order(1),
        ...group('Варианты', {
            ...TComboboxVariantsType.attributes(),
        }),
        ...group(rk('Ограничения'), {
            ...IRequiredOptionsType.attributes(),
            ...IVisibleItemsCountType.attributes(),
        }),
    });

export default ComboboxConnectedTypeMeta;
