import { InputTextType, IConnectedInputType } from 'Controls-meta/controls';

/**
 * Мета-описание типа редактора {@link Controls-Input/connected:String String}
 */
const connectedStringTypeMeta = InputTextType
    .id('Controls-Input/connected:String')
    .attributes({
        ...InputTextType.attributes(),
        ...IConnectedInputType.attributes()
    })
    .category('Connected inputs');

export default connectedStringTypeMeta;
