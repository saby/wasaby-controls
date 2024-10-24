import { StringType } from 'Meta/types';
import * as translate from 'i18n!Controls-meta';

export const BorderRadiusType = StringType.id('Controls-editors/styles:BorderRadiusType')
    .title(translate('Скругления'))
    .optional()
    .editor('Controls-editors/style:PaddingEditor')
    .defaultValue('0');
