import * as rk from 'i18n!Controls';
import { INameOptionsType } from './_interface/_base/INameOptionsType';
import { IRequiredOptionsType } from './_interface/_checkboxGroup/IRequiredOptionsType';
import { group, WidgetType } from 'Types/meta';
import { TOrientationType } from './_interface/_radioGroup/TOrientationType';
import { IWrapTextOptionsType } from './_interface/_checkboxGroup/IWrapTextOptionsType';
import { TRadioGroupVariantsType } from './_interface/_radioGroup/TRadioGroupVariantsType';
import { ILabelOptionsType } from './_interface/_radioGroup/ILabelOptionsType';
import { IRadioGroupProps } from 'Controls-Input/RadioGroupConnected';

/**
 * Мета-описание типа редактора {@link Controls-Input/RadioGroupConnectedTypeMeta RadioGroupConnectedTypeMeta}
 */
const RadioGroupConnectedTypeMeta = WidgetType.id('Controls-Input/RadioGroupConnected')
    .title(rk('Варианты'))
    .category(rk('Ввод данных'))
    .attributes<IRadioGroupProps>({
        name: INameOptionsType.order(0),
        ...TOrientationType.attributes(),
        label: ILabelOptionsType.order(2),
        ...group('Варианты', {
            ...TRadioGroupVariantsType.attributes(),
        }),
        ...group(' ', {
            ...IWrapTextOptionsType.attributes(),
            ...IRequiredOptionsType.attributes(),
        }),
    });

export default RadioGroupConnectedTypeMeta;
