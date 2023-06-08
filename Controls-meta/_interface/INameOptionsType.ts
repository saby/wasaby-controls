import * as rk from 'i18n!Controls';
import { FunctionType } from 'Types/meta';

const options = {};

export const INameOptionsType = FunctionType.id(
    'Controls/meta:INameOptionsType'
)
    .title('')
    .description(rk('Название поля.'))
    .editor(
        () => {
            return import('Controls-editors/properties').then(
                ({ LookupEditor }) => {
                    return LookupEditor;
                }
            );
        },
        { options }
    );
