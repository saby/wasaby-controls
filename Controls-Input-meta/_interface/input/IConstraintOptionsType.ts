import { StringType } from 'Types/meta';
import * as rk from 'i18n!Controls-Input';

export const IConstraintOptionsType = StringType.id(
    'Controls-Input-meta/input:IConstraintOptionsType'
)
    .title(rk('Вводимые символы'))
    .editor(
        () => {
            return import('Controls-Input-editors/ConstraintEditor').then(
                ({ ConstraintEditor }) => {
                    return ConstraintEditor;
                }
            );
        },
        { titlePosition: 'none' }
    )
    .defaultValue('');
