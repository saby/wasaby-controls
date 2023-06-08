import { InputTextType, IConnectedInputType } from 'Controls-meta/controls';
import { ILabelOptionsType } from './_interface/_input/ILabelOptionsType';
import * as translate from 'i18n!Controls';
// todo удалить
/**
 * Мета-описание типа редактора {@link Controls-Input/inputConnected:String String}
 */
const inputConnectedStringTypeMeta = InputTextType.id('Controls-Input/inputConnected:String')
    .title(translate('Текст'))
    .category(translate('Ввод данных'))
    .attributes({
        ...InputTextType.attributes(),
        label: ILabelOptionsType,
        ...IConnectedInputType.attributes(),
    });

export default inputConnectedStringTypeMeta;
