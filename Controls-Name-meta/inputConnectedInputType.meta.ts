import { group, WidgetType } from 'Types/meta';
import { INameProps } from 'Controls-Input/inputConnected';
import {
    INameOptionsType,
    INoJumpingLabelOptionsType,
    IRequiredOptionsType,
} from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls';

/**
 * Мета-описание типа редактора {@link Controls-Name/inputConnected:Input Name}
 */
const inputConnectedInputTypeMeta = WidgetType.id('Controls-Name/inputConnected:Input')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title(translate('ФИО'))
    .category(translate('Ввод данных'))
    .icon('icon-Client2')
    .attributes<INameProps>({
        name: INameOptionsType.order(0)
            .editorProps({ fieldType: ['object'] })
            .required(),
        ...INoJumpingLabelOptionsType.attributes(),
        ...group(translate('Ограничения'), {
            ...IRequiredOptionsType.attributes(),
        }),
    });

export default inputConnectedInputTypeMeta;
