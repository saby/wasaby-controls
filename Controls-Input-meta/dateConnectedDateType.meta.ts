import { WidgetType, group } from 'Types/meta';
import { IDateMaskType } from 'Controls-meta/controls';
import { IDateProps } from 'Controls-Input/dateConnected';
import { INameOptionsType } from './_interface/_base/INameOptionsType';
import { IRequiredOptionsType } from './_interface/_base/IRequiredOptionsType';
import { IPlaceholderOptionsType } from './_interface/_base/IPlaceholderOptionsType';
import { ILimitOptionsType } from './_interface/_date/ILimitOptionsType';
import { INoJumpingLabelOptionsType } from './_interface/_input/INoJumpingLabelOptionsType';
import { IDefaultValueOptionsType } from './_interface/_date/IDefaultValueOptionsType';
import * as translate from 'i18n!Controls';

/**
 * Мета-описание типа редактора {@link Controls-Input/dateConnected:Date Date}
 */
const dateConnectedDateTypeMeta = WidgetType.id('Controls-Input/dateConnected:Date')
    .title(translate('Дата'))
    .category(translate('Ввод данных'))
    .attributes<IDateProps>({
        name: INameOptionsType.order(0),
        defaultValue: IDefaultValueOptionsType.order(1),
        mask: IDateMaskType.order(2),
        label: INoJumpingLabelOptionsType.order(3),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(translate('12.12.12'))
            .order(4),
        ...group(translate('Ограничения'), {
            required: IRequiredOptionsType.order(5),
            periodLimit: ILimitOptionsType.title('').order(6),
        }),
    });

export default dateConnectedDateTypeMeta;
