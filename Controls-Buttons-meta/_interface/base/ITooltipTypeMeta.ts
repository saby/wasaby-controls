import { StringType } from 'Types/meta';
import * as rk from 'i18n!Controls';

export const ITooltipTypeMeta = StringType.id('Controls-Buttons-meta/interface:ITooltipTypeMeta')
    .description(rk('Текст всплывающей подсказки, отображаемой при наведении курсора мыши.'))
    .title(rk('Подсказка'));
