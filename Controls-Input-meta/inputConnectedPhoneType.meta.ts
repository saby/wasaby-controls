import { WidgetType, group } from 'Types/meta';
import { IPhoneProps } from 'Controls-Input/inputConnected';
import {
    INameOptionsType,
    IRequiredOptionsType,
    IPlaceholderOptionsType,
    INoJumpingLabelOptionsType,
    IFlagType,
    IPhoneType,
    IDefaultPhoneValueOptionsType
} from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls';

/**
 * Мета-описание типа редактора {@link Controls-Input/inputConnected:Phone Phone}
 */
const inputConnectedPhoneTypeMeta = WidgetType.id('Controls-Input/inputConnected:Phone')
    .title(translate('Телефон'))
    .category(translate('Ввод данных'))
    .icon('icon-PhoneNull')
    .attributes<IPhoneProps>({
        name: INameOptionsType.order(0),
        defaultValue: IDefaultPhoneValueOptionsType.order(1),
        label: INoJumpingLabelOptionsType.order(2),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(translate('Введите номер'))
            .order(3),
        ...group('', {
            ...IFlagType.attributes(),
        }),
        ...group(translate('Ограничения'), {
            required: IRequiredOptionsType.order(6),
            onlyMobile: IPhoneType.order(7),
        }),
    });

export default inputConnectedPhoneTypeMeta;
