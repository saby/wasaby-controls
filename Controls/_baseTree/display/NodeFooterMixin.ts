import { MoreButtonVisibility } from 'Controls/display';
import Tree from './Tree';
import TreeItem from './TreeItem';

export default abstract class NodeFooterMixin {
    /**
     * Кнопка "Ещё" нужна всегда кроме следующих случаев:
     *  * Нет данных для загрузки
     *  ИЛИ
     *  * выставлен режим скрытия для последнего узла
     *  * текущий узел является последней записью в коллекции
     *  * не задан футер списка
     */
    shouldDisplayMoreButton(): boolean {
        const dataRow = this.getParent();
        const collection = this.getOwner();
        const dataRowIsLastCollectionItem = collection.getRoot().getLastChildItem() === dataRow;
        const hideForLastNode =
            collection.getMoreButtonVisibility() === MoreButtonVisibility.exceptLastNode;

        const needHide =
            !this.hasMoreStorage('forward') ||
            (hideForLastNode && dataRowIsLastCollectionItem && !collection.getFooter());

        return !needHide;
    }

    abstract getParent(): TreeItem;

    abstract getOwner(): Tree;

    abstract hasMoreStorage(direction: string): boolean;
}
