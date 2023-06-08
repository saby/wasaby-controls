import { WidgetType, group } from 'Types/meta';
import { IMoneyProps } from 'Controls-Input/inputConnected';
import { INameOptionsType } from './_interface/_base/INameOptionsType';
import { IRequiredOptionsType } from './_interface/_base/IRequiredOptionsType';
import { IPlaceholderOptionsType } from './_interface/_base/IPlaceholderOptionsType';
import { IUseGroupingOptionsType } from './_interface/_base/IUseGroupingOptionsType';
import { ILabelOptionsType } from './_interface/_input/ILabelOptionsType';
import { ILimitOptionsType } from './_interface/_input/ILimitOptionsType';
import { IOnlyPositiveOptionsType } from './_interface/_input/IOnlyPositiveOptionsType';
import { INumberLengthOptionsType } from './_interface/_input/INumberLengthOptionsType';
import { IDefaultValueOptionsType } from './_interface/_input/IDefaultValueOptionsType';
import * as translate from 'i18n!Controls';

/**
 * Мета-описание типа редактора {@link Controls-Input/inputConnected:Money Money}
 */
const inputConnectedMoneyTypeMeta = WidgetType.id('Controls-Input/inputConnected:Money')
    .title(translate('Деньги'))
    .category(translate('Ввод данных'))
    .attributes<IMoneyProps>({
        name: INameOptionsType.order(0),
        defaultValue: IDefaultValueOptionsType.order(1),
        label: ILabelOptionsType.order(2),
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