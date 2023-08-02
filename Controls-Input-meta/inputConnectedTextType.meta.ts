import { InputAreaType, IConnectedInputType } from 'Controls-meta/controls';
import * as translate from 'i18n!Controls';

/**
 * Мета-описание типа редактора {@link Controls-Input/inputConnected:Text Text}
 */
const inputConnectedTextTypeMeta = InputAreaType.id('Controls-Input/inputConnected:Text')
    .title(translate('Многострочный'))
    .category(translate('Ввод данных'))
    .attributes({
        ...InputAreaType.attributes(),
        ...IConnectedInputType.attributes(),
    });

export default inputConnectedTextTypeMeta;
