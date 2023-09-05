import * as rk from 'i18n!Controls';
import { StringType } from 'Types/meta';

export const IThemeType = StringType.id('Controls/meta:IThemeType')
    .title(rk('Тема оформления'))
    .description(
        rk(
            'Название темы оформления. В зависимости от темы загружаются различные таблицы стилей и применяются различные стили к контролу.'
        )
    )
    .editor(() => {
        return import('Controls-editors/properties').then(({ StringEditor }) => {
            return StringEditor;
        });
    });
