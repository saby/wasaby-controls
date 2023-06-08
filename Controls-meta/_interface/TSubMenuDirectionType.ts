import { StringType } from 'Types/meta';
import { TSubMenuDirection } from 'Controls/menu';

const options: readonly TSubMenuDirection[] = ['bottom', 'right'] as const;

export const TSubMenuDirectionType = StringType.id(
    'Controls/meta:TSubMenuDirectionType'
)
    .oneOf(options)
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
