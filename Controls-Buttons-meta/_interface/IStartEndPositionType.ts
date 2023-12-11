import * as rk from 'i18n!Controls-Buttons';
import { StringType } from 'Types/meta';

export const IStartEndPositionType = StringType.oneOf(['start', 'end'])
    .id('Controls/meta:IStartEndPositionType')
    .title(rk('Расположение'))
    .description(rk('Определяет, с какой стороны расположен элемент'))
    .defaultValue('end')
    .editor(
        () => {
            return import('Controls-editors/dropdown').then(({ EnumEditor }) => {
                return EnumEditor;
            });
        },
        {
            options: [
                { value: 'start', caption: rk('В начале') },
                { value: 'end', caption: rk('В конце') },
            ],
        }
    );
