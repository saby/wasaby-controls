import { InputPhoneType, IConnectedInputType } from 'Controls-meta/controls';

/**
 * Мета-описание типа редактора {@link Controls-Input/connected:Phone Phone}
 */
const connectedPhoneTypeMeta = InputPhoneType
    .id('Controls-Input/connected:Phone')
    .attributes({
        ...InputPhoneType.attributes(),
        ...IConnectedInputType.attributes()
    })
    .category('Connected inputs');

export default connectedPhoneTypeMeta;
