import type { Collection as ICollection } from 'Controls/display';
import { IMarkerStrategy } from '../common/strategy/IMarkerStrategy';
import { IAbstractMarkerStrategyProps } from '../common/strategy/AbstractMarkerStrategy';
import { MultiColumnMarkerStrategy } from '../common/strategy/MultiColumn';
import { SingleColumnMarkerStrategy } from '../common/strategy/SingleColumn';
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
        : new SingleColumnMarkerStrategy(params);
}
