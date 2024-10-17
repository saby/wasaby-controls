import parseListViewItemClick from './helpers/events/parseListViewItemClick';
import parseGridViewItemClick from './helpers/events/parseGridViewItemClick';
import parseViewKeyDown from './helpers/events/parseViewKeyDown';
import parseTreeGridViewItemClick from './helpers/events/parseTreeGridViewItemClick';

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
};

export * from './helpers/workWithSliceHelpers';
