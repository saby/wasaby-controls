/**
 * @kaizen_zone 5027e156-2300-4ab3-8a3a-d927588bb443
 */
import { Control } from 'UI/Base';
import { unsafe_getRootAdaptiveMode } from 'UI/Adaptive';
import { SlidingPanelOpener } from 'Controls/popup';
import { INavigationMenu } from 'Controls/_breadcrumbs/NavigationMenu';

/**
 * Опенер, который умеет открывать навигационное меню для крошек
 * @private
 */
export class Opener {
    private _menu: SlidingPanelOpener;
    private get menu(): SlidingPanelOpener {
        if (!this._menu) {
            this._menu = new SlidingPanelOpener();
        }

        return this._menu;
    }

    /**
     * Открывает popup с компонентом навигационного меню.
     * В зависимости от текущего устройства открывает либо StickyPanel, либо SlidingPanel.
     *
     * @param {Control} opener - компонент, инициировавший открытие
     * @param {HTMLElement} target - целевой элемент, относительно которого будет спозиционирован popup
     * @param {Object} options - доп. опции
     */
    open(
        opener: Control,
        target: HTMLElement,
        options: {
            eventHandlers: unknown;
            templateOptions: INavigationMenu;
        }
    ): void {
        const withoutHeader = options.templateOptions.headerVisible !== true;

        // region На основании видимости заголовка навигационного меню конфигурируем его внешний вид и позицию

        // Если навигационное меню показывается без заголовка, то позиционируем его под вызывающим элементом
        // без смещения. В проливном случае позиционируем его поверх вызывающего элемента.

        const targetPoint = withoutHeader
            ? {
                  vertical: 'bottom',
                  horizontal: 'left',
              }
            : {
                  vertical: 'top',
                  horizontal: 'left',
              };
        const direction = withoutHeader
            ? {
                  horizontal: 'right',
              }
            : {
                  vertical: 'bottom',
                  horizontal: 'right',
              };
        const offset = withoutHeader
            ? undefined
            : {
                  horizontal: -8,
                  vertical: -9,
              };
        // endregion

        this.menu.open({
            modal: unsafe_getRootAdaptiveMode().device.isPhone(),

            slidingPanelOptions: {
                minHeight: 100,
                position: 'bottom',
                autoHeight: true,
            },

            desktopMode: 'sticky',
            dialogOptions: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                target,
                opener,

                maxWidth: 700,

                actionOnScroll: 'close',
                closeOnOutsideClick: true,
                backgroundStyle: 'default',
                targetPoint,
                direction,
                offset,
                fittingMode: {
                    vertical: 'overflow',
                    horizontal: 'overflow',
                },
            },

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            template: 'wml!Controls/_breadcrumbs/NavigationMenu/OpenerTemplate',
            templateOptions: options.templateOptions,
            eventHandlers: options.eventHandlers,
        });
    }

    close(): void {
        this._menu?.close();
    }

    destroy(): void {
        this._menu?.destroy();
    }
}
