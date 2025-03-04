import * as rk from 'i18n!Controls-Input';
import { ObjectType, StringType } from 'Meta/types';

interface IStyle {
    reference?: string;
}

/**
 * Определяет интерфейс редактора, описывающего стиль кнопки.
 * @public
 */
export const IStyleType = ObjectType.id('Controls-Input-meta/button:IStyleType')
    .properties<IStyle>({
        reference: StringType.optional()
            .title(rk('Стиль'))
            .editor('Controls-Input-editors/buttonStyleEditor:StyleEditor')
            .defaultValue(
                'controls-button-style controls-button_outlined-style controls-button_outlined-secondary-style controls-button_size-m'
            ),
    })
    .title(rk('Стиль'))
    .editor('Controls-Input-editors/buttonStyleEditor:StyleEditor');
