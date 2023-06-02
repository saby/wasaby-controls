import * as rk from 'i18n!Controls';
import { StringType } from 'Types/meta';

const options = ['s', 'm', 'l'] as const;

export const ICheckboxSizeType = StringType.oneOf(options)
    .id('Controls/meta:ICheckboxSizeType')
    .title(rk('Размер чекбокса'))
    .description(rk('Размер отображаемого чекбокса'))
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
