/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import * as CommandDispatcher from 'Core/CommandDispatcher';
import * as Control from 'Lib/Control/CompoundControl/CompoundControl';
import * as template from 'wml!Controls/_compatiblePopup/Notification/Notification';
import 'css!Controls/compatiblePopup';

/**
 * Замена SBIS3.CONTROLS/NotificationPopup при открытии нотификационных окон через vdom механизм.
 */

/**
 * @name Controls/Popup/Templates/Notification/Compatible#headerTemplate
 * @cfg {Function} Устанавливает шаблон шапки нотификационного уведомления.
 */

/**
 * @name Controls/Popup/Templates/Notification/Compatible#bodyTemplate
 * @cfg {Function} Устанавливает шаблон для содержимого нотификационного уведомления.
 */

/**
 * @name Controls/Popup/Templates/Notification/Compatible#footerTemplate
 * @cfg {Function} Устанавливает шаблон футера нотификационного уведомления.
 */

/**
 * @name Controls/Popup/Templates/Notification/Compatible#closeButton
 * @cfg {Boolean} Должна ли быть кнопка закрытия.
 */

/**
 * @name Controls/Popup/Templates/Notification/Compatible#icon
 * @cfg {String} Иконка в шапке.
 */

/**
 * Инстанс vdom opener.
 * @name Controls/Popup/Templates/Notification/Compatible#_opener
 * @cfg {String}
 */

/**
 * Deffered в callback которого приходит инстанс компонента.
 * @name Controls/Popup/Templates/Notification/Compatible#_def
 * @cfg {Core/Deferred}
 */
const Compatible = Control.extend({
    _dotTplFn: template,

    $constructor(): void {
        /*
        Поддержка комманды close брошеная из дочерних контролов.
       */
        CommandDispatcher.declareCommand(this, 'close', this.close.bind(this));
    },

    init(): void {
        Compatible.superclass.init.apply(this, arguments);

        this._options._def.callback(this);
    },

    /**
     * Прикладники обращаются к методу open для открытия. Раньше они имели popup, а сейчас текущий компонент.
     */
    open(): void {
        this._options._opener.open();
    },

    /**
     * Прикладники обращаются к методу close для закрытия. Раньше они имели popup, а сейчас текущий компонент.
     */
    close(): void {
        if (!this.isDestroyed()) {
            const compoundContainer = this.getParent();
            const vdomNotificationTemplate = compoundContainer._logicParent;
            vdomNotificationTemplate._notify('close', [], { bubbling: true });
        }
    },
});
export default Compatible;
