import { WidgetType, group } from 'Types/meta';
import { ITimeProps } from 'Controls-Input/dateConnected';
import { INameOptionsType } from './_interface/_base/INameOptionsType';
import { IRequiredOptionsType } from './_interface/_base/IRequiredOptionsType';
import { IPlaceholderOptionsType } from './_interface/_base/IPlaceholderOptionsType';
import { INoJumpingLabelOptionsType } from './_interface/_input/INoJumpingLabelOptionsType';
import { ILimitOptionsType } from './_interface/_date/ILimitOptionsType';
import { ITimeIntervalType } from './_interface/_date/ITimeIntervalType';
import { IDefaultValueOptionsType } from './_interface/_date/IDefaultValueOptionsType';
import * as translate from 'i18n!Controls';

/**
 * Мета-описание типа редактора {@link Controls-Input/dateConnected:Time Time}
 */
const dateConnectedTimeTypeMeta = WidgetType.id('Controls-Input/dateConnected:Time')
    .title(translate('Время'))
    .category(translate('Ввод данных'))
    .attributes<ITimeProps>({
        name: INameOptionsType.order(0),
        defaultValue: IDefaultValueOptionsType.order(1),
        mask: ITimeIntervalType.order(2),
        label: INoJumpingLabelOptionsType.order(3),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(translate('12.00'))
            .order(4),
        ...group(translate('Ограничения'), {
            required: IRequiredOptionsType.order(5),
            periodLimit: ILimitOptionsType.title('').order(6)
        })
    });

export default dateConnectedTimeTypeMeta;
