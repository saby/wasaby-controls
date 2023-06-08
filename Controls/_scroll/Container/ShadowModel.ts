/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
import { mixin } from 'Types/util';
import { IVersionable, VersionableMixin } from 'Types/entity';
import { POSITION, ScrollShadowVisibility } from './Type';
import { IShadowsOptions, SHADOW_VISIBILITY } from './Interface/IShadows';
import { SCROLL_DIRECTION, SCROLL_POSITION } from '../Utils/Scroll';
import { IScrollState } from '../Utils/ScrollState';

const SHADOW_ENABLE_MAP = {
    hidden: false,
    visible: true,
    auto: true,
};

enum SHADOW_TYPE {
    BEFORE = 'before',
    AFTER = 'after',
}

const upperDirection = {
    vertical: 'Vertical',
    horizontal: 'Horizontal',
};

const AUTO = 'auto';

export default class ShadowModel
    extends mixin<VersionableMixin>(VersionableMixin)
    implements IVersionable
{
    readonly '[Types/_entity/VersionableMixin]': true;

    private _options: IShadowsOptions;
    private _position: POSITION;
    private _direction: SCROLL_DIRECTION;
    private _type: SHADOW_TYPE;
    private _isEnabled: boolean = false;
    private _isVisible: boolean = false;
    private _isStickyFixed: boolean = false;
    private _scrollState: IScrollState = {
        canVerticalScroll: false,
        canHorizontalScroll: false,
    };

    private _visibilityByInnerComponents: ScrollShadowVisibility =
        ScrollShadowVisibility.Auto;

    constructor(position: POSITION, options: IShadowsOptions) {
        super(options);
        this._position = position;
        if (position === POSITION.TOP || position === POSITION.BOTTOM) {
            this._direction = SCROLL_DIRECTION.VERTICAL;
        } else if (position === POSITION.LEFT || position === POSITION.RIGHT) {
            this._direction = SCROLL_DIRECTION.HORIZONTAL;
        }
        if (position === POSITION.TOP || position === POSITION.LEFT) {
            this._type = SHADOW_TYPE.BEFORE;
        } else if (
            position === POSITION.BOTTOM ||
            position === POSITION.RIGHT
        ) {
            this._type = SHADOW_TYPE.AFTER;
        }
        this._options = options;
        this.updateScrollState(this._scrollState);
    }

    get isEnabled() {
        return this._isEnabled;
    }

    get isVisible() {
        return this._isVisible;
    }

    get isVisibleShadowOnCSS() {
        if (this._visibilityByInnerComponents !== SHADOW_VISIBILITY.AUTO) {
            return this._visibilityByInnerComponents;
        }

        const visibility = this._options[`${this._position}ShadowVisibility`];
        if (visibility !== SHADOW_VISIBILITY.AUTO) {
            return visibility;
        }

        return AUTO;
    }

    updateOptions(options: IShadowsOptions): void {
        this._options = options;
        this.updateScrollState(this._scrollState);
    }

    updateScrollState(scrollState: IScrollState): boolean {
        let isChanged = false;

        this._scrollState = scrollState;
        isChanged = this._updateEnabled();

        let isVisible = false;
        if (this._isEnabled) {
            isVisible = this._getVisibleByOptions();
            // _getVisibleByOptions возвращает undefined если через опции тень задается автоматически
            if (isVisible === undefined) {
                isVisible = this._getVisibleByState(scrollState);
            }
        }

        if (isVisible !== this._isVisible) {
            this._isVisible = isVisible;
            isChanged = true;
        }
        return isChanged;
    }

    updateVisibilityByInnerComponents(visibility: SHADOW_VISIBILITY): boolean {
        let isChanged: boolean = false;

        if (this._visibilityByInnerComponents !== visibility) {
            this._visibilityByInnerComponents = visibility;
            isChanged = this.updateScrollState(this._scrollState);
        }
        return isChanged;
    }

    getVisibilityByInnerComponents(): SHADOW_VISIBILITY {
        return this._visibilityByInnerComponents;
    }

    _updateEnabled(): boolean {
        const isEnabled: boolean = this._getContainerShadowEnable();
        let isChanged = false;
        if (isEnabled !== this._isEnabled) {
            this._isEnabled = isEnabled;
            isChanged = true;
        }
        return isChanged;
    }

    _getVisibleByOptions(): boolean | undefined {
        if (this._visibilityByInnerComponents !== SHADOW_VISIBILITY.AUTO) {
            return SHADOW_ENABLE_MAP[this._visibilityByInnerComponents];
        }

        const visibility = this._options[`${this._position}ShadowVisibility`];
        if (visibility !== SHADOW_VISIBILITY.AUTO) {
            return SHADOW_ENABLE_MAP[visibility];
        }

        return undefined;
    }

    _getVisibleByState(scrollState: IScrollState): boolean {
        const position: SCROLL_POSITION =
            scrollState[`${this._direction}Position`];
        return (
            (this._type === SHADOW_TYPE.BEFORE &&
                position !== SCROLL_POSITION.START) ||
            (this._type === SHADOW_TYPE.AFTER &&
                position !== SCROLL_POSITION.END)
        );
    }

    setStickyFixed(isFixed: boolean) {
        let isChanged = false;
        if (this._isStickyFixed !== isFixed) {
            this._isStickyFixed = isFixed;
            isChanged = this._updateEnabled();
        }
        return isChanged;
    }

    isStickyHeadersShadowsEnabled(): boolean {
        return this._getShadowEnable();
    }

    getStickyHeadersShadowsVisibility(): ScrollShadowVisibility {
        let visibility: ScrollShadowVisibility = ScrollShadowVisibility.Auto;
        if (this._visibilityByInnerComponents !== ScrollShadowVisibility.Auto) {
            visibility = this._visibilityByInnerComponents;
        } else if (
            !this._getShadowEnable() ||
            !this._getVisibleByState(this._scrollState)
        ) {
            visibility = ScrollShadowVisibility.Hidden;
        }
        return visibility;
    }

    private _canScrollByScrollState(): boolean {
        return !!this._scrollState[
            `can${upperDirection[this._direction]}Scroll`
        ];
    }

    private _getContainerShadowEnable(): boolean {
        if (this._isStickyFixed) {
            return false;
        }
        return this._getShadowEnable();
    }

    private _getShadowEnable(): boolean {
        if (
            this._options[`${this._position}ShadowVisibility`] !==
            SHADOW_VISIBILITY.AUTO
        ) {
            return this._isShadowEnable();
        }
        if (
            this._direction === 'vertical' &&
            typeof this._options.initialScrollPosition?.vertical === 'number'
        ) {
            return true;
        }
        if (
            this._direction === 'horizontal' &&
            typeof this._options.initialScrollPosition?.horizontal === 'number'
        ) {
            return true;
        }
        const canScrollByScrollState = this._canScrollByScrollState();
        // Если тени принудительно включены изнутри, то показываем их только в случае если можно скролить.
        if (
            this._visibilityByInnerComponents !== SHADOW_VISIBILITY.AUTO &&
            canScrollByScrollState
        ) {
            return SHADOW_ENABLE_MAP[this._visibilityByInnerComponents];
        }
        return canScrollByScrollState;
    }

    /**
     * Возвращает включено ли отображение тени.
     * Если отключено, то не рендерим контейнер тени и не рассчитываем его состояние.
     * @param options Опции компонента.
     * @param position Позиция тени.
     */
    private _isShadowEnable(): boolean {
        return SHADOW_ENABLE_MAP[
            this._options[`${this._position}ShadowVisibility`]
        ];
    }
}
