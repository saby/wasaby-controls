import { WidgetType, group } from 'Types/meta';
import { IPhoneProps } from 'Controls-Input/inputConnected';
import { INameOptionsType } from './_interface/_base/INameOptionsType';
import { IRequiredOptionsType } from './_interface/_base/IRequiredOptionsType';
import { IPlaceholderOptionsType } from './_interface/_base/IPlaceholderOptionsType';
import { IFlagType } from './_interface/_input/IFlagType';
import { IPhoneType } from './_interface/_input/IPhoneType';
import { ILabelOptionsType } from './_interface/_input/ILabelOptionsType';
import { IDefaultValueOptionsType } from './_interface/_input/IDefaultValueOptionsType';
import * as translate from 'i18n!Controls';

/**
 * Мета-описание типа редактора {@link Controls-Input/inputConnected:Phone Phone}
 */
const inputConnectedPhoneTypeMeta = WidgetType.id('Controls-Input/inputConnected:Phone')
    .title(translate('Телефон'))
    .category(translate('Ввод данных'))
    .attributes<IPhoneProps>({
        name: INameOptionsType.order(0),
        defaultValue: IDefaultValueOptionsType.order(1),
        label: ILabelOptionsType.order(2),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(translate('Введите номер'))
            .order(3),
        ...group('', {
            ...IFlagType.attributes(),
        }),
        ...group(translate('Ограничения'), {
            required: IRequiredOptionsType.order(5),
            onlyMobile: IPhoneType.order(6),
        }),
    });

export default inputConnectedPhoneTypeMeta;
