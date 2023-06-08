/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
import { mixin } from 'Types/util';
import { IVersionable, VersionableMixin } from 'Types/entity';
import { POSITION } from './Type';
import ShadowModel from './ShadowModel';
import {
    IShadowsOptions,
    IShadowsVisibilityByInnerComponents,
    SHADOW_VISIBILITY,
} from './Interface/IShadows';
import { IScrollState } from '../Utils/ScrollState';

export default class ShadowsModel
    extends mixin<VersionableMixin>(VersionableMixin)
    implements IVersionable
{
    readonly '[Types/_entity/VersionableMixin]': true;

    private _models: object = {};

    constructor(options: IShadowsOptions) {
        super(options);

        const scrollOrientation = options.scrollOrientation.toLowerCase();
        if (scrollOrientation.indexOf('vertical') !== -1) {
            this._models.top = new ShadowModel(POSITION.TOP, options);
            this._models.bottom = new ShadowModel(POSITION.BOTTOM, options);
        }
        if (scrollOrientation.indexOf('horizontal') !== -1) {
            this._models.left = new ShadowModel(POSITION.LEFT, options);
            this._models.right = new ShadowModel(POSITION.RIGHT, options);
        }
    }

    updateOptions(options: IShadowsOptions): void {
        for (const shadow of Object.keys(this._models)) {
            this._models[shadow].updateOptions(options);
        }
    }

    updateScrollState(
        scrollState: IScrollState,
        needUpdate: boolean = true
    ): void {
        for (const shadow of Object.keys(this._models)) {
            const isStateChanged =
                this._models[shadow].updateScrollState(scrollState);
            if (isStateChanged && needUpdate) {
                this._nextVersion();
            }
        }
    }

    updateVisibilityByInnerComponents(
        shadowsVisibility: IShadowsVisibilityByInnerComponents,
        needUpdate: boolean = true
    ): void {
        let isChanged: boolean = false;
        for (const shadowPosition of Object.keys(this._models)) {
            const shadowVisibility: SHADOW_VISIBILITY =
                shadowsVisibility[shadowPosition];
            if (shadowVisibility) {
                isChanged =
                    this._models[
                        shadowPosition
                    ].updateVisibilityByInnerComponents(shadowVisibility) ||
                    isChanged;
            }
        }
        if (isChanged && needUpdate) {
            this._nextVersion();
        }
    }

    setStickyFixed(
        topFixed: boolean,
        bottomFixed: boolean,
        leftFixed: boolean,
        rightFixed: boolean,
        needUpdate: boolean = true
    ): void {
        let isTopStateChanged = false;
        let isBottomStateChanged = false;
        let isLeftStateChanged = false;
        let isRightStateChanged = false;

        if (this._models.top) {
            isTopStateChanged = this._models.top.setStickyFixed(topFixed);
        }
        if (this._models.bottom) {
            isBottomStateChanged =
                this._models.bottom.setStickyFixed(bottomFixed);
        }
        if (this._models.left) {
            isLeftStateChanged = this._models.left.setStickyFixed(leftFixed);
        }
        if (this._models.right) {
            isRightStateChanged = this._models.right.setStickyFixed(rightFixed);
        }
        // Возможна ситуация когда, до события фиксации заголовков, список говорит что надо всегда отображать
        // тень сверху, и состояние рассчитывается без информации о том, что есть зафиксированные заголовки.
        // В этом случае нам нужна синхронизация.
        /* eslint-disable max-len */
        if (
            (isTopStateChanged ||
                isBottomStateChanged ||
                isLeftStateChanged ||
                isRightStateChanged) &&
            (needUpdate ||
                (this._models.top?.getVisibilityByInnerComponents() ===
                    SHADOW_VISIBILITY.VISIBLE &&
                    isTopStateChanged) ||
                (this._models.bottom?.getVisibilityByInnerComponents() ===
                    SHADOW_VISIBILITY.VISIBLE &&
                    isBottomStateChanged) ||
                (this._models.left?.getVisibilityByInnerComponents() ===
                    SHADOW_VISIBILITY.VISIBLE &&
                    isLeftStateChanged) ||
                (this._models.right?.getVisibilityByInnerComponents() ===
                    SHADOW_VISIBILITY.VISIBLE &&
                    isRightStateChanged))
        ) {
            this._nextVersion();
        }
        /* eslint-enable max-len */
    }

    hasVisibleShadow(): boolean {
        let hasVisible: boolean = false;
        for (const position in this._models) {
            if (this._models[position].isVisible) {
                hasVisible = true;
                break;
            }
        }
        return hasVisible;
    }

    get top(): ShadowModel {
        return this._models.top;
    }
    get bottom(): ShadowModel {
        return this._models.bottom;
    }
    get left(): ShadowModel {
        return this._models.left;
    }
    get right(): ShadowModel {
        return this._models.right;
    }
}
