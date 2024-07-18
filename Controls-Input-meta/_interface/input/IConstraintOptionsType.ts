import { ObjectType, StringType } from 'Meta/types';
import * as rk from 'i18n!Controls-Input';

export const IConstraintOptionsType = ObjectType.id(
    'Controls-Input-meta/input:IConstraintOptionsType'
)
    .attributes({
        constraint: StringType.title(rk('Вводимые символы'))
            .editor('Controls-Input-editors/ConstraintEditor:ConstraintEditor', {
                titlePosition: 'none',
            })
            .optional()
            .defaultValue(''),
    })
    .defaultValue({ constraint: '' });
