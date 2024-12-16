import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls/_columnScroll/NewScrollOverlay/NewScrollOverlay';
import { SyntheticEvent } from 'UICommon/Events';

export default class NewScrollOverlay extends Control {
    protected _template: TemplateFunction = Template;
    private _mirrorContainer: HTMLDivElement;
    private _gridContainer: HTMLDivElement;
    private _scrollContainer: HTMLDivElement;

    protected _scrollContainerWidth: number = 0;

    private _current: number = 0;

    protected _afterMount(): void {
        this._mirrorContainer = this._container as HTMLDivElement;
        this._gridContainer = document.querySelector('.controls-Grid') as HTMLDivElement;
        this._scrollContainer = this._gridContainer.closest(
            '.controls-Scroll-Container'
        ) as HTMLDivElement;
        this._scrollContainerWidth = this._scrollContainer.offsetWidth;
        const headerCellHeight = (
            this._gridContainer.querySelector(
                '.controls-Grid_part-fixed .controls-Grid__header-cell'
            ) as HTMLDivElement
        ).offsetHeight;

        const dataCellHeight = (
            this._gridContainer.querySelector(
                '.controls-Grid_part-fixed .controls-GridViewV__itemsContainer .controls-Grid__row-cell'
            ) as HTMLDivElement
        ).offsetHeight;

        this._scrollContainer.style.setProperty('--fixed_header_height', headerCellHeight + 'px');
        this._scrollContainer.style.setProperty('--fixed_data_height', dataCellHeight + 'px');
    }

    protected _onScroll(e: SyntheticEvent): void {
        const scrollLeft = (e.target as HTMLDivElement).scrollLeft;
        if (scrollLeft <= 0 && this._current === 0) {
            return;
        } else if (scrollLeft <= 0) {
            this._current = 0;
        } else {
            this._current = scrollLeft;
        }
        this._gridContainer.style.transform = 'translate3d(' + -this._current + 'px, 0, 0)';
    }

    protected _emulateEvent(e: SyntheticEvent<MouseEvent>): void {
        const nativeEvent = e.nativeEvent;

        const origin = this._mirrorContainer.style.display;
        this._mirrorContainer.style.display = 'none';
        const elem = document.elementFromPoint(nativeEvent.pageX, nativeEvent.pageY);
        this._mirrorContainer.style.display = origin;
        const eventCtor = Object.getPrototypeOf(nativeEvent).constructor;
        const sEvent = new eventCtor(nativeEvent.type, nativeEvent);

        elem.dispatchEvent(sEvent);
    }

    protected _getStyles(): string {
        return (
            'position: absolute;' +
            'left: 0;' +
            'top: 0;' +
            'height: 100%;' +
            'width: 100%;' +
            'overflow-x: scroll;' +
            'z-index: 1;' +
            'user-select: none;'
        );
    }
}
