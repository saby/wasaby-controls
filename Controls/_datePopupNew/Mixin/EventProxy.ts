/**
 * @kaizen_zone 3000b102-db75-420e-bda6-37c50495ae25
 */
/**
 * An mixin that allows the component to proxy events from models and internal controls.
 * @class Controls/_datePopup/Mixin/EventProxy
 * @private
 */

const Mixin = {
    /**
     * Проксирует событие из компонента
     * @protected
     */
    _proxyEvent: (event: Event): void => {
        this._notify(event.type, Array.prototype.slice.call(arguments, 1));
    },
};

export default Mixin;
