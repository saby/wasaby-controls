/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
/**
 * Библиотека контролов, которые служат для {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/ организации поиска в списках}.
 * @markdown
 * @library
 * @includes IExpandableInput Controls/search:IExpandableInput
 * @includes InputContainer Controls/_search/Input/Container
 * @public
 */

/*
 * Search library
 * @library
 * @includes IExpandableInput Controls/search:IExpandableInput
 * @public
 * @author Крайнов Д.О.
 */

import * as searchButtonTemplate from 'wml!Controls/_search/Input/SearchTemplate/searchButton';
export { default as Misspell } from 'Controls/_search/Misspell';
export { default as MisspellContainer } from 'Controls/_search/Misspell/Container';
export { default as ControllerClass, ISearchControllerOptions } from './_search/ControllerClass';
export { ISearchInputContainerOptions } from './_search/Input/Container';
export { default as SearchResolver } from './_search/SearchResolver';
export { default as Input } from 'Controls/_search/Input/WrappedSearch';

import getSwitcherStrFromData = require('Controls/_search/Misspell/getSwitcherStrFromData');
export { getSwitcherStrFromData, searchButtonTemplate };
export { default as InputContainer } from './_search/Input/WrappedContainer';
