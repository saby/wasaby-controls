import { InputNumberType, IConnectedInputType } from 'Controls-meta/controls';

/**
 * Мета-описание типа редактора {@link Controls-Input/connected:Number Number}
 */
const connectedNumberTypeMeta = InputNumberType
    .id('Controls-Input/connected:Number')
    .attributes({
        ...InputNumberType.attributes(),
        ...IConnectedInputType.attributes()
    })
    .category('Connected inputs');

export default connectedNumberTypeMeta;
