/**
 * Библиотека интерфейсов для модуля, содержащего контролы и контексты работы с данными
 * @library
 * @public
 * @module
 */
export { TKey, TSingleAxisDirection, ValidateShape } from './_interface/UtilityTypes';
export { ISelection } from './_interface/ISelection';
export { TFilter, IFilterOptions } from './_interface/IFilter';
export { TPath } from './_interface/IPath';
export { ISourceOptions, TSourceOption } from './_interface/ISource';
export { TViewMode, validViewMode } from './_interface/IViewMode';
export {
    default as IFilterDescriptionItem,
    IFilterItemBase,
    TViewMode as TFilterViewMode,
} from './_interface/IFilterDescriptionItem';
