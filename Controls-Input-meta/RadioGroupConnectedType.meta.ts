import * as rk from 'i18n!Controls';
import { group, WidgetType } from 'Types/meta';
import { TOrientationType } from './_interface/radioGroup/TOrientationType';
import { TRadioGroupVariantsType } from './_interface/radioGroup/TRadioGroupVariantsType';
import { ILabelOptionsType } from './_interface/radioGroup/ILabelOptionsType';
import { IRadioGroupProps } from 'Controls-Input/RadioGroupConnected';
import {
    INameOptionsType,
    IWrapTextOptionsType,
    ICheckboxRequiredOptionsType
} from 'Controls-Input-meta/interface';

/**
 * Мета-описание типа редактора {@link Controls-Input/RadioGroupConnectedTypeMeta RadioGroupConnectedTypeMeta}
 */
const RadioGroupConnectedTypeMeta = WidgetType.id('Controls-Input/RadioGroupConnected')
    .title(rk('Радиогруппа'))
    .category(rk('Ввод данных'))
    .icon('icon-ListMarked')
    .attributes<IRadioGroupProps>({
        name: INameOptionsType.order(0),
        ...TOrientationType.attributes(),
        label: ILabelOptionsType.order(2),
        ...group('Варианты', {
            ...TRadioGroupVariantsType.attributes(),
        }),
        ...group(' ', {
            ...IWrapTextOptionsType.attributes(),
            ...ICheckboxRequiredOptionsType.attributes(),
        }),
    });

export default RadioGroupConnectedTypeMeta;
