import { WidgetType, group } from 'Types/meta';
import {
    IDateMaskType
} from 'Controls-meta/controls';
import { IDateRangeProps } from 'Controls-Input/dateRangeConnected';
import {
    INameOptionsType,
    IRequiredOptionsType,
    IPlaceholderOptionsType,
    INoJumpingLabelOptionsType,
    IDateLimitOptionsType,
    IDefaultRangeValueOptionsType
} from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls';

/**
 * Мета-описание типа редактора {@link Controls-Input/dateConnected:DateRange DateRange}
 */
const dateRangeConnectedInputTypeMeta = WidgetType.id('Controls-Input/dateRangeConnected:Input')
    .title(translate('Период'))
    .category(translate('Ввод данных'))
    .attributes<IDateRangeProps>({
        name: INameOptionsType.order(0),
        defaultValue: IDefaultRangeValueOptionsType.order(1),
        mask: IDateMaskType.order(2),
        label: INoJumpingLabelOptionsType.order(3),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(translate('12.12.12'))
            .order(4),
        ...group(translate('Ограничения'), {
            required: IRequiredOptionsType.order(5),
            limit: IDateLimitOptionsType.title('').order(6)
        })
    });

export default dateRangeConnectedInputTypeMeta;
