import { AbstractPhase, IPhaseMeta } from './abstract/AbstractPhase';

// stateToUserBas, statePassedIntoPlatformBas
export interface ISecondPhaseMeta extends IPhaseMeta<unknown, unknown> {}

export class SecondPhase extends AbstractPhase<ISecondPhaseMeta> {
    id: string = 'SecondPhase';
    description: string =
        'Фаза прикладного кода ПЕРЕД вызовом платформенной логики обновления\n' +
        'class UserSlice extends ListSlice {\n' +
        '\tprotected _beforeApplyState(nextState) {\n' +
        '\t\t--> ДАННАЯ ФАЗА <--\n' +
        '\t\treturn super._beforeApplyState(nextState)\n' +
        '\t}\n' +
        '}';
}
