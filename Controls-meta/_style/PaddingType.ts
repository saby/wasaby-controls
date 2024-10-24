import { StringType } from 'Meta/types';
import * as translate from 'i18n!Controls-meta';

export const PaddingType = StringType.id('Controls-editors/styles:PaddingType')
    .title(translate('Внутри'))
    .group(translate('Отступы'))
    .optional()
    .editor('Controls-editors/style:PaddingEditor')
    .defaultValue('0');
