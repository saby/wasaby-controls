import * as rk from 'i18n!Controls';
import { StringType } from 'Types/meta';
import { TValidationStatus } from 'Controls/interface';

const options: readonly TValidationStatus[] = [
    'valid',
    'invalid',
    'invalidAccent',
] as const;

export const TValidationStatusOptionsType = StringType.oneOf(options)
    .id('Controls/meta:TValidationStatusOptionsType')
    .title(rk('Статус валидации'))
    .description(rk('Статус валидации контрола'))
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
