import { RadioGroupType, IConnectedInputType } from 'Controls-meta/controls';
import * as translate from 'i18n!Controls';

/**
 * Мета-описание типа редактора {@link Controls-Input/RadioGroupConnectedTypeMeta RadioGroupConnectedTypeMeta}
 */
const RadioGroupConnectedTypeMeta = RadioGroupType.id('Controls-Input/RadioGroupConnected')
    .title(translate('Варианты'))
    .category(translate('Ввод данных'))
    .attributes({
        ...RadioGroupType.attributes(),
        ...IConnectedInputType.attributes(),
    });

export default RadioGroupConnectedTypeMeta;
