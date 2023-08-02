import { InputNumberType, IConnectedInputType } from 'Controls-meta/controls';
import * as translate from 'i18n!Controls';

/**
 * Мета-описание типа редактора {@link Controls-Input/inputConnected:Number Number}
 */
const inputConnectedNumberTypeMeta = InputNumberType.id('Controls-Input/inputConnected:Number')
    .title(translate('Число'))
    .category(translate('Ввод данных'))
    .attributes({
        ...InputNumberType.attributes(),
        ...IConnectedInputType.attributes(),
    });

export default inputConnectedNumberTypeMeta;
