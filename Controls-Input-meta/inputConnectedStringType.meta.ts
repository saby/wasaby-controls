import { InputTextType, IConnectedInputType } from 'Controls-meta/controls';
import * as translate from 'i18n!Controls';

/**
 * Мета-описание типа редактора {@link Controls-Input/inputConnected:String String}
 */
const inputConnectedStringTypeMeta = InputTextType.id('Controls-Input/inputConnected:String')
    .title(translate('Текст'))
    .category(translate('Ввод данных'))
    .attributes({
        ...InputTextType.attributes(),
        ...IConnectedInputType.attributes(),
    });

export default inputConnectedStringTypeMeta;
