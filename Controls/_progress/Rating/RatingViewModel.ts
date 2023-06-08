/**
 * @kaizen_zone 711a1e90-e32a-4501-9a88-99d88531ecd2
 */
const STARS_COUNT = 5;
const DEFAULT_EMPTY_ICON_STYLE = 'readonly';
const DEFAULT_ICON_STYLE = 'rate';
const ICON_COLORS = [
    'danger',
    'danger',
    'danger',
    DEFAULT_ICON_STYLE,
    DEFAULT_ICON_STYLE,
    'success',
];

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
}

class RatingViewModel {
    private _version: number = 1;
    private _value: number;
    private _items: IRatingItem[] | null = null;
    private _iconColorMode: string;
    private _emptyIconFill: string;
    private _precision: number;

    constructor(options: IRatingViewModelOptions) {
        this._value = RatingViewModel._calcValue(
            options.value,
            options.precision
        );
        this._iconColorMode = options.iconColorMode;
        this._emptyIconFill = options.emptyIconFill;
        this._precision = options.precision;
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
                this._emptyIconFill
            );
        }
        return this._items;
    }

    setOptions({
        value,
        precision,
        iconColorMode,
        emptyIconFill,
    }: IRatingViewModelOptions): void {
        if (precision !== this._precision) {
            this._precision = precision;
            this._items = null;
        }

        if (value !== this._value) {
            this._value = RatingViewModel._calcValue(value, this._precision);
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
            this._value = RatingViewModel._calcValue(value, this._precision);
            this._items = null;
        }
        this._nextVersion();
    }

    private static _calcValue(value: number, precision: number): number {
        let calcValue;
        if (precision === 0.5 && value >= Math.floor(value) + 0.5) {
            calcValue = Math.floor(value) + 0.5;
        } else {
            calcValue = Math.floor(value);
        }

        calcValue = Math.max(calcValue, 0);
        calcValue = Math.min(calcValue, STARS_COUNT);
        return calcValue;
    }

    private static _generateItems(
        value: number,
        iconColorMode: string,
        emptyIconFill: string
    ): IRatingItem[] {
        const items: IRatingItem[] = [];

        const lastFull: number = Math.floor(value);
        const needHalf: boolean = value > lastFull;

        for (let i = 1; i <= STARS_COUNT; i++) {
            const iconStyle =
                iconColorMode === 'static'
                    ? DEFAULT_ICON_STYLE
                    : ICON_COLORS[lastFull];
            if (i <= lastFull) {
                items.push({
                    index: i,
                    type: 'full',
                    icon: 'icon-Favorite',
                    iconStyle,
                });
            } else if (i === lastFull + 1 && needHalf) {
                items.push({
                    index: i,
                    type: 'half',
                    icon: 'icon-FavoriteHalf',
                    iconStyle,
                });
            } else {
                items.push({
                    index: i,
                    type: 'empty',
                    icon:
                        emptyIconFill === 'full'
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
