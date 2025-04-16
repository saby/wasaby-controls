import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import { AbstractPhase, IPhaseMeta } from './abstract/AbstractPhase';

// apiCalls and resultState
export interface IFirstPhaseMeta extends IPhaseMeta<TAbstractAction[], unknown> {}

export class FirstPhase extends AbstractPhase<IFirstPhaseMeta> {
    id: string = 'FirstPhase';
    description: string =
        'Первая фаза обновления, в которой происходит "быстрая" обработка входящих действий.\n' +
        '"Быстрая" в данном случае означает, что на данной фазе не происходит загрузки данных и длительных операций.\n' +
        'В результате обработки, получим промежуточное состояние слайса, ' +
        'которое отдадим прикладному разработчику.';
}
