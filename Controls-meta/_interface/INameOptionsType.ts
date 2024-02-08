import * as rk from 'i18n!Controls';
import { FunctionType } from 'Meta/types';

const options = {};

export interface INameProps {
    name: string[];
}

export const INameOptionsType = FunctionType.id('Controls/meta:INameOptionsType')
    .title('')
    .description(rk('Название поля.'))
    .editor(
        () => {
            return import('Controls-editors/properties').then(({LookupEditor}) => {
                return LookupEditor;
            });
        },
        {options}
    );
