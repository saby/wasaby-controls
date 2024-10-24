import { group, WidgetType } from 'Meta/types';
import { INameProps } from 'Controls-Input/inputConnected';
import {
    INameOptionsType,
    INoJumpingLabelOptionsType,
    IRequiredOptionsType,
    ISizeOptionsType,
} from 'Controls-Input-meta/interface';
import * as translate from 'i18n!Controls';

/**
 * Мета-описание типа редактора {@link Controls-Name/inputConnected:Input Name}
 */
const inputConnectedInputTypeMeta = WidgetType.id('Controls-Name/inputConnected:Input')
    .components(['77ef8897-82ab-4504-8630-7ed7352d4c08'])
    .title(translate('ФИО'))
    .devguide(
        '/doc/platform/developmentapl/interface-development/controls/input-elements/input/name/'
    )
    .description('Редактор типа "ФИО", работающий со слайсом формы')
    .category(translate('Ввод данных'))
    .icon('icon-Client2')
    .properties<INameProps>({
        name: INameOptionsType.order(0)
            .editorProps({ fieldType: ['FullName', 'object'] })
            .required(),
        ...INoJumpingLabelOptionsType.properties(),
        ...group(translate('Ограничения'), {
            ...IRequiredOptionsType.properties(),
        }),
    })
    .appendStyles({
        ...group(translate('Стиль'), {
            ...ISizeOptionsType.properties(),
        }),
    });

export default inputConnectedInputTypeMeta;
