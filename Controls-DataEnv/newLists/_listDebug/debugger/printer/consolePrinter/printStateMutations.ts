import { IOutput, TOutputItemStatus } from '../../output/IOutput';
import { TChange } from '../../session/ChangesStorage';
import { TDebugMode } from '../../types/TDebugMode';
import { getSender } from '../../utils/patchAction';
import * as MSG from './MSG';

type TChangeStep = { value: unknown; status: TOutputItemStatus; senderName?: string };

const tabulate = (index: number) => `${new Array(index).fill('\t').join('')}`;

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

export function printStateMutations(
    output: IOutput,
    changes: TChange[] | undefined,
    debugMode: TDebugMode,
    showStatus: boolean = true,
    ifEmpty: 'hide' | 'warn' | 'show' = 'show'
) {
    const hasChanges = !!changes?.length;

    if (hasChanges) {
        output.add('groupCollapsed', [`State mutations ${showStatus ? '(changed)' : ''}`]);
        printChanges(output, changes as [], debugMode, Prefix.Li);
        output.add('groupEnd');
    } else if (ifEmpty === 'warn') {
        output.add('groupCollapsed', ['State mutations (unchanged)'], 'error3');
        output.add('info', ['Изменений не произошло'], 'error3');
        output.add('groupEnd');
    }
}

const isPrimitive = (v: unknown) => v !== Object(v);

export enum Prefix {
    Li = '\t- ',
    Mutation = '[Mutation]: ',
}

const printPair = (
    output: IOutput,
    optionKey: string,
    steps: [TChangeStep, TChangeStep],
    prefix: Prefix,
    cb?: () => void
) => {
    const args: unknown[] = [`${prefix}${optionKey}`];

    if (steps.some((s) => !isPrimitive(s.value))) {
        args.push({ from: steps[0].value }, '->', { to: steps[1].value });
    } else {
        args.push(steps[0].value, '->', steps[1].value);
    }

    output.add(
        cb ? 'groupCollapsed' : 'info',
        [...args, steps[1].senderName && prefix === Prefix.Li ? `\t// ${steps[1].senderName}` : ''],
        getAccumulativeStatus(steps)
    );

    if (cb) {
        cb();
        output.add('groupEnd');
    }
};

export function printChanges(
    output: IOutput,
    changes: TChange[],
    _debugMode: TDebugMode,
    prefix: Prefix
) {
    const changesByOption = changes.reduce(
        (acc, current) => {
            acc[current.key] = acc[current.key] || [];
            acc[current.key].push(current);
            return acc;
        },
        {} as Record<string, TChange[]>
    );

    Object.keys(changesByOption).forEach((optionKey) => {
        const steps = getChangeSteps(changesByOption[optionKey]);

        if (steps.length === 2) {
            printPair(output, optionKey, steps as [TChangeStep, TChangeStep], prefix);
        } else {
            printPair(output, optionKey, [steps[0], steps[steps.length - 1]], prefix, () => {
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
            });
        }
    });
}

function getChangeSteps(optionChanges: TChange[]): TChangeStep[] {
    if (!optionChanges?.length) {
        return [];
    }

    const extractSender = ({ initiator, phaseId }: Pick<TChange, 'initiator' | 'phaseId'>) => {
        const action = initiator?.getMeta()?.action;
        const actionType = action ? String(action.type) : '';
        const actionSender = action ? MSG.getShortMWName(String(getSender(action))) : '';
        return (
            (phaseId ? `${phaseId}::` : 'вне фазы') +
            (action ? `${actionSender}->${actionType}` : 'вне действия')
        );
    };

    const res: TChangeStep[] = [
        {
            value: optionChanges[0].prev,
            status: 'default',
            senderName: undefined,
        },
    ];

    optionChanges.forEach(({ prev, next, isEqualValue, isEqualRef, phaseId, initiator }, index) => {
        res.push({
            value: next,
            status: !isEqualRef
                ? isEqualValue
                    ? 'warning2'
                    : 'default'
                : !isEqualValue
                ? 'error'
                : 'default',
            senderName: extractSender({ phaseId, initiator }),
        });
        if (prev !== res[index].value) {
            // TODO
            throw Error('!!!!');
        }
    });

    return res;
}
