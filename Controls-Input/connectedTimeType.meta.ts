import { InputDateType, IConnectedInputType } from 'Controls-meta/controls';

/**
 * Мета-описание типа редактора {@link Controls-Input/connected:Time Time}
 */
const connectedTimeTypeMeta = InputDateType
    .id('Controls-Input/connected:Time')
    .attributes({
        ...InputDateType.attributes(),
        ...IConnectedInputType.attributes()
    })
    .category('Connected inputs');

export default connectedTimeTypeMeta;
