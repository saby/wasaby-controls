import { StringType } from 'Types/meta';
import { TNavigationDirection } from 'Controls/interface';

const options: readonly TNavigationDirection[] = [
    'forward',
    'bothways',
    'backward',
] as const;

export const TNavigationDirectionType = StringType.id(
    'Controls/meta:TNavigationDirectionType'
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
