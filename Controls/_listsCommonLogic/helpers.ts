import parseListViewItemClick from './helpers/events/parseListViewItemClick';
import parseGridViewItemClick from './helpers/events/parseGridViewItemClick';
import parseItemSwipe from './helpers/events/parseItemSwipe';
import parseViewKeyDown from './helpers/events/parseViewKeyDown';
import parseTreeGridViewItemClick from './helpers/events/parseTreeGridViewItemClick';
import {
    getHandlers,
    IItemEventHandlers,
    TItemDeactivatedHandler,
    TItemMouseEventHandler,
} from './helpers/events/getItemEventHandlers';
import { getNativeMouseEvent } from './helpers/events/getNativeMouseEvent';

export { IItemEventHandlers, TItemDeactivatedHandler, TItemMouseEventHandler };

export const events = {
    // TODO: Эта функция должны быть заменены на parseViewItemClick в рамках проекта.
    //  Сейчас они существует только потому что код обработки клика во всех вьюхах по логике должен
    //  и частично делает одно и то-же, но написан по разному.
    //  От этого возможны ошибки, на которые сейчас не хватает рессурсов.
    //  Вероятно октябрь-ноябрь 23г.
    parseListViewItemClick,
    parseGridViewItemClick,
    parseTreeGridViewItemClick,
    parseViewKeyDown,
    getItemEventHandlers: getHandlers,
    getNativeMouseEvent,
    parseItemSwipe,
};

export * from './helpers/workWithSliceHelpers';
export { getModelsDifference } from './helpers/getModelsDifference';
export { throttleWrapper } from './helpers/throttleWrapper';
