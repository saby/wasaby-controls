import { IListState } from 'Controls-DataEnv/list';
import { IOutput } from '../../output/IOutput';
import { TChange } from '../../session/ChangesStorage';
import { TChangeMapper } from '../../types/TChangeMapper';
import { Prefix, TPrintPairArgs } from '../../types/TPrintPair';
import { TChangeStep } from '../../types/TChangeStep';
import { printChanges } from '../common/printStateMutations';
import { tabulate } from '../../utils/tabulate';

const isPrimitive = (v: unknown) => v !== Object(v);

/**
 *
 * @param output
 * @param changes
 * @param ifEmpty
 * @param changeMapper
 * @private
 */
export function printStateMutations<TState extends IListState = IListState>(
    output: IOutput,
    changes: TChange[] | undefined,
    ifEmpty: 'hide' | 'warn' | 'show' = 'show',
    changeMapper?: TChangeMapper<TState>
) {
    const hasChanges = !!changes?.length;

    if (hasChanges) {
        printChanges({
            printPairFn: printPair,
            output,
            changes,
            prefix: Prefix.Li,
            changeMapper,
            printCallback: printTrace,
        });
    } else if (ifEmpty === 'warn') {
        output.add('info', ['Изменений не произошло']);
    }
}

const printPair = ({ output, optionKey, steps, prefix, printCallback }: TPrintPairArgs) => {
    const args: unknown[] = [`${prefix}${optionKey}`];

    if (steps.some((s) => !isPrimitive(s.value))) {
        args.push({ from: steps[0].value }, '->', {
            to: steps[1].value,
        });
    } else {
        args.push(steps[0].value, '->', steps[1].value);
    }

    output.add('info', [...args]);

    printCallback?.();
};

function printTrace(steps: TChangeStep[], output: IOutput, optionKey: string) {
    steps.forEach((step, i) => {
        output.add('info', [`${tabulate(i + 2)}${optionKey}`, step.value]);
    });
}
