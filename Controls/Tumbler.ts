/**
 * @kaizen_zone 26dca2da-6261-4215-a9df-c822621bceb3
 */
import * as ItemTemplate from 'wml!Controls/_Tumbler/itemTemplate';
import * as tumblerItemCounterTemplate from 'wml!Controls/_Tumbler/itemCounterTemplate';
import * as tumblerItemIconTemplate from 'wml!Controls/_Tumbler/itemIconTemplate';
import { ITumblerItemIconTemplate } from './_Tumbler/Interfaces/ITumblerItemIconTemplate';
import { ITumblerItemCounterTemplate } from './_Tumbler/Interfaces/ITumblerItemCounterTemplate';
import { ITumblerItem } from './_Tumbler/Interfaces/ITumblerItem';
import Control from './_Tumbler/Control';
/**
 * Библиотека, которая реализует кнопочный переключатель.
 * @library
 * @includes ITumblerItem Controls/_Tumbler/Interfaces/ITumblerItem
 * @includes ITumblerItemIconTemplate Controls/_Tumbler/interface/ITumblerItemIconTemplate
 * @includes ITumblerItemCounterTemplate Controls/_Tumbler/interface/ITumblerItemCounterTemplate
 * @public
 */
export {
    Control,
    ITumblerItem,
    ITumblerItemIconTemplate,
    ITumblerItemCounterTemplate,
    ItemTemplate,
    tumblerItemCounterTemplate,
    tumblerItemIconTemplate,
};
