import { WidgetType, group } from 'Types/meta';
import { INameOptionsType } from './_interface/_base/INameOptionsType';
import { IRequiredOptionsType } from './_interface/_base/IRequiredOptionsType';
import { IPlaceholderOptionsType } from './_interface/_base/IPlaceholderOptionsType';
import { IMaskProps } from 'Controls-Input/inputConnected';
import { IMaskOptionsType } from './_interface/_input/IMaskOptionsType';
import { ILabelOptionsType } from './_interface/_input/ILabelOptionsType';
import { IDefaultValueOptionsType } from './_interface/_input/IDefaultValueOptionsType';
import * as translate from 'i18n!Controls';

/**
 * Мета-описание типа редактора {@link Controls-Input/inputConnected:Mask Mask}
 */
const inputConnectedMaskTypeMeta = WidgetType.id('Controls-Input/inputConnected:Mask')
    .title(translate('Маска'))
    .category(translate('Ввод данных'))
    .attributes<IMaskProps>({
        name: INameOptionsType.order(0),
        defaultValue: IDefaultValueOptionsType.order(1),
        label: ILabelOptionsType.order(2),
        placeholder: IPlaceholderOptionsType.attributes()
            .placeholder.defaultValue(translate('Введите текст'))
            .order(3),
        mask: IMaskOptionsType.attributes().mask.order(4),
        ...group(translate('Ограничения'), {
            required: IRequiredOptionsType.order(5),
        })
    });

export default inputConnectedMaskTypeMeta;
