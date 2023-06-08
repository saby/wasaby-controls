import { InputDateType, IConnectedInputType } from 'Controls-meta/controls';

/**
 * Мета-описание типа редактора {@link Controls-Input/connected:Date Date}
 */
const connectedDateTypeMeta = InputDateType.id('Controls-Input/connected:Date')
    .attributes({
        ...InputDateType.attributes(),
        ...IConnectedInputType.attributes(),
    })
    .category('Connected inputs');

export default connectedDateTypeMeta;
