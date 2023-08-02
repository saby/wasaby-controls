import { InputPhoneType, IConnectedInputType } from 'Controls-meta/controls';
import * as translate from 'i18n!Controls';

/**
 * Мета-описание типа редактора {@link Controls-Input/inputConnected:Phone Phone}
 */
const inputConnectedPhoneTypeMeta = InputPhoneType.id('Controls-Input/inputConnected:Phone')
    .title(translate('Телефон'))
    .category(translate('Ввод данных'))
    .attributes({
        ...InputPhoneType.attributes(),
        ...IConnectedInputType.attributes(),
    });

export default inputConnectedPhoneTypeMeta;
