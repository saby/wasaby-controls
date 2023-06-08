import { WidgetType, group } from 'Types/meta';
import {
    IDateMaskType
} from 'Controls-meta/controls';
import {IDateRangeProps} from 'Controls-Input/dateRangeConnected';
import { INameOptionsType } from './_interface/_base/INameOptionsType';
import { IRequiredOptionsType } from './_interface/_base/IRequiredOptionsType';
import { IPlaceholderOptionsType } from './_interface/_base/IPlaceholderOptionsType';
import { INoJumpingLabelOptionsType } from './_interface/_input/INoJumpingLabelOptionsType';
import { ILimitOptionsType } from './_interface/_date/ILimitOptionsType';
import { IDefaultRangeValueOptionsType } from './_interface/_date/IDefaultRangeValueOptionsType';
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
            limit: ILimitOptionsType.title('').order(6)
        })
    });

export default dateRangeConnectedInputTypeMeta;
