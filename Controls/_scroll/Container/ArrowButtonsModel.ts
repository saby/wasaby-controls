/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
import { mixin } from 'Types/util';
import { IVersionable, VersionableMixin } from 'Types/entity';

export default class ArrowButtonsModel
    extends mixin<VersionableMixin>(VersionableMixin)
    implements IVersionable
{
    readonly '[Types/_entity/VersionableMixin]': true;

    /**
     * Признак Видимости кнопки прокрутки вверх
     */
    private _isTopVisible: boolean = false;

    /**
     * Признак Видимости кнопки прокрутки вниз
     */
    private _isBottomVisible: boolean = false;

    /**
     * Признак того, что значение кнопки вверх неизменяемое
     */
    isTopFixed: boolean = false;

    /**
     * Признак того, что значение кнопки вниз неизменяемое
     */
    isBottomFixed: boolean = false;

    /**
     * Признак Видимости кнопки прокрутки влево
     */
    private _isLeftVisible: boolean = false;

    /**
     * Признак Видимости кнопки прокрутки вправо
     */
    private _isRightVisible: boolean = false;

    /**
     * Признак того, что значение кнопки влево неизменяемое
     */
    isLeftFixed: boolean = false;

    /**
     * Признак того, что значение кнопки вправо неизменяемое
     */
    isRightFixed: boolean = false;

    set isTopVisible(value: boolean) {
        if (value !== this._isTopVisible) {
            this._isTopVisible = value;
            this._nextVersion();
        }
    }

    get isTopVisible(): boolean {
        return this._isTopVisible;
    }

    set isBottomVisible(value: boolean) {
        if (value !== this._isBottomVisible) {
            this._isBottomVisible = value;
            this._nextVersion();
        }
    }

    get isBottomVisible(): boolean {
        return this._isBottomVisible;
    }

    set isLeftVisible(value: boolean) {
        if (value !== this._isLeftVisible) {
            this._isLeftVisible = value;
            this._nextVersion();
        }
    }

    get isLeftVisible(): boolean {
        return this._isLeftVisible;
    }

    set isRightVisible(value: boolean) {
        if (value !== this._isRightVisible) {
            this._isRightVisible = value;
            this._nextVersion();
        }
    }

    get isRightVisible(): boolean {
        return this._isRightVisible;
    }
}
