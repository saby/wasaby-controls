import * as rk from 'i18n!Controls';
import { ObjectType } from 'Meta/types';

export const INameType = ObjectType.id('Controls/meta:IFioType')
    .description(rk('Поле для ввода ФИО'))
    .editor(() => {
        return import('Controls-editors/properties').then(({ NameEditor }) => {
            return NameEditor;
        });
    });
