import { StringType } from 'Meta/types';
import * as rk from 'i18n!Controls-Input';

export const ICaptionTypeMeta = StringType.id('Controls-Input-meta/interface:ICaptionTypeMeta')
    .description(rk('Определяет текст заголовка кнопки'))
    .title(rk('Текст'));
