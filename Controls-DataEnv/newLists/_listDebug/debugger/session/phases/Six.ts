import { AbstractPhase, IPhaseMeta } from './abstract/AbstractPhase';

export interface ISixPhaseMeta extends IPhaseMeta<unknown, unknown> {}

export class SixPhase extends AbstractPhase<ISixPhaseMeta> {
    id: string = 'SixPhase';
    description: string =
        'Фаза от завершения обновление в коде списочного слайса до завершения перерисовки.\n' +
        'В данной фазе происходит применение изменений на коллекцию.';
}
