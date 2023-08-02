import { InputDateType, IConnectedInputType } from 'Controls-meta/controls';
import * as translate from 'i18n!Controls';

/**
 * Мета-описание типа редактора {@link Controls-Input/dateConnected:Date Date}
 */
const dateConnectedDateTypeMeta = InputDateType.id('Controls-Input/dateConnected:Date')
    .title(translate('Дата'))
    .category(translate('Ввод данных'))
    .attributes({
        ...InputDateType.attributes(),
        ...IConnectedInputType.attributes(),
    });

export default dateConnectedDateTypeMeta;
