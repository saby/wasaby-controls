import parseListViewItemClick from './helpers/events/parseListViewItemClick';
import parseGridViewItemClick from './helpers/events/parseGridViewItemClick';

export const events = {
    // TODO: Эта функция должны быть заменены на parseViewItemClick в рамках проекта.
    //  Сейчас они существует только потому что код обработки клика во всех вьюхах по логике должен
    //  и частично делает одно и то-же, но написан по разному.
    //  От этого возможны ошибки, на которые сейчас не хватает рессурсов.
    //  Вероятно октябрь-ноябрь 23г.
    parseListViewItemClick,
    parseGridViewItemClick,
};
