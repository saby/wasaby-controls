/**
 * Библиотека контролов, которые позволяют организовать фиксацию элементов.
 * @library
 * @includes StickyBlock Controls/_stickyBlock/StickyBlock
 * @public
 */

export { default as StickyBlock } from 'Controls/_stickyBlock/WasabyWrappers/StickyBlockWasaby';
export { default as StickyGroupedBlock } from 'Controls/_stickyBlock/WasabyWrappers/StickyGroupedBlockWasaby';
export { default as StickyGroup } from 'Controls/_stickyBlock/ContextConsumingWrappers/StickyGroupWrapper';
export { default as _StickyController } from 'Controls/_stickyBlock/Controllers/StickyController';
export {
    IFixedEventData,
    StickyPosition,
    TypeFixedBlocks,
    IStickyDataContext as _IStickyDataContext,
    IStickyGroupDataContext as _IStickyGroupDataContext,
} from 'Controls/_stickyBlock/types';
import {
    StickyContext as _StickyContext,
    StickyGroupContext as _StickyGroupContext,
} from 'Controls/_stickyBlock/StickyContextReact';
import {
    isStickySupport,
    getNextId as getNextStickyId,
    getOffset as getStickyOffset,
    isHidden as isStickyHidden,
} from 'Controls/_stickyBlock/Utils/Utils';
import {
    getHeadersHeight as getStickyHeadersHeight,
    getHeadersWidth as getStickyHeadersWidth,
} from 'Controls/_stickyBlock/Utils/getHeadersHeight';
// Не импортировать. Экспорт StickyBlockReactView сделан только для демок.
import _StickyBlockReactView from 'Controls/_stickyBlock/StickyBlockReactView';

export {
    _StickyContext,
    _StickyGroupContext,
    isStickySupport,
    getNextStickyId,
    getStickyOffset,
    getStickyHeadersHeight,
    getStickyHeadersWidth,
    _StickyBlockReactView,
    isStickyHidden,
};
