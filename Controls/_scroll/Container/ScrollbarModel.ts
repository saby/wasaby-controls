/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
import { detection } from 'Env/Env';
import { mixin } from 'Types/util';
import { IVersionable, VersionableMixin } from 'Types/entity';
import {
    canScrollByState,
    getContentSizeByState,
    getScrollPositionByState,
    SCROLL_DIRECTION,
} from '../Utils/Scroll';
import { IScrollState } from '../Utils/ScrollState';
import { IContainerBaseOptions } from 'Controls/_scroll/ContainerBase';

export interface IOffsets {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
}

export interface IStartEnd {
    start?: number;
    end?: number;
}

export default class ScrollbarModel
    extends mixin<VersionableMixin>(VersionableMixin)
    implements IVersionable
{
    readonly '[Types/_entity/VersionableMixin]': true;

    private readonly _useNativeScrollbar: boolean;
    private readonly _direction: SCROLL_DIRECTION;
    private _options: IContainerBaseOptions;
    private _canScroll: boolean = false;
    private _position: number = 0;
    private _virtualPosition: number = 0;
    private _contentSize: number;
    private _originalContentSize: number;
    private _offsets: IOffsets = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    };
    private _placeholders: IStartEnd = {
        start: 0,
        end: 0,
    };
    private _style: string = '';
    private _enabled: boolean = true;

    constructor(direction: SCROLL_DIRECTION, options: IContainerBaseOptions) {
        super(options);

        this._options = options;
        // На мобильных устройствах используется нативный скролл, на других платформенный.
        this._useNativeScrollbar =
            detection.isMobileIOS || detection.isMobileAndroid;
        this._direction = direction;
    }

    get isVisible(): boolean {
        return Boolean(
            !this._useNativeScrollbar &&
                this._options.scrollbarVisible &&
                this._canScroll
        );
    }

    get position(): number {
        return this._virtualPosition;
    }

    get contentSize(): number {
        return this._contentSize;
    }

    get enabled(): boolean {
        return this._enabled;
    }

    updateOptions(options: IContainerBaseOptions): void {
        this._options = options;
    }

    updatePosition(scrollState: IScrollState): boolean {
        let changed = false;
        const canScroll: boolean = canScrollByState(
            scrollState,
            this._direction
        );
        const position: number = getScrollPositionByState(
            scrollState,
            this._direction
        );
        if (canScroll !== this._canScroll || position !== this._position) {
            this._canScroll = canScroll;
            this._position = position;
            this._updatePosition();
            changed = true;
        }
        if (changed) {
            this._nextVersion();
        }
        return changed;
    }

    updateContentSize(scrollState: IScrollState): boolean {
        let changed = false;
        const originalContentSize: number = getContentSizeByState(
            scrollState,
            this._direction
        );

        if (originalContentSize !== this._originalContentSize) {
            changed = true;
            this._originalContentSize = originalContentSize;
            this._updateContentSize();
        }

        if (changed) {
            this._nextVersion();
        }
        return changed;
    }

    updatePlaceholdersSize(size: IStartEnd): boolean {
        let changed: boolean = false;
        for (const key of Object.keys(size)) {
            if (
                typeof size[key] === 'number' &&
                size[key] !== this._placeholders[key]
            ) {
                this._placeholders[key] = size[key];
                changed = true;
            }
        }

        if (changed) {
            this._updateContentSize();
            this._updatePosition();
        }
        return changed;
    }

    setOffsets(offsets: IOffsets): boolean {
        let changed: boolean;

        this._offsets = { ...this._offsets, ...offsets };
        changed = this._updateContentSize();

        let style: string;
        if (this._direction === SCROLL_DIRECTION.VERTICAL) {
            style = `top: ${offsets.top || 0}px; bottom: ${
                offsets.bottom || 0
            }px;`;
        } else {
            style = `left: ${offsets.left || 0}px; right: ${
                offsets.right || 0
            }px;`;
        }

        if (style !== this._style) {
            this._style = style;
            changed = true;
        }

        if (changed) {
            this._nextVersion();
        }
        return changed;
    }

    setEnabled(enabled: boolean): void {
        this._enabled = enabled;
    }

    get style(): string {
        return this._style;
    }

    private _updateContentSize(): boolean {
        const oldContentSize = this._contentSize;
        const originalContentSize = this._originalContentSize || 0;
        const offset =
            this._direction === SCROLL_DIRECTION.VERTICAL
                ? this._offsets.top + this._offsets.bottom
                : this._offsets.left + this._offsets.right;
        this._contentSize =
            originalContentSize -
            offset +
            this._placeholders.start +
            this._placeholders.end;
        return this._contentSize !== oldContentSize;
    }

    private _updatePosition(): void {
        this._virtualPosition = this._position + this._placeholders.start;
    }
}
