import * as rk from 'i18n!Controls';
import { ObjectType, StringType } from 'Meta/types';
import { ICaptionOptions } from 'Controls/interface';

export const ICaptionOptionsType = ObjectType.id(
    'Controls/meta:ICaptionOptionsType'
).attributes<ICaptionOptions>({
    caption: StringType.optional()
        .title(rk('Текст'))
        .description(rk('Определяет текст заголовка контрола.')),
});
