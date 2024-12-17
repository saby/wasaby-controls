import { ObjectType, StringType } from 'Meta/types';
import * as rk from 'i18n!Controls-Containers';

export const IViewModeOptionsType = ObjectType.id(
    'Controls-Containers-meta/interface:IViewModeOptionsType'
)
    .title(rk('Стиль'))
    .description(rk('Стиль'))
    .properties({
        reference: StringType.title(rk('Стиль'))
            .editor('Controls-editors/tabs:ReferenceEditor')
            .optional()
            .order(100),
    })
    .optional()
    .order(100);
