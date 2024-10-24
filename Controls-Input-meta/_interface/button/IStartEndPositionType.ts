import * as rk from 'i18n!Controls-Input';
import { StringType } from 'Meta/types';

/**
 * Определяет интерфейс редактора, описывающего расположение заголовка кнопки.
 * @public
 */
export const IStartEndPositionType = StringType.oneOf(['start', 'end'])
    .id('Controls/meta:IStartEndPositionType')
    .title(rk('Расположение'))
    .description(rk('Определяет, с какой стороны расположен элемент'))
    .defaultValue('end')
    .editor('Controls-editors/dropdown:EnumEditor', {
        options: [
            { value: 'start', caption: rk('В начале', 'Кнопка') },
            { value: 'end', caption: rk('В конце', 'Кнопка') },
        ],
    });
