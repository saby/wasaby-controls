import * as rk from 'i18n!Controls';
import { ObjectType, StringType } from 'Meta/types';
import { IHrefOptions } from 'Controls/interface';

export const IHrefOptionsType = ObjectType.id(
    'Controls/meta:IHrefOptionsType'
).attributes<IHrefOptions>({
    href: StringType.optional()
        .title(rk('Ссылка'))
        .description(rk('Адрес документа, на который следует перейти.')),
});
