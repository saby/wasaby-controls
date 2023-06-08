/**
 * @kaizen_zone 5bf318b9-a50e-48ab-9648-97a640e41f94
 */
import { Control } from 'UI/Base';
import template = require('wml!Controls/_suggestPopup/Layer/__PopupLayer');
import getZIndex = require('Controls/Utils/getZIndex');
import { detection } from 'Env/Env';
import 'css!Controls/suggestPopup';
import 'css!Controls/suggest';

const _private = {
    openPopup(self, opener, options): void {
        // !!closeOnOutsideClick не добавлять, иначе саггест закрывается при клике на саггест
        const dynamicConfig = {
            target: options.target,
            opener: self,
            actionOnScroll: detection.isMobileIOS || detection.isMobileAndroid ? 'none' : 'close',
            zIndex: getZIndex(self), // _vdomOnOldPage для слоя совместимости, уйдёт с удалением опции.k
        };
        opener.open({ ...dynamicConfig, ...self._popupOptions });
    },

    setPopupOptions(self, options) {
        const config = {
            autofocus: false,
            allowAdaptive: false,
            direction: {
                vertical: 'bottom',
            },
            targetPoint: {
                vertical: 'bottom',
            },
            resizeCallback: self._resizeCallback,
        };
        self._popupOptions = {
            ...config,
            ...(options.suggestPopupOptions || {}),
        };
    },
};

const PopupLayer = Control.extend({
    _template: template,

    _beforeMount(options) {
        this._resizeCallback = this._resizeCallback.bind(this);
        _private.setPopupOptions(this, options);
    },

    _afterMount(options) {
        _private.openPopup(this, this._children.suggestPopup, options);
    },

    _afterUpdate(oldOptions) {
        if (
            this._options.searchValue !== oldOptions.searchValue ||
            this._options.filter !== oldOptions.filter ||
            this._options.showContent !== oldOptions.showContent ||
            this._options.showFooter !== oldOptions.showFooter ||
            this._options.misspellingCaption !== oldOptions.misspellingCaption ||
            this._options.tabsSelectedKey !== oldOptions.tabsSelectedKey
        ) {
            _private.openPopup(this, this._children.suggestPopup, this._options);
        }
    },

    close() {
        this._children.suggestPopup.close();
    },

    _onResult(event, position): void {
        // fix suggest position after show
        this._popupOptions.direction = {
            vertical: position.direction.vertical,
            horizontal: position.direction.horizontal,
        };
        this._popupOptions.offset = {
            vertical: position.offset.vertical,
            horizontal: position.offset.horizontal,
        };

        // position.corner fixed by https://online.sbis.ru/opendoc.html?guid=b7a05d49-4a68-423f-81d0-70374f875a22
        this._popupOptions.targetPoint = position.targetPoint;
        this._popupOptions.fittingMode = 'fixed';

        // update popup's options
        _private.openPopup(this, this._children.suggestPopup, this._options);
    },

    _resizeCallback(): void {
        if (this._children.popupContent) {
            this._children.popupContent.resize();
        }
    },
});

PopupLayer._private = _private;

export default PopupLayer;
