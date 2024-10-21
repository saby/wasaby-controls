import { StringType } from 'Meta/types';
import * as rk from 'i18n!Controls-Input';

/**
 * Определяет интерфейс редактора, описывающего заголовок кнопки.
 * @public
 */
export const ICaptionTypeMeta = StringType.id('Controls-Input-meta/interface:ICaptionTypeMeta')
    .description(rk('Определяет текст заголовка кнопки'))
    .title(rk('Текст'))
    .editor('Controls-editors/input:TextEditor', {
        placeholder: rk('Введите текст'),
    });
