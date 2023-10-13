import { StringType } from 'Types/meta';
import * as rk from 'i18n!Controls-Buttons';

export const ICaptionTypeMeta = StringType.id('Controls-Buttons-meta/interface:ICaptionTypeMeta')
    .description(rk('Определяет текст заголовка кнопки'))
    .title(rk('Текст'));
