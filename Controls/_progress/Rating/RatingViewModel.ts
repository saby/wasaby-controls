/**
 * @kaizen_zone 711a1e90-e32a-4501-9a88-99d88531ecd2
 */
import { TRatingViewMode } from '../Rating';

const STARS_COUNT = 5;

const DEFAULT_EMPTY_ICON_STYLE = 'readonly';
const DEFAULT_ICON_STYLE = 'rate';
const ICON_COLORS = ['rate2', 'rate2', 'rate4', 'rate6', 'rate8', 'rate10'];

interface IRatingItem {
    index: number;
    type: 'full' | 'half' | 'empty';
    icon: string;
    iconStyle: string;
}

interface IRatingViewModelOptions {
    value: number;
    precision: number;
    iconColorMode: string;
    emptyIconFill: string;
    maxValue?: number;
    viewMode?: TRatingViewMode;
}

class RatingViewModel {
    private _version: number = 1;
    private _maxValue: number;
    private _value: number;
    private _items: IRatingItem[] | null = null;
    private _iconColorMode: string;
    private _emptyIconFill: string;
    private _precision: number;
    private _viewMode: TRatingViewMode;

    constructor(options: IRatingViewModelOptions) {
        this._value = RatingViewModel._calcValue(
            options.value,
            options.precision,
            options.maxValue || STARS_COUNT
        );
        this._iconColorMode = options.iconColorMode;
        this._emptyIconFill = options.emptyIconFill;
        this._precision = options.precision;
        this._maxValue = options.maxValue || STARS_COUNT;
        this._viewMode = options.viewMode || 'stars';
    }

    getVersion(): number {
        return this._version;
    }

    _nextVersion(): void {
        this._version++;
    }

    getItems(): IRatingItem[] {
        if (!this._items) {
            this._items = RatingViewModel._generateItems(
                this._value,
                this._iconColorMode,
                this._emptyIconFill,
                this._viewMode,
                this._maxValue
            );
        }
        return this._items;
    }

    setOptions({ value, precision, iconColorMode, emptyIconFill }: IRatingViewModelOptions): void {
        if (precision !== this._precision) {
            this._precision = precision;
            this._items = null;
        }

        if (value !== this._value) {
            this._value = RatingViewModel._calcValue(value, this._precision, this._maxValue);
            this._items = null;
        }

        if (emptyIconFill !== this._emptyIconFill) {
            this._emptyIconFill = emptyIconFill;
            this._items = null;
        }

        if (iconColorMode !== this._iconColorMode) {
            this._iconColorMode = iconColorMode;
            this._items = null;
        }
        this._nextVersion();
    }

    setValue(value: number): void {
        if (value !== this._value) {
            this._value = RatingViewModel._calcValue(value, this._precision, this._maxValue);
            this._items = null;
        }
        this._nextVersion();
    }

    private static _calcValue(value: number, precision: number, maxValue: number): number {
        let calcValue;
        if (precision === 0.5 && value >= Math.floor(value) + 0.5) {
            calcValue = Math.floor(value) + 0.5;
        } else {
            calcValue = Math.floor(value);
        }

        calcValue = Math.max(calcValue, 0);
        calcValue = Math.min(calcValue, maxValue);
        return calcValue;
    }

    private static _generateItems(
        value: number,
        iconColorMode: string,
        emptyIconFill: string,
        viewMode: TRatingViewMode,
        maxValue: number
    ): IRatingItem[] {
        const items: IRatingItem[] = [];

        const lastFull: number = Math.floor(value);
        const needHalf: boolean = value > lastFull;

        for (let i = 1; i <= maxValue; i++) {
            const iconStyle =
                iconColorMode === 'static' ? DEFAULT_ICON_STYLE : ICON_COLORS[lastFull];
            if (i <= lastFull) {
                items.push({
                    index: i,
                    type: 'full',
                    icon: viewMode === 'hearts' ? 'icon-Love' : 'icon-Favorite',
                    iconStyle,
                });
            } else if (i === lastFull + 1 && needHalf) {
                items.push({
                    index: i,
                    type: 'half',
                    icon: viewMode === 'hearts' ? 'icon-LoveHalf' : 'icon-FavoriteHalf',
                    iconStyle,
                });
            } else {
                items.push({
                    index: i,
                    type: 'empty',
                    icon:
                        viewMode === 'hearts'
                            ? 'icon-LoveNull'
                            : emptyIconFill === 'full'
                            ? 'icon-Favorite'
                            : 'icon-Unfavorite',
                    iconStyle: DEFAULT_EMPTY_ICON_STYLE,
                });
            }
        }

        return items;
    }
}

export default RatingViewModel;
