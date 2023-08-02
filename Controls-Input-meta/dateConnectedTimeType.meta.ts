import { InputDateType, IConnectedInputType } from 'Controls-meta/controls';
import * as translate from 'i18n!Controls';

/**
 * Мета-описание типа редактора {@link Controls-Input/dateConnected:Time Time}
 */
const dateConnectedTimeTypeMeta = InputDateType.id('Controls-Input/dateConnected:Time')
    .title(translate('Время'))
    .category(translate('Ввод данных'))
    .attributes({
        ...InputDateType.attributes(),
        ...IConnectedInputType.attributes(),
    });

export default dateConnectedTimeTypeMeta;
