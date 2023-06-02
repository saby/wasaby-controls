import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/Popup/Sticky/ZIndexCallback/templates/Stack';
import 'css!DemoStand/Controls-demo';
import { StickyOpener, IPopupItemInfo } from 'Controls/popup';
import { List } from 'Types/collection';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _stickyOpener: StickyOpener = new StickyOpener();

    protected _beforeMount(): void {
        this._zIndexCallback = this._zIndexCallback.bind(this);
    }

    protected _openClickHandler(event: Event): void {
        this._stickyOpener.open({
            template:
                'wml!Controls-demo/Popup/Sticky/ZIndexCallback/templates/Sticky',
            opener: this,
            target: event.currentTarget,
            targetPoint: {
                vertical: 'bottom',
                horizontal: 'left',
            },
            closeOnOutsideClick: true,
            zIndexCallback: this._zIndexCallback,
        });
    }

    protected _zIndexCallback(
        currentItem: IPopupItemInfo,
        popupList: List<IPopupItemInfo>
    ): number {
        if (popupList) {
            // Получаем предыдущий(родительский) item и получаем его значение zIndex.
            const prevItem = popupList.at(popupList.getCount() - 1);
            return prevItem.parentZIndex + 1;
        }
    }
}
