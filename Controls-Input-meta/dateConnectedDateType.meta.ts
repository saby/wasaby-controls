import { WidgetType, group } from 'Types/meta';
import { IDateMaskType } from 'Controls-meta/controls';
import { IDateProps } from 'Controls-Input/dateConnected';
import {
    INameOptionsType,
    IRequiredOptionsType,
    IPlaceholderOptionsType,
    IDateLimitOptionsType,
    INoJumpingLabelOptionsType,
    IDateDefaultValueOptionsType
} from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls';

/**
 * Мета-описание типа редактора {@link Controls-Input/dateConnected:Date Date}
 */
const dateConnectedDateTypeMeta = WidgetType.id('Controls-Input/dateConnected:Date')
    .title(translate('Дата'))
    .category(translate('Ввод данных'))
    .icon('icon-Calendar')
    .attributes<IDateProps>({
        name: INameOptionsType.order(0),
        defaultValue: IDateDefaultValueOptionsType.order(1),
        mask: IDateMaskType.order(2),
        label: INoJumpingLabelOptionsType.order(3),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(translate('Начало'))
            .order(4),
        ...group(translate('Ограничения'), {
            required: IRequiredOptionsType.order(5),
            periodLimit: IDateLimitOptionsType.title('').order(6),
        }),
    });

export default dateConnectedDateTypeMeta;
