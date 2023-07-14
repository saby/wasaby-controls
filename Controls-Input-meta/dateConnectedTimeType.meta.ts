import { WidgetType, group } from 'Types/meta';
import { ITimeProps } from 'Controls-Input/dateConnected';
import {
    INameOptionsType,
    IRequiredOptionsType,
    IPlaceholderOptionsType,
    INoJumpingLabelOptionsType,
    ITimeLimitOptionsType,
    ITimeIntervalType,
    IDefaultTimeValueOptionsType
} from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls';

/**
 * Мета-описание типа редактора {@link Controls-Input/dateConnected:Time Time}
 */
const dateConnectedTimeTypeMeta = WidgetType.id('Controls-Input/dateConnected:Time')
    .title(translate('Время'))
    .category(translate('Ввод данных'))
    .icon('icon-TimeSkinny')
    .attributes<ITimeProps>({
        name: INameOptionsType.order(0),
        defaultValue: IDefaultTimeValueOptionsType.order(1),
        mask: ITimeIntervalType.order(2),
        label: INoJumpingLabelOptionsType.order(3),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(translate('Начало'))
            .order(4),
        ...group(translate('Ограничения'), {
            required: IRequiredOptionsType.order(5),
            periodLimit: ITimeLimitOptionsType.title('').order(6)
        })
    });

export default dateConnectedTimeTypeMeta;
