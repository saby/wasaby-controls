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

    getStartPosition(_: ISlidingStackPanelItem): IPopupPosition {
        const windowWidth = this._getWindowWidth();
        const position = this.getPosition();

        // Позиционируем окно за пределами экрана для анимации
        position.left = windowWidth;
        position.right = -windowWidth;

        return position;
    }

    getShowingPosition(_: ISlidingStackPanelItem): IPopupPosition {
        return this.getPosition();
    }

    getHidingPosition(item: ISlidingStackPanelItem): IPopupPosition {
        const position = this.getPosition();
        const newHorizontalPosition = item.sizes.width as number;
        position.left = newHorizontalPosition;
        position.right = -newHorizontalPosition;
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
