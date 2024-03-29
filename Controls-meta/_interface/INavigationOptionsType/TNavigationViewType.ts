import { StringType } from 'Types/meta';
import { TNavigationView } from 'Controls/interface';
import * as rk from 'i18n!Controls';

const options: readonly TNavigationView[] = [
    'infinity',
    'pages',
    'demand',
    'maxCount',
    'cut',
] as const;

export const TNavigationViewType = StringType.oneOf(options)
    .id('Controls/meta:TNavigationViewType')
    .title(rk('Виды визуальной навигации'))
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
