/**
 * @kaizen_zone 151eca3e-138d-4a14-b047-880c0aeecf79
 */
import cExtend = require('Core/core-simpleExtend');
import entity = require('Types/entity');

/**
 *
 * @private
 */
const BaseViewModel = cExtend.extend(
    [entity.ObservableMixin.prototype, entity.VersionableMixin],
    {
        constructor: function BaseViewModelConstructor(cfg: object) {
            this._options = cfg;
        },

        isCachedItemData() {
            throw new Error(
                `BaseViewModel#isCachedItemData is not implemented for ${this._moduleName}`
            );
        },
        getCachedItemData() {
            throw new Error(
                `BaseViewModel#getCachedItemData is not implemented for ${this._moduleName}`
            );
        },
        setCachedItemData() {
            throw new Error(
                `BaseViewModel#setCachedItemData is not implemented for ${this._moduleName}`
            );
        },
        resetCachedItemData() {
            throw new Error(
                `BaseViewModel#resetCachedItemData is not implemented for ${this._moduleName}`
            );
        },

        destroy() {
            entity.ObservableMixin.prototype.destroy.apply(this, arguments);
            this._options = null;
        },
    }
);

export = BaseViewModel;
