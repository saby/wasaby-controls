import { StringType } from 'Types/meta';
import * as rk from 'i18n!Controls';
import { AutoComplete } from 'Controls/input';

const options: readonly AutoComplete[] = [
    'on',
    'off',
    'username',
    'current-password',
    'name',
    'given-name',
    'additional-name',
    'family-name',
    'email',
    'new-password',
    'one-time-code',
    'organization-title',
    'organization',
    'street-address',
    'country',
    'country-name',
    'postal-code',
    'cc-name',
    'cc-given-name',
    'cc-additional-name',
    'cc-family-name',
    'cc-number',
    'cc-exp',
    'language',
    'bday',
    'sex',
    'tel',
    'url',
] as const;

export const TInputAutoComplete = StringType.oneOf(options)
    .id('Controls/meta:TInputAutoComplete')
    .title(rk('Авто подстановка'))
    .editor(
        () => {
            return import('Controls-editors/properties').then(
                ({ StringEnumEditor }) => {
                    return StringEnumEditor;
                }
            );
        },
        { options }
    );
