import { WidgetType, group } from 'Types/meta';
import { INameOptionsType } from './_interface/_base/INameOptionsType';
import { IRequiredOptionsType } from './_interface/_base/IRequiredOptionsType';
import { INameProps } from 'Controls-Input/inputConnected';
import { INoJumpingLabelOptionsType } from './_interface/_input/INoJumpingLabelOptionsType';
import * as translate from 'i18n!Controls';

/**
 * Мета-описание типа редактора {@link Name/inputConnected:Input Name}
 */
const inputConnectedNameTypeMeta = WidgetType.id('Name/inputConnected:Input')
    .title(translate('ФИО'))
    .category(translate('Ввод данных'))
    .attributes<INameProps>({
        name: INameOptionsType.order(0),
        label: INoJumpingLabelOptionsType.order(1),
        ...group(translate('Ограничения'), {
            required: IRequiredOptionsType.order(2)
        })
    });

export default inputConnectedNameTypeMeta;
