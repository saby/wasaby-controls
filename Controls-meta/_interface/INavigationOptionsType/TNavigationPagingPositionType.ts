import { StringType } from 'Types/meta';
import { TNavigationPagingPosition } from 'Controls/interface';
import * as rk from 'i18n!Controls';

const options: readonly TNavigationPagingPosition[] = [
    'left',
    'right',
] as const;

export const TNavigationPagingPositionType = StringType.oneOf(options)
    .id('Controls/meta:TNavigationPagingPositionType')
    .title(rk('Опция управляет позицией пэйджинга.'))
    .editor(
        () => {
            return import('Controls-editors/properties').then(
                ({ StringEnumEditor }) => {
                    return StringEnumEditor;
                }
            );
        },
        { options }
    );
