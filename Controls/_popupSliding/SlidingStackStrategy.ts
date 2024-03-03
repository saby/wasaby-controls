/**
 * @kaizen_zone 49e4d90e-38bb-4029-bdfb-9dd08e44fa83
 */
import { IPopupItem, IPopupPosition, IPopupSizes } from 'Controls/popup';
import { DimensionsMeasurer } from 'Controls/sizeUtils';

export enum AnimationState {
    initializing = 'initializing',
    showing = 'showing',
    closing = 'closing',
}

export interface ISlidingStackPanelItem extends IPopupItem {
    animationState: AnimationState;
}

class SlidingStackStrategy {
    getPosition(): IPopupPosition {
        return {
            top: 0,
            height: '100%',
            left: 0,
            right: 0,
            position: 'fixed',
        };
    }

    getStartPosition(item: ISlidingStackPanelItem): IPopupPosition {
        const windowHeight = this._getWindowHeight();
        const position = this.getPosition();

        // Позиционируем окно за пределами экрана для анимации
        const newTopPosition = windowHeight;
        position.top = newTopPosition;

        return position;
    }

    getShowingPosition(item: ISlidingStackPanelItem): IPopupPosition {
        const position = this.getPosition();
        const newTopPosition = this._getWindowHeight() - item.sizes.height;
        position.top = newTopPosition;
        return position;
    }

    getHidingPosition(item: ISlidingStackPanelItem): IPopupPosition {
        const position = this.getPosition();
        const newTopPosition = item.sizes.height;
        position.top = newTopPosition;
        return position;
    }

    getSizes(): IPopupSizes {
        return {
            height: this._getWindowHeight(),
            width: this._getWindowWidth(),
        };
    }

    private _getWindowHeight(): number {
        return DimensionsMeasurer.getVisualViewportDimensions().height;
    }

    private _getWindowWidth(): number {
        return DimensionsMeasurer.getVisualViewportDimensions().width;
    }
}

export default new SlidingStackStrategy();
