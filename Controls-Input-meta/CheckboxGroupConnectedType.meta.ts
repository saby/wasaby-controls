import * as rk from 'i18n!Controls-Input';
import { group, WidgetType } from 'Types/meta';
import { TOrientationType } from './_interface/checkboxGroup/TOrientationType';
import { TCheckboxGroupVariantsType } from './_interface/checkboxGroup/TCheckboxGroupVariantsType';
import { ILabelOptionsType } from './_interface/checkboxGroup/ILabelOptionsType';
import {
    INameOptionsType,
    IWrapTextOptionsType,
    ICheckboxRequiredOptionsType
} from 'Controls-Input-meta/interface';
import { ICheckBoxGroupProps } from 'Controls-Input/CheckboxGroupConnected';

/**
 * Мета-описание типа редактора {@link Controls-Input/CheckboxGroupConnected CheckboxGroupConnected}
 */
const CheckboxGroupConnectedTypeMeta = WidgetType.id('Controls-Input/CheckboxGroupConnected')
    .title(rk('Группа флагов'))
    .category(rk('Ввод данных'))
    .icon('icon-Check2')
    .attributes<ICheckBoxGroupProps>({
        name: INameOptionsType.order(0),
        ...TOrientationType.attributes(),
        label: ILabelOptionsType.order(2),
        ...group('Варианты', {
            ...TCheckboxGroupVariantsType.attributes(),
        }),
        ...group('', {
            ...IWrapTextOptionsType.attributes(),
            ...ICheckboxRequiredOptionsType.attributes(),
        }),
    });

export default CheckboxGroupConnectedTypeMeta;
