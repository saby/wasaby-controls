/**
 * @kaizen_zone c168c4c4-c8bc-47f2-973f-289c353400c0
 */
import {
    IStickyItem,
    StickyController,
} from 'Controls/_popupTemplateStrategy/Sticky/StickyController';
// eslint-disable-next-line
import { Deferred } from 'Types/deferred';
import * as cMerge from 'Core/core-merge';
import StickyStrategy from 'Controls/_popupTemplateStrategy/Sticky/StickyStrategy';
import { Controller, IPopupPosition, IPopupSizes } from 'Controls/popup';
import { getStickyConfig } from 'Controls/_popupTemplateStrategy/Util/PopupConfigUtil';
import { themeInitConstants } from 'Controls/popupTemplate';

interface IInfoBoxThemeConstants {
    ARROW_WIDTH?: number;
    ARROW_H_OFFSET?: number;
    ARROW_V_OFFSET?: number;
    TARGET_OFFSET?: number;
    MAX_WIDTH?: number;
}

interface IInfoBoxSide {
    t: string;
    r: string;
    b: string;
    l: string;
    c: string;
}

// todo: https://online.sbis.ru/opendoc.html?guid=b385bef8-31dd-4601-9716-f3593dfc9d41
let themeConstants: IInfoBoxThemeConstants = {};

const SIDES: IInfoBoxSide = {
    t: 'top',
    r: 'right',
    b: 'bottom',
    l: 'left',
    c: 'center',
};

const INVERTED_SIDES: IInfoBoxSide = {
    t: 'bottom',
    r: 'left',
    b: 'top',
    l: 'right',
    c: 'center',
};

/**
 * InfoBox Popup Controller
 * @class Controls/_popupTemplateStrategy/InfoBox/Opener/InfoBoxController
 *
 * @private
 */
class InfoBoxController extends StickyController {
    _openedPopupId: string = null;
    _checkHiddenId: number | null = null;
    TYPE: string = 'InfoBox';

    elementCreated(item: IStickyItem, container: HTMLDivElement): boolean {
        const isTargetVisible = this._isTargetVisible(item);
        // Only one popup can be opened
        if (this._openedPopupId) {
            Controller.remove(this._openedPopupId);
        }
        this._openedPopupId = item.id;

        // Not calculate the coordinates of target, when it is located on the hidden popup.
        if (this._removeHiddenElement(item) || !isTargetVisible) {
            return false;
        } else {
            /*
             * TODO: когда таргет скрывается через ws-hidden, на нём или родительских нодах, тогда нужно
             * удалить инфобокс привязанный к нему. Точно узнать момент нельзя, поэтому делаем это через
             * определённый интервал. Для корректного решения требуется выполнение задачи
             * https://online.sbis.ru/opendoc.html?guid=a88a5697-5ba7-4ee0-a93a-221cce572430
             */
            this._checkHiddenId = setInterval(() => {
                this._removeHiddenElement(item);
            }, 1000);
        }

        // Remove the width and height obtained in getDefaultOptions
        item.position.maxWidth = undefined;
        item.position.maxHeight = undefined;
        // Removes set value to get real size of the content
        const maxWidth = container.style.maxWidth;
        const maxHeight = container.style.maxHeight;
        container.style.maxWidth = '';
        container.style.maxHeight = '';
        this.prepareConfig(item, container);
        container.style.maxWidth = maxWidth;

        const result = super.elementCreated.apply(this, arguments);
        container.style.maxHeight = maxHeight;
        return result;
    }

    elementUpdated(): boolean {
        // Hide popup then page scroll or resize
        Controller.remove(this._openedPopupId);
        return true;
    }

    resizeInner(item: IStickyItem, container: HTMLDivElement): boolean {
        return super.elementUpdated(item, container);
    }

    elementDestroyed(item: IStickyItem): Promise<null> {
        if (item.id === this._openedPopupId) {
            clearInterval(this._checkHiddenId);
            this._openedPopupId = null;
            this._checkHiddenId = null;
        }
        return new Deferred().callback();
    }

    // Инфобокс закрывается всегда при драге на странице, только если драг не в нем.
    dragNDropOnPage(item: IStickyItem, container: HTMLDivElement, isInsideDrag: boolean): boolean {
        return !isInsideDrag;
    }

