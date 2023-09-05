import * as rk from 'i18n!Controls-Input';
import { ArrayType, StringType } from 'Types/meta';

export const INameOptionsType = ArrayType.of(StringType)
    .id('Controls-Input-meta/inputConnected:INameOptionsType')
    .title('')
    .description(rk('Название поля.'))
    .editor(
        () => {
            return import('Controls-editors/properties').then(({LookupEditor}) => {
                return LookupEditor;
            });
        }
    );
