/**
 * @kaizen_zone 1194f522-9bc3-40d6-a1ca-71248cb8fbea
 */
/**
 * Библиотека контролов, которые служат для отображения одного или нескольких элементов коллекции или выбора элементов
 * из справочника.
 * @library
 * @includes Selector Controls/_lookup/Button
 * @includes Input Controls/_lookup/Lookup
 * @includes ItemTemplate Controls/lookup:ItemTemplate
 * @includes ItemContentTemplate Controls/lookup:ItemContentTemplate
 * @includes Link Controls/_lookup/Lookup/Link
 * @includes Collection Controls/_lookup/SelectedCollection
 * @includes showSelector Controls/_lookup/showSelector
 * @public
 */

/*
 * Lookup library
 * @library
 * @includes Selector Controls/_lookup/Button
 * @includes Input Controls/_lookup/Lookup
 * @includes ItemTemplate Controls/lookup:ItemTemplate
 * @includes Link Controls/_lookup/Lookup/Link
 * @includes Collection Controls/_lookup/SelectedCollection
 * @public
 * @author Крайнов Д.О.
 */

export { default as Selector } from 'Controls/_lookup/Button';
export { default as Input } from 'Controls/_lookup/Lookup';
export { default as Collection } from 'Controls/_lookup/SelectedCollection';
export { default as Link } from 'Controls/_lookup/Lookup/Link';
export { Stack as Opener } from 'Controls/popup';
export { default as showSelector } from 'Controls/_lookup/showSelector';

export { ILookupOptions } from 'Controls/_lookup/Lookup';
export { ISelectorButtonOptions as ISelectorOptions } from 'Controls/_lookup/Button';
export { ToSourceModel } from 'Controls/_lookup/resources/ToSourceModel';
export { default as BaseLookupInput, ILookupInputOptions } from 'Controls/_lookup/BaseLookupInput';
export { default as BaseLookup } from 'Controls/_lookup/BaseLookup';

import { default as ItemTemplate } from 'Controls/_lookup/SelectedCollection/ItemTemplate';
import { default as ItemContentTemplate } from 'Controls/_lookup/SelectedCollection/_ContentTemplate';
import { default as ShowSelectorTemplate } from 'Controls/_lookup/BaseLookupView/resources/showSelectorTemplate';
export {
    ItemTemplate,
    ItemContentTemplate,
    ItemTemplate as ButtonItemTemplate,
    ShowSelectorTemplate,
};