    getDefaultConfig(item: IStickyItem): Promise<void> {
        super.getDefaultConfig.apply(this, arguments);
        const defaultPosition: IPopupPosition = {
            left: -10000,
            top: -10000,
            right: undefined,
            bottom: undefined,
        };
        const initConstantsConfig = {
            ARROW_WIDTH: 'marginLeft',
            ARROW_H_OFFSET: 'marginRight',
            ARROW_V_OFFSET: 'marginBottom',
            TARGET_OFFSET: 'marginTop',
            MAX_WIDTH: 'maxWidth',
        };
        return themeInitConstants(
            `controls-InfoBox__themeConstants controls_popupTemplate_theme-${Controller.getTheme()}`,
            initConstantsConfig
        ).then((result) => {
            themeConstants = result;
            if (item.popupOptions.target) {
                // Calculate the width of the infobox before its positioning.
                // It is impossible to count both the size and the position at the same time,
                // because the position is related to the size.
                const config = this._prepareInfoboxConfig(
                    item.popupOptions.position,
                    item.popupOptions.target
                );
                cMerge(item.popupOptions, config);
                const sizes: IPopupSizes = {
                    width: themeConstants.MAX_WIDTH,
                    height: 1,
                    margins: { left: 0, top: 0 },
                };
                const popupConfig = getStickyConfig(item, sizes);
                const position: IPopupPosition = StickyStrategy.getPosition(
                    popupConfig,
                    this._getTargetCoords(item),
                    this._getTargetNode(item)
                );
                this.prepareConfig(item);
                item.position.maxWidth = position.width;
            }
            item.position = { ...item.position, ...defaultPosition };
        });
    }

    prepareConfig(item: IStickyItem, container?: HTMLElement): IStickyItem {
        cMerge(
            item.popupOptions,
            this._prepareInfoboxConfig(item.popupOptions.position, item.popupOptions.target)
        );
        return super.prepareConfig.apply(this, arguments);
    }

    popupMovingSize(item: IStickyItem, offset: object, position: string): boolean {
        return this._popupDefaultResizing(item, offset, position);
    }

    // Checks if the target width is enough for the correct positioning of the arrow.
    // Returns offset to which you want to move the popup.
    private _getOffset(
        targetSize: number,
        alignSide: string,
        arrowOffset: number,
        arrowWidth: number
    ): number {
        const align: string = INVERTED_SIDES[alignSide];

        // Check if we have enough width of the target for the correct positioning of the arrow, if not, just
        // move the popup arrow to the center of the target
        if (align !== 'center' && targetSize < arrowWidth + arrowOffset) {
            switch (align) {
                case 'top':
                case 'left':
                    return arrowWidth / 2 + arrowOffset - targetSize / 2;
                case 'bottom':
                case 'right':
                    return -arrowWidth / 2 + -arrowOffset + targetSize / 2;
            }
        }
        return 0;
    }

    // Return the configuration prepared for StickyStrategy
    private _prepareInfoboxConfig(position: string, target: HTMLDivElement): IStickyItem {
        const side: string = position[0];
        const alignSide: string = position[1];
        const topOrBottomSide: boolean = side === 't' || side === 'b';

        const config = {
            direction: {
                horizontal: topOrBottomSide ? INVERTED_SIDES[alignSide] : SIDES[side],
                vertical: topOrBottomSide ? SIDES[side] : INVERTED_SIDES[alignSide],
            },
            targetPoint: {
                vertical: topOrBottomSide ? SIDES[side] : SIDES[alignSide],
                horizontal: topOrBottomSide ? SIDES[alignSide] : SIDES[side],
            },
        };

        const verticalOffset: number = this._getVerticalOffset(target, topOrBottomSide, alignSide);
        const horizontalOffset: number = this._getHorizontalOffset(
            target,
            topOrBottomSide,
            alignSide
        );

        if (verticalOffset) {
            config.offset = config.offset || {};
            config.offset.vertical = verticalOffset;
        }

        if (horizontalOffset) {
            config.offset = config.offset || {};
            config.offset.horizontal = horizontalOffset;
        }

        return config;
    }

    private _getVerticalOffset(
        target: HTMLDivElement,
        topOrBottomSide: boolean,
        alignSide: string
    ): number {
        if (!topOrBottomSide) {
            // svg hasn't offsetHeight property
            const targetHeight: number = target.offsetHeight || target.clientHeight;
            return this._getOffset(
                targetHeight,
                alignSide,
                themeConstants.ARROW_V_OFFSET,
                themeConstants.ARROW_WIDTH
            );
        }
    }

    private _getHorizontalOffset(
        target: HTMLDivElement,
        topOrBottomSide: boolean,
        alignSide: string
    ): number {
        if (topOrBottomSide) {
            // svg hasn't offsetWidth property
            const targetWidth: number = target.offsetWidth || target.clientWidth;
            return this._getOffset(
                targetWidth,
                alignSide,
                themeConstants.ARROW_H_OFFSET,
                themeConstants.ARROW_WIDTH
            );
        }
    }

    private _removeHiddenElement(item: IStickyItem): boolean {
        // В IE полиморф closest не успевает загрузиться до вызова метода
        const targetHidden: boolean = !!this._getTargetNode(item)?.closest('.ws-hidden');
        if (targetHidden) {
            Controller.remove(item.id);
            return true;
        }

        return false;
    }
}

export default new InfoBoxController();
