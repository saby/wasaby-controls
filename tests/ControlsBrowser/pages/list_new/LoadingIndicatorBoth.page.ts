import Common from '../../elements/Common';
import ListView from '../../elements/list/View';
import Scroll from '../../elements/scroll/Container';

// FIXME wdio types ???
interface IRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * Элементы страницы Controls-demo/list_new/LoadingIndicator/Both/Index
 * @author Зайцев А.С.
 */
export default class LoadingIndicatorBothPage {
    private _scroll: Scroll = new Scroll('.ControlsDemo-Page_content .controls-Scroll');

    button(): ReturnType<WebdriverIO.Browser['$']> {
        return $('.controls-BaseButton');
    }

    scroll(): ReturnType<WebdriverIO.Browser['$']> {
        return this._scroll.container();
    }

    /**
     * Ждёт показа, а затем скрытия нижнего индикатора загрузки.
     * @param listView Список, в котором находится элемент.
     */
    async checkBottomIndicator(listView: ListView): Promise<void> {
        await this._checkIndicator(
            await Common.bottomIndicator().elementId,
            (indicatorRect, scrollRect) => {
                return indicatorRect.y <= scrollRect.y + scrollRect.height;
            },
            'Нижний индикатор не виден.'
        );

        await this._checkIndicator(
            await Common.bottomIndicator().elementId,
            (indicatorRect, scrollRect) => {
                return indicatorRect.y >= scrollRect.y + scrollRect.height;
            },
            'Нижний индикатор виден.'
        );
    }

    /**
     * Ждёт, пока станет видна как минимум середина верхнего индикатора, и возвращает ошибку при таймауте.
     * Затем ждёт, пока низ верхнего индикатора не станет виден, и возвращает ошибку при таймауте.
     * @param listView Список, в котором находится элемент.
     */
    async checkTopIndicator(listView: ListView): Promise<void> {
        await this._checkIndicator(
            await Common.topIndicator().elementId,
            (indicatorRect, scrollRect) => {
                return indicatorRect.y + indicatorRect.height >= scrollRect.y;
            },
            'Верхний индикатор не виден.'
        );

        await this._checkIndicator(
            await Common.topIndicator().elementId,
            (indicatorRect, scrollRect) => {
                return indicatorRect.y + indicatorRect.height <= scrollRect.y;
            },
            'Верхний индикатор виден.'
        );
    }

    private async _checkIndicator(
        elementId: number,
        condition: (indicatorRect: IRect, scrollRect: IRect) => boolean,
        timeoutMsg: string
    ): Promise<void> {
        await browser.waitUntil(
            async () => {
                const indicatorRect = await browser.getElementRect(elementId);
                const scrollRect = await browser.getElementRect(await this.scroll().elementId);
                return condition(indicatorRect, scrollRect);
            },
            {
                timeoutMsg,
            }
        );
    }
}
