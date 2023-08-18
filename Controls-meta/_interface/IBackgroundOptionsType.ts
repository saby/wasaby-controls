import * as rk from 'i18n!ExtControls';
import { ObjectType } from 'Types/meta';

export const IBackgroundOptionsType = ObjectType.id('Controls/meta:IBackgroundOptionsType')
    .title(rk('Фон'))
    .description(rk('Настройка фона.'))
    .editor(
        () => {
            return import('Controls-editors/properties').then(({ BackgroundEditor }) => {
                return BackgroundEditor;
            });
        },
        {}
    );
