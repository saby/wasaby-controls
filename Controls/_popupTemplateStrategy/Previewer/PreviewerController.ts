/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
// eslint-disable-next-line
import {Deferred} from 'Types/deferred';
import {
    StickyController,
    IStickyItem,
} from 'Controls/_popupTemplateStrategy/Sticky/StickyController';
import { IPopupItem, Controller as ManagerController } from 'Controls/popup';
import 'css!Controls/popupTemplate';

export class PreviewerController extends StickyController {
    _openedPopupIds: string[] = [];
    _destroyDeferred: object = {};
    TYPE: string = 'Previewer';

    elementCreated(item: IStickyItem, container: HTMLDivElement): boolean {
        /**
         * Only one window can be opened.
         */
        if (!this._isLinkedPopup(item)) {
            ManagerController.remove(this._openedPopupIds[0]);
        }
        this._openedPopupIds.push(item.id);
        return super.elementCreated.apply(this, arguments);
    }

    elementDestroyed(item: IStickyItem): Promise<void> {
        const itemIndex: number = this._openedPopupIds.indexOf(item.id);
        if (itemIndex > -1) {
            this._openedPopupIds.splice(itemIndex, 1);
        }

        this._destroyDeferred[item.id] = new Deferred();
        item.popupOptions.className =
            (item.popupOptions.className || '') +
            ' controls-PreviewerController_close';
        return this._destroyDeferred[item.id];
    }

    elementAnimated(item: IStickyItem): boolean {
        if (this._destroyDeferred[item.id]) {
            this._destroyDeferred[item.id].callback();
            delete this._destroyDeferred[item.id];
            return true;
        }
        return false;
    }

    beforeElementDestroyed(item: IStickyItem, container: HTMLElement): boolean {
        // Если у previewer есть дочерние окна, то не закрываем его, иначе дочерние тоже закроются.Если закрытие
        // вызывается с пользовательским сценарием с шаблона - то закрытие обрабатываем, т.к. оно в приоритете.
        if (item.removeInitiator !== 'innerTemplate' && item.childs.length) {
            return false;
        }
        return super.beforeElementDestroyed(item, container);
    }

    private _isLinkedPopup(previewerItem: IStickyItem): boolean {
        let item: IPopupItem = previewerItem;
        const parents = [];
        while (item && item.parentId) {
            parents.push(item.parentId);
            item = ManagerController.find(item.parentId);
        }
        for (let i = 0; i < this._openedPopupIds.length; i++) {
            const previewerId = this._openedPopupIds[i];
            if (parents.includes(previewerId)) {
                return true;
            }
        }
        return false;
    }
}

export default new PreviewerController();
