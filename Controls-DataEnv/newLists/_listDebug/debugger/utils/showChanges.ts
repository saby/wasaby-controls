import { IOutput } from '../output/IOutput';
import { IChange, prettifyChange } from './getChanges';

export const showChanges = (
    output: IOutput,
    changes: IChange[],
    showErrorIfEmpty: boolean = true
): void => {
    if (!changes.length) {
        if (showErrorIfEmpty) {
            output.add('info', ['Нет изменения в состоянии (Бесполезное обновление).'], 'warning');
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
