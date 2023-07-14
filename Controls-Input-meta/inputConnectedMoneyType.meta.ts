import { WidgetType, group } from 'Types/meta';
import { IMoneyProps } from 'Controls-Input/inputConnected';
import {
    INameOptionsType,
    IRequiredOptionsType,
    IPlaceholderOptionsType,
    IUseGroupingOptionsType,
    INoJumpingLabelOptionsType,
    ILimitOptionsType,
    IOnlyPositiveOptionsType,
    INumberLengthOptionsType,
    IDefaultInputValueOptionsType
} from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls';

/**
 * Мета-описание типа редактора {@link Controls-Input/inputConnected:Money Money}
 */
const inputConnectedMoneyTypeMeta = WidgetType.id('Controls-Input/inputConnected:Money')
    .title(translate('Деньги'))
    .category(translate('Ввод данных'))
    .attributes<IMoneyProps>({
        name: INameOptionsType.order(0),
        defaultValue: IDefaultInputValueOptionsType.order(1),
        label: INoJumpingLabelOptionsType.order(2),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(translate('Введите сумму'))
            .order(3),
        ...group('', {
            useGrouping: IUseGroupingOptionsType.optional().order(4),
        }),
        ...group(translate('Ограничения'), {
            required: IRequiredOptionsType.order(5),
            onlyPositive: IOnlyPositiveOptionsType.optional().order(6),
            integersLength: INumberLengthOptionsType.attributes().integersLength.title('').order(7),
            limit: ILimitOptionsType.title('').order(8)
        })
    });

export default inputConnectedMoneyTypeMeta;