/**
 * @kaizen_zone 8a007aef-e1f2-4f41-bc80-24c6788c18db
 */
/**
 * Библиотека, которая предоставляет функционал для отметки {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркером}.
 * @library
 * @public
 */

import { Controller as MarkerController } from 'Controls/_marker/Controller';
import {
    TVisibility,
    Visibility,
    IMarkerListOptions,
    IMarkerStrategyCtor,
    TMarkerController,
} from 'Controls/_marker/interface';
export {
    MarkerController,
    TMarkerController,
    TVisibility,
    Visibility,
    IMarkerListOptions,
    IMarkerStrategyCtor,
};

export { SingleColumnMarkerStrategy } from 'Controls/_marker/strategy/SingleColumn';
export { MultiColumnMarkerStrategy } from 'Controls/_marker/strategy/MultiColumn';
export { getMarkerStrategy } from 'Controls/_marker/getMarkerStrategy';
