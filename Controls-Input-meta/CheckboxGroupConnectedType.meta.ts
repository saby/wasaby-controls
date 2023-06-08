import * as rk from 'i18n!Controls';
import { INameOptionsType } from './_interface/_base/INameOptionsType';
import { IRequiredOptionsType } from './_interface/_checkboxGroup/IRequiredOptionsType';
import { group, WidgetType } from 'Types/meta';
import { TOrientationType } from './_interface/_checkboxGroup/TOrientationType';
import { IWrapTextOptionsType } from './_interface/_checkboxGroup/IWrapTextOptionsType';
import { TCheckboxGroupVariantsType } from './_interface/_checkboxGroup/TCheckboxGroupVariantsType';
import { ILabelOptionsType } from './_interface/_checkboxGroup/ILabelOptionsType';
import { ICheckBoxGroupProps } from 'Controls-Input/CheckboxGroupConnected';

/**
 * Мета-описание типа редактора {@link Controls-Input/CheckboxGroupConnected CheckboxGroupConnected}
 */
const CheckboxGroupConnectedTypeMeta = WidgetType.id('Controls-Input/CheckboxGroupConnected')
    .title(rk('Чекбоксы'))
    .category(rk('Ввод данных'))
    .attributes<ICheckBoxGroupProps>({
        name: INameOptionsType.order(0),
        ...TOrientationType.attributes(),
        label: ILabelOptionsType.order(2),
        ...group('Варианты', {
            ...TCheckboxGroupVariantsType.attributes(),
        }),
        ...group(' ', {
            ...IWrapTextOptionsType.attributes(),
            ...IRequiredOptionsType.attributes(),
        }),
    });

export default CheckboxGroupConnectedTypeMeta;
