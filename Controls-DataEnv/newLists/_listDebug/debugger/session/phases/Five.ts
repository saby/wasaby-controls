import { AbstractPhase, IPhaseMeta, TInferBefore, TInferAfter } from './abstract/AbstractPhase';
import { offModuleLoaded, onModuleLoaded } from 'WasabyLoader/ModulesLoader';

export interface IFivePhaseMeta
    extends IPhaseMeta<
        unknown,
        {
            state: unknown;
            loadedDeps: string[];
        }
    > {}

export class FivePhase extends AbstractPhase<IFivePhaseMeta> {
    id: string = 'FivePhase';
    description: string =
        'Фаза платформенного _endUpdate.\n' +
        'В данной фазе происходит финальная валидация состояния, выбрасывание ' +
        'исключений и дружелюбных ошибок для программиста.';

    private _modulesLoaded: string[] = [];

    constructor() {
        super();
        this._onModuleLoaded = this._onModuleLoaded.bind(this);
    }

    start(meta: TInferBefore<IFivePhaseMeta>) {
        super.start(meta);
        this._modulesLoaded = [];
        this._startCollectionRequests();
    }

    end(meta: TInferAfter<IFivePhaseMeta>) {
        super.end({
            state: meta,
            loadedDeps: this._endCollectionRequests(),
        });
    }

    private _startCollectionRequests() {
        onModuleLoaded(this._onModuleLoaded);
    }
    private _endCollectionRequests() {
        const result = this._modulesLoaded;
        offModuleLoaded(this._onModuleLoaded);
        this._modulesLoaded = [];
        return result;
    }

    private _onModuleLoaded(name: string): void {
        this._modulesLoaded.push(name);
    }
}
