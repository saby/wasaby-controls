/**
 * @kaizen_zone 82310f21-8f81-4401-8c95-adb6c73d4248
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
} from 'Controls/_multipleLookup/Input';
