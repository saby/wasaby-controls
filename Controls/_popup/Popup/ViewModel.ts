import { IPopupOptions, IPopupItem } from 'Controls/_popup/interface/IPopup';
import { List } from 'Types/collection';

interface IViewModel {
    finishPendingsCallback: Function;
    removeCallback: Function;
    updateCallback: Function;
    closeChildCallback: Function;
}

class ViewModel {

    private _finishPendingsCallback: Function;
    private _removeCallback: Function;
    private _updateCallback: Function;
    private _closeChildCallback: Function;

    private _items: List<IPopupItem> = new List();
    constructor(props: IViewModel) {
        this._finishPendingsCallback = props.finishPendingsCallback;
        this._removeCallback = props.removeCallback;
        this._updateCallback = props.updateCallback;
        this._closeChildCallback = props.closeChildCallback;
    }

    addElement(item: IPopupItem): void {
        this._items.add(item);
    }

    updateElement(item: IPopupItem, newConfig: IPopupOptions): void {
        const oldOptions: IPopupOptions = item.popupOptions;
        item.popupOptions = newConfig;
        // Оставляем старый content, т.к. нет смысла его обновлять при повторном вызове open
        item.popupOptions.content = oldOptions.content;

        // Повторный вызов open используют в 2х сценариях - когда хотят открыть "новый" документ и когда просто
        // хотят обновить часть опций, не задавая новый контекст открытия.
        // Во 2м случае обновления z-index быть не должно.
        // Пример https://online.sbis.ru/opendoc.html?guid=1f38986e-d9fc-4210-b65a-3c5eca75ecb8
        // Сделаем поведение опциональным
        if (item.popupOptions.shouldUpdateZIndex) {
            this._moveToTop(item);
        }
    }

    removeElement(item: IPopupItem): Promise<void> {
        if (!this.find(item.id)) {
            return Promise.resolve(null);
        }

        this._updateCallback(item);
        return new Promise((resolve) => {
            const removeElement = () => {
                this._removeCallback(item).then(() => {
                    resolve();
                    const parentItem = this.find(item.parentId);
                    this._closeChildCallback(parentItem);
                });
            };
            if (item.childs.length) {
                this._finishPendingsCallback(item.id, null, null, () => {
                    this._closeChildren(item).then(removeElement);
                });
            } else {
                this._closeChildren(item).then(() => {
                    this._finishPendingsCallback(item.id, null, null, removeElement);
                });
            }
        });
    }

    find(id: string): IPopupItem {
        const index = this._items.getIndexByValue('id', id);
        if (index !== -1) {
            return this._items.at(index);
        }
        return null;
    }

    getPopupItems(): List<IPopupItem> {
        return this._items;
    }

    updateItemsList(): void {
        this._items._nextVersion();
    }

    private _closeChildren(item: IPopupItem): Promise<null> {
        if (!item.childs.length) {
            return Promise.resolve(null);
        }
        for (let i = 0; i < item.childs.length; i++) {
            this.removeElement(item.childs[i]);
        }

        return new Promise((resolve) => {
            item.closeChildrenPromiseResolver = resolve;
        });
    }

    // Если из текушего окна не открыто других окон, то поднимем его выше среди окон того же уровня (с тем же родителем)
    // при переоткрытии.
    private _moveToTop(item: IPopupItem): void {
        let itemIndex;
        let newIndex;
        const hasChild = item.childs.length > 0;
        const hasParent = !!item.parentId;
        if (hasChild || hasParent) {
            return;
        }
        this._items.each((element: IPopupItem, index: number) => {
            if (item === element) {
                itemIndex = index;
            } else if (itemIndex !== undefined) {
                if (element.parentId === item.parentId) {
                    newIndex = index;
                }
            }
        });
        if (itemIndex !== undefined && newIndex !== undefined) {
            this._items.move(itemIndex, newIndex);
        }
    }
}

export default ViewModel;