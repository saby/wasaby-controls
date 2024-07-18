import { StringType } from 'Meta/types';
import * as rk from 'i18n!Controls-Input';

export const ITooltipTypeMeta = StringType.id('Controls-Input-meta/interface:ITooltipTypeMeta')
    .description(rk('Текст всплывающей подсказки, отображаемой при наведении курсора мыши.'))
    .title(rk('Подсказка'))
    .editor('Controls-editors/input:TextEditor', {
        placeholder: rk('Введите текст'),
    });
