import * as rk from 'i18n!Controls';
import { StringType } from 'Types/meta';

export const TDirectionType = StringType.oneOf(['horizontal', 'vertical'])
    .id('Controls/meta:TDirectionType')
    .title(rk('Направление'))
    .editor(
        () => {
            return import('Controls-editors/properties').then(
                ({ EnumEditor }) => {
                    return EnumEditor;
                }
            );
        },
        {
            options: [
                { value: 'horizontal', caption: rk('Горизонтально') },
                { value: 'vertical', caption: rk('Вертикально') },
            ],
        }
    );
