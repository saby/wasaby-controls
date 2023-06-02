import * as rk from 'i18n!Controls';
import { StringType } from 'Types/meta';
import { TNodeHistoryType as BaseTNodeHistoryType } from 'Controls/interface';

const options: readonly BaseTNodeHistoryType[] = [
    'node',
    'group',
    'all',
] as const;

export const TNodeHistoryType = StringType.oneOf(options)
    .id('Controls/meta:TNodeHistoryType')
    .title(rk('Тип сохраняемых в историю узлов'))
    .description(rk('Тип сохраняемых в историю узлов'))
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
