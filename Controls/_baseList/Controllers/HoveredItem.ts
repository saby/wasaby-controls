import { CollectionItem } from 'Controls/display';
import { SyntheticEvent } from 'UICommon/Events';
import { debounce as cDebounce } from 'Types/function';

const DEBOUNCE_HOVERED_ITEM_CHANGED = 150;

const LIST_ITEM_SELECTOR = '.controls-ListView__itemV';

// Вызывает notifyCallback, если поменялся _hoveredItem.
// ВЫнесено из ListView, т.к. в случае Grid Должно быть на уровне Control
export class HoveredItem {
    protected _hoveredItem: CollectionItem;
    private readonly _debouncedSetHoveredItem: Function;
    private readonly _notifyCallback: (data: unknown[]) => void;

    constructor(notifyCallback: (data: unknown[]) => void) {
        this._notifyCallback = notifyCallback;
        this._setHoveredItem = this._setHoveredItem.bind(this);
        this._debouncedSetHoveredItem = cDebounce(
            this._setHoveredItem,
            DEBOUNCE_HOVERED_ITEM_CHANGED
        );
    }

    private _setHoveredItem(item: CollectionItem, event: SyntheticEvent<MouseEvent>): void {
        // setHoveredItem вызывается с задержкой, поэтому список уже может задестроиться
        // Не надо посылать ховер по элементам, которые нельзя выбирать
        if (item && item.SelectableItem === false) {
            return;
        }

        if (item !== this._hoveredItem) {
            this._hoveredItem = item;
            const container =
                event && item !== null ? event.target.closest(LIST_ITEM_SELECTOR) : null;
            const contents = item !== null ? item.contents : null;
            this._notifyCallback([contents, container]);
        }
    }

    setHoveredItem(item: CollectionItem, event: SyntheticEvent<MouseEvent>) {
        return this._debouncedSetHoveredItem(item, event);
    }
}
