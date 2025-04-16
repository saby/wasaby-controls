import { AbstractPhase, IPhaseMeta } from './abstract/AbstractPhase';

export interface IThirdPhaseMeta extends IPhaseMeta<unknown, unknown> {}

// Фаза платформенной логики. Долгой и тяжелой.
export class ThirdPhase extends AbstractPhase<IThirdPhaseMeta> {
    id: string = 'ThirdPhase';
    description: string =
        'Фаза платформенной логики обновления(тело метода _beforeApplyState у списочного слайса).';
}
