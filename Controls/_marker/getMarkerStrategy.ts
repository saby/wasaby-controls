import type { Collection as ICollection } from 'Controls/display';
import { IMarkerStrategy } from './strategy/IMarkerStrategy';
import { IAbstractMarkerStrategyProps } from './strategy/AbstractMarkerStrategy';
import { MultiColumnMarkerStrategy } from './strategy/MultiColumn';
import { SingleColumnMarkerStrategy } from './strategy/SingleColumn';
import { loadSync } from 'WasabyLoader/ModulesLoader';

export function getMarkerStrategy(
    collection: ICollection,
    params?: IAbstractMarkerStrategyProps
): IMarkerStrategy {
    // TODO: realize moveMarkerOnScrollPaging
    return loadSync<typeof import('Controls/dataFactory')>(
        'Controls/dataFactory'
    ).resolveCollectionType(collection) === 'Columns'
        ? // FIXME: Наследование моделей сломано
          (new MultiColumnMarkerStrategy(params) as unknown as IMarkerStrategy)
        : (new SingleColumnMarkerStrategy(params) as IMarkerStrategy);
}
