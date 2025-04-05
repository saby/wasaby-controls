import { IOutput } from '../output/IOutput';
import { TChangeStep } from './TChangeStep';

export enum Prefix {
    Li = '\t- ',
    Mutation = '[Mutation]: ',
}

export type TPrintPairArgs = {
    output: IOutput;
    optionKey: string;
    steps: [TChangeStep, TChangeStep];
    prefix: Prefix;
    printCallback?: () => void;
};
