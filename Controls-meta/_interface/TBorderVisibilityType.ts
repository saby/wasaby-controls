import * as rk from 'i18n!Controls';
import { StringType } from 'Meta/types';

export const TBorderVisibilityType = StringType.oneOf(['partial', 'hidden'])
    .id('Controls/meta:TBorderVisibilityType')
    .title(rk('Тема оформления'))
    .description(
        rk(
            'Название темы оформления. В зависимости от темы загружаются различные таблицы стилей и применяются различные стили к контролу.'
        )
    );
