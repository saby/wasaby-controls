import { AbstractPhase, IPhaseMeta } from './abstract/AbstractPhase';

export interface IFourthPhaseMeta extends IPhaseMeta<unknown, unknown> {}

export class FourthPhase extends AbstractPhase<IFourthPhaseMeta> {
    id: string = 'FourthPhase';
    description: string =
        'Фаза прикладного кода ПОСЛЕ вызова платформенной логики обновления\n' +
        'class UserSlice extends ListSlice {\n' +
        '\tprotected _beforeApplyState(nextState) {\n' +
        '\t\tconst finalState = await super._beforeApplyState(nextState);\n' +
        '\t\t--> ДАННАЯ ФАЗА <--\n' +
        '\t\treturn finalState;\n' +
        '\t}\n' +
        '}';
}
