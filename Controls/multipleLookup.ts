/**
 * @kaizen_zone 1194f522-9bc3-40d6-a1ca-71248cb8fbea
 */
/**
 * Библиотека контролов, которые служат для отображения одного или нескольких элементов коллекции или выбора элементов
 * из справочника.
 * @library
 * @includes Input Controls/_multipleLookup/Input
 * @includes Input Controls/_multipleLookup/Input
 * @includes PlaceholderChooser Controls/_multipleLookup/PlaceholderChooser
 * @public
 */

export { default as PlaceholderChooser } from 'Controls/_multipleLookup/PlaceholderChooser';
export { default as IInput } from 'Controls/_multipleLookup/interface/IInput';
export {
    default as Input,
    IInputOptions,
    ILookupInputOptions,
    TMultipleLookupValidationStatus,
} from 'Controls/_multipleLookup/Input';
