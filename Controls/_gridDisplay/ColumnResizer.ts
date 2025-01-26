/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */

import { mixin } from 'Types/util';
import { DestroyableMixin, VersionableMixin } from 'Types/entity';
import { InitStateByOptionsMixin, InstantiableMixin } from 'Controls/display';

export type TResizerOffsetCallback = (offset: number) => void;

export interface IColumnResizerConstructor {
    maxWidth: number;
    minWidth: number;
    width: number;
    resizerOffsetCallback: TResizerOffsetCallback;
}
/**
 * Ресайзер
 * @private
 */
export default class ColumnResizer extends mixin<
    DestroyableMixin,
    InitStateByOptionsMixin,
    InstantiableMixin,
    VersionableMixin
>(DestroyableMixin, InitStateByOptionsMixin, InstantiableMixin, VersionableMixin) {
    readonly listInstanceName: string = 'controls-Grid__resizer';
    readonly listElementName: string = 'resizer-cell';

    get key(): string {
        return 'grid-resizer-cell';
    }

    protected _$width: number;
    protected _$minWidth: number;
    protected _$maxWidth: number;
    protected _$resizerOffsetCallback: TResizerOffsetCallback;

    constructor(options: IColumnResizerConstructor) {
        super();
        this._$minWidth = options.minWidth;
        this._$width = options.width;
        this._$maxWidth = options.maxWidth;
        this._$resizerOffsetCallback = options.resizerOffsetCallback;
    }
    setWidth(width: number) {
        this._$width = width;
        this._nextVersion();
    }

    getMinOffset() {
        return this._$width - this._$minWidth;
    }

    getMaxOffset() {
        return this._$maxWidth - this._$width;
    }

    getResizerOffsetCallback(): TResizerOffsetCallback {
        return this._$resizerOffsetCallback;
    }
}

Object.assign(ColumnResizer.prototype, {
    _moduleName: 'Controls/grid:ColumnResizerCell',
    _instancePrefix: 'grid-item-resizer-cell-',
    _$width: null,
    _$minWidth: null,
    _$maxWidth: null,
    _$resizerOffsetCallback: null,
});
