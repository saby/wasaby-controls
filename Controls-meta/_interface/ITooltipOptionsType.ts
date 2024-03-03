import * as rk from 'i18n!Controls';
import { ObjectType, StringType } from 'Meta/types';
import { ITooltipOptions } from 'Controls/interface';

export const ITooltipOptionsType = ObjectType.id(
    'Controls/meta:ITooltipOptionsType'
).attributes<ITooltipOptions>({
    tooltip: StringType.optional()
        .title(rk('Подсказка'))
        .description(rk('Текст всплывающей подсказки, отображаемой при наведении курсора мыши.')),
});
