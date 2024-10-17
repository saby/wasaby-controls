/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
/**
 * Библиотека устаревших контролов, предназначенных для загрузки данных в списке.
 * @deprecated Контролы устарели. Используйте опцию storeId.
 * @library
 * @includes DataContainer Controls/_listDataOld/DataContainer
 * @includes ListContainer Controls/_listDataOld/WrappedContainer
 * @public
 */
export { default as DataContainer } from 'Controls/_listDataOld/DataContainer';
export { default as ListContainer } from 'Controls/_listDataOld/WrappedContainer';
export { default as ListContainerEventConverter } from 'Controls/_listDataOld/ListContainerEventConverter';

export {
    SlicelessBaseControlCompatibility,
    OldBaseControlLogic,
    TSlicelessBaseControlCompatibility,
    TMarkerMoveDirection,
} from 'Controls/_listDataOld/compatibility/SlicelessBaseControlCompatibility';

export {
    SlicelessBaseTreeCompatibility as SlicelessBaseTreeControlCompatibility,
    OldTreeLogic as OldBaseTreeControlLogic,
    TSlicelessBaseTreeCompatibility as TSlicelessBaseTreeControlCompatibility,
} from 'Controls/_listDataOld/compatibility/SlicelessBaseTreeCompatibility';
