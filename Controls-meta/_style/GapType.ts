import { StringType } from 'Meta/types';
import * as translate from 'i18n!FrameControls-meta';

export const GapType = StringType.id('Controls-editors/styles:GapType')
    .title(translate('Между'))
    .group(translate('Отступы'))
    .optional()
    .editor('Controls-editors/style:GapEditor')
    .defaultValue('0');
