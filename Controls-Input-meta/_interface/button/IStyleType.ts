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
            .description(rk('Определяет стиль отображения кнопки'))
            .editor('Controls-Input-editors/buttonStyleEditor:StyleEditor'),
    })
    .title(rk('Стиль'))
    .editor('Controls-Input-editors/buttonStyleEditor:StyleEditor');
