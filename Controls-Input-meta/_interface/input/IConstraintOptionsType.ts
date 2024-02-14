import { ObjectType, StringType } from 'Types/meta';
import * as rk from 'i18n!Controls-Input';

export const IConstraintOptionsType = ObjectType
    .id('Controls-Input-meta/input:IConstraintOptionsType')
    .attributes({
        constraint: StringType
            .title(rk('Вводимые символы'))
            .editor(
                () => {
                    return import('Controls-Input-editors/ConstraintEditor').then(
                        ({ConstraintEditor}) => {
                            return ConstraintEditor;
                        }
                    );
                },
                {titlePosition: 'none'}
            )
            .optional()
            .defaultValue('')
    })
    .defaultValue({constraint: ''});
