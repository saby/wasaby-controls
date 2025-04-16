import { IListState } from 'Controls-DataEnv/list';
import { IOutput, TOutputItemStatus } from '../../output/IOutput';
import { TChange } from '../../session/ChangesStorage';
import { printChanges as printChangesBase } from '../common/printStateMutations';
import { TChangeStep } from '../../types/TChangeStep';
import { Prefix, TPrintPairArgs } from '../../types/TPrintPair';
import { TChangeMapper } from '../../types/TChangeMapper';
import { tabulate } from '../../utils/tabulate';

const getAccumulativeStatus = (steps: TChangeStep[]): TOutputItemStatus => {
    const sts: TOutputItemStatus[] = [
        'attention3',
        'attention2',
        'attention1',

        'warning3',
        'warning2',
        'warning1',
        'warning',

        'error3',
        'error2',
        'error1',
        'error',
    ];

    for (let i = 0; i < sts.length; i++) {
        if (steps.some((s) => s.status === sts[i])) {
            if (i === sts.length - 1) {
                return sts[i];
            } else {
                return sts[i + 1];
            }
        }
    }

    return 'default';
};

export const printChanges = <TState extends IListState = IListState>(
    output: IOutput,
    changes: TChange[],
    prefix: Prefix,
    changeMapper?: TChangeMapper<TState>
) =>
    printChangesBase({
        printPairFn: printPair,
        printCallback: printTrace,
        prefix,
        changes,
        output,
        changeMapper,
    });

/**
 *
 * @param output
 * @param changes
 * @param showStatus
 * @param ifEmpty
 * @param changeMapper
 * @private
 */
export function printStateMutations<TState extends IListState = IListState>(
    output: IOutput,
    changes: TChange[] | undefined,
    showStatus: boolean = true,
    ifEmpty: 'hide' | 'warn' | 'show' = 'show',
    changeMapper?: TChangeMapper<TState>
) {
    const hasChanges = !!changes?.length;

    if (hasChanges) {
        output.add('groupCollapsed', [`State mutations ${showStatus ? '(changed)' : ''}`]);
        printChanges(output, changes as [], Prefix.Li, changeMapper);
        output.add('groupEnd');
    } else if (ifEmpty === 'warn') {
        output.add('groupCollapsed', ['State mutations (unchanged)'], 'error3');
        output.add('info', ['Изменений не произошло'], 'error3');
        output.add('groupEnd');
    }
}

const isPrimitive = (v: unknown) => v !== Object(v);

export function printTrace(steps: TChangeStep[], output: IOutput) {
    steps.forEach((step, i) => {
        output.add(
            'info',
            [
                step.senderName ? `${tabulate(i + 2)}-> ${step.senderName}\n` : '',
                `${tabulate(i + 2)}${step.senderName ? '  ' : '-> '}`,
                step.value,
            ],
            step.status
        );
    });
}

function printPair({ output, optionKey, steps, prefix, printCallback }: TPrintPairArgs) {
    const args: unknown[] = [`${prefix}${optionKey}`];

    if (steps.some((s) => !isPrimitive(s.value))) {
        args.push({ from: steps[0].value }, '->', { to: steps[1].value });
    } else {
        args.push(steps[0].value, '->', steps[1].value);
    }

    output.add(
        printCallback ? 'groupCollapsed' : 'info',
        [...args, steps[1].senderName && prefix === Prefix.Li ? `\t// ${steps[1].senderName}` : ''],
        getAccumulativeStatus(steps)
    );

    if (printCallback) {
        printCallback();
        output.add('groupEnd');
    }
}
