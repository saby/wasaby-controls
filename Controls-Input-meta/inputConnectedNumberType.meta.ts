import { WidgetType, group, extended } from 'Types/meta';
import { INumberProps } from 'Controls-Input/inputConnected';
import {
    INameOptionsType,
    IRequiredOptionsType,
    IPlaceholderOptionsType,
    IUseGroupingOptionsType,
    INoJumpingLabelOptionsType,
    ILimitOptionsType,
    IOnlyPositiveOptionsType,
    INumberLengthOptionsType,
    IDefaultInputValueOptionsType,
} from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls-Input';

/**
 * Мета-описание типа редактора {@link Controls-Input/inputConnected:Number Number}
 */
const inputConnectedNumberTypeMeta = WidgetType.id('Controls-Input/inputConnected:Number')
    .title(translate('Число'))
    .category(translate('Ввод данных'))
    .icon('icon-Number')
    .attributes<INumberProps>({
        name: INameOptionsType.order(0),
        defaultValue: IDefaultInputValueOptionsType.order(1),
        label: INoJumpingLabelOptionsType.order(2),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(translate('Укажите число'))
            .order(3),
        ...group('', {
            useGrouping: IUseGroupingOptionsType.optional().order(4),
        }),
        ...extended(
            group(translate('Ограничения'), {
                required: IRequiredOptionsType.order(5),
                onlyPositive: IOnlyPositiveOptionsType.optional().order(6),
                integersLength: INumberLengthOptionsType.attributes()
                    .integersLength.title('')
                    .order(7),
                precision: INumberLengthOptionsType.attributes().precision.title('').order(8),
                limit: ILimitOptionsType.title('').order(9),
            })
        ),
    });

export default inputConnectedNumberTypeMeta;
