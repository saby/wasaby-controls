import { StringType } from 'Types/meta';
import * as rk from 'i18n!Controls';

export const IConstraintOptionsType = StringType.id('Controls-meta/input:IConstraintOptionsType')
    .title(rk('Вводимые символы'))
    .editor(
        () => {
            return import('Controls-editors/properties').then(({ConstraintEditor}) => {
                return ConstraintEditor;
            });
        }
    )
    .defaultValue('');
