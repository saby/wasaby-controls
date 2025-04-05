import { TChange } from '../../session/ChangesStorage';
import * as MSG from '../../printer/common/MSG';
import { getSender } from '../../utils/patchAction';
import { IListState } from 'Controls-DataEnv/list';
import { IOutput } from '../../output/IOutput';
import { TChangeStep } from '../../types/TChangeStep';
import { TChangeMapper } from '../../types/TChangeMapper';
import { Prefix, TPrintPairArgs } from '../../types/TPrintPair';

type TPrintChangesArgs<TState extends IListState = IListState> = {
    printPairFn: (args: TPrintPairArgs) => void;
    output: IOutput;
    changes: TChange[];
    prefix: Prefix;
    changeMapper?: TChangeMapper<TState>;
    printCallback?: (steps: TChangeStep[], output: IOutput, optionKey: string) => void;
};

export function printChanges<TState extends IListState = IListState>({
    printPairFn,
    changes,
    changeMapper,
    prefix,
    output,
    printCallback,
}: TPrintChangesArgs<TState>) {
    const changesByOption = changes.reduce(
        (acc, current) => {
            acc[current.key] = acc[current.key] || [];
            acc[current.key].push(current);
            return acc;
        },
        {} as Record<string, TChange[]>
    );

    Object.keys(changesByOption).forEach((optionKey) => {
        const steps = getChangeSteps(changesByOption[optionKey], changeMapper);

        if (steps.length === 2) {
            printPairFn({
                output,
                optionKey,
                steps: steps as [TChangeStep, TChangeStep],
                prefix,
            });
        } else {
            printPairFn({
                output,
                optionKey,
                steps: [steps[0], steps[steps.length - 1]],
                prefix,
                printCallback: printCallback && (() => printCallback(steps, output, optionKey)),
            });
        }
    });
}

function getChangeSteps<TState extends IListState = IListState>(
    optionChanges: TChange[],
    changeMapper?: TChangeMapper<TState>
): TChangeStep[] {
    if (!optionChanges?.length) {
        return [];
    }

    const getValue = (key: string, value: unknown): unknown => {
        return wrapStringValue(
            changeMapper?.(key as keyof TState, value as TState[keyof TState]) ?? value
        );
    };

    const res: TChangeStep[] = [
        {
            value: getValue(optionChanges[0].key, optionChanges[0].prev),
            status: 'default',
        },
    ];

    optionChanges.forEach(
        ({ key, prev, next, isEqualValue, isEqualRef, phaseId, initiator }, index) => {
            res.push({
                value: getValue(key, next),
                status: !isEqualRef
                    ? isEqualValue
                        ? 'warning2'
                        : 'default'
                    : !isEqualValue
                    ? 'error'
                    : 'default',
                senderName: extractSender({ phaseId, initiator }),
            });
            if (index > 0 && prev !== optionChanges[index - 1].next) {
                // TODO
                throw Error('!!!!');
            }
        }
    );

    return res;
}

export function extractSender({ initiator, phaseId }: Pick<TChange, 'initiator' | 'phaseId'>) {
    const action = initiator?.getMeta()?.action;
    const actionType = action ? String(action.type) : '';
    const actionSender = action ? MSG.getShortMWName(String(getSender(action))) : '';
    return (
        (phaseId ? `${phaseId}::` : 'вне фазы') +
        (action ? `${actionSender}->${actionType}` : 'вне действия')
    );
}

export function wrapStringValue(value: unknown) {
    if (typeof value === 'string') {
        return `'${value}'`;
    }

    if (typeof value === 'undefined') {
        return 'undefined';
    }

    return value;
}
