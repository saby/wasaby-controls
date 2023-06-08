/**
 * @kaizen_zone 76d0517f-7dae-4c08-9a57-f5b6e1cc9bfe
 */
/**
 * Библиотека, которая предоставляет функционал для отметки {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркером}.
 * @library
 * @private
 * @includes IMarkerList Controls/_marker/interface/IMarkerList
 */

import { Controller as MarkerController } from 'Controls/_marker/Controller';
import {
    TVisibility,
    Visibility,
    IMarkerListOptions,
    IMarkerStrategyOptions,
} from 'Controls/_marker/interface';
import { default as MultiColumnStrategy } from 'Controls/_marker/strategy/MultiColumn';
import { default as SingleColumnStrategy } from 'Controls/_marker/strategy/SingleColumn';

export {
    MarkerController,
    TVisibility,
    Visibility,
    IMarkerListOptions,
    MultiColumnStrategy,
    IMarkerStrategyOptions,
    SingleColumnStrategy,
};
