/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { IOutput, TOutputStyle } from '../output/IOutput';
import { IChange, prettifyChange } from './getChanges';
import { HAS_NO_CHANGES } from '../MessageDescriptors';

export const showChanges = (
    output: IOutput,
    changes: IChange[],
    style: TOutputStyle,
    showErrorIfEmpty: boolean = true
): void => {
    if (!changes.length) {
        if (showErrorIfEmpty) {
            output.add('info', [HAS_NO_CHANGES(style)], 'warning');
        }
        return;
    }

    changes.forEach(({ key, prev, next, isEqualValue, isEqualRef }) => {
        const status = !isEqualRef
            ? isEqualValue
                ? 'warning'
                : undefined
            : !isEqualValue
            ? 'error'
            : undefined;

        output.add('info', [key, ...prettifyChange(prev, next)], status);
    });
};
