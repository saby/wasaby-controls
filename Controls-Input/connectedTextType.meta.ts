import { InputAreaType, IConnectedInputType } from 'Controls-meta/controls';

/**
 * Мета-описание типа редактора {@link Controls-Input/connected:Text Text}
 */
const connectedTextTypeMeta = InputAreaType.id('Controls-Input/connected:Text')
    .attributes({
        ...InputAreaType.attributes(),
        ...IConnectedInputType.attributes(),
    })
    .category('Connected inputs');

export default connectedTextTypeMeta;
