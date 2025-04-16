import { extended, ObjectType, StringType } from 'Meta/types';
import * as rk from 'i18n!Controls-Input';

export const IConstraintOptionsType = ObjectType.id(
    'Controls-Input-meta/input:IConstraintOptionsType'
)
    .properties({
        constraint: StringType.title(rk('Вводимые символы'))
            .editor('Controls-Input-editors/ConstraintEditor:ConstraintEditor', {
                titlePosition: 'none',
            })
            .optional()
            .order(7)
            .defaultValue(''),
    })
    .defaultValue({ constraint: '' });
