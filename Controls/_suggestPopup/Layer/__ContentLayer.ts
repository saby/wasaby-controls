/**
 * @kaizen_zone 5bf318b9-a50e-48ab-9648-97a640e41f94
 */
import { Control, TemplateFunction } from 'UI/Base';
import { detection } from 'Env/Env';
import template = require('wml!Controls/_suggestPopup/Layer/__ContentLayer');
import 'css!Controls/suggestPopup';
import 'css!Controls/suggest';
import { moveBodyScroll, unMoveBodyScroll } from 'UI/Adaptive';

const _private = {
    getSizes(self, dropDownContainer?: HTMLElement): object {
        const boundingClientToJSON = (bc) => {
            let resultObj = {};

            // firefox bug, clientRect object haven't method toJSON
            if (bc.toJSON) {
                resultObj = bc.toJSON();
            } else {
                for (const i in bc) {
                    // hasOwnProperty does not work correctly on clientRect object in FireFox and IE (not all versions)
                    if (Object.getPrototypeOf(bc).hasOwnProperty(i)) {
                        resultObj[i] = bc[i];
                    }
                }
            }

            return resultObj;
        };

        let container = self._container;
        let targetContainer = self._options.target;

        // TODO https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
        if (container.get) {
            container = container.get(0);
        }
        if (targetContainer.get) {
            targetContainer = targetContainer.get(0);
        }

        const oldHeight = container.style.height;

        // reset height to get real height of content
        // the only solution is to get height avoiding synchronization
        container.style.height = '';

        const suggestBCR = boundingClientToJSON(container.getBoundingClientRect());
        const containerBCR = boundingClientToJSON(targetContainer.getBoundingClientRect());
        const dropDownContainerBCR = _private.getDropDownContainerSize(dropDownContainer);

        /* because dropDownContainer can have height smaller, than window height */
        const fixSizesByDDContainer = (size) => {
            size.top -= dropDownContainerBCR.top;
            size.bottom -= dropDownContainerBCR.top;
            return size;
        };

        const result = {
            suggest: fixSizesByDDContainer(suggestBCR),
            container: fixSizesByDDContainer(containerBCR),
        };

        // after reset height need to return old height, new height will be set by VDOM after synchronization
        container.style.height = oldHeight;
        return result;
    },

    getDropDownContainerSize(container?: HTMLElement): DOMRect {
        const dropdownContainer =
            container ||
            document.getElementsByClassName('controls-Popup__stack-target-container')[0] ||
            document.body;
        return dropdownContainer.getBoundingClientRect();
    },

    updateHeight(self): void {
        const height = _private.calcHeight(self);
        const heightChanged = self._height !== height;

        if (heightChanged) {
            self._height = height;
            self._controlResized = true;
        }
    },

    updateWidth(self): void {
        if (detection.isIE11) {
            self._width =
                self._options.target.offsetWidth +
                self._children.closeButton._container.offsetWidth +
                Math.abs(self._container.offsetLeft) * 2 +
                'px';
        }
    },

    /**
     * calculate height of suggestions container by orient and suggestions container sizes
     * @param self
     * @param sizes size of suggestions container and input container
     * @param dropDownContainer container for dropDown
     * @returns {string}
     */
    calcHeight(self, dropDownContainer): string {
        const sizes = _private.getSizes(self, dropDownContainer);
        const dropDownContainerSize = _private.getDropDownContainerSize(dropDownContainer);
        const suggestSize = sizes.suggest;
        let height = self._height;
        const optionValue = suggestSize.top;
        const suggestBottomSideCoord = optionValue + suggestSize.height;

        if (suggestBottomSideCoord < 0) {
            height = suggestSize.height + suggestBottomSideCoord + 'px';
        } else if (suggestBottomSideCoord >= dropDownContainerSize.height) {
            height = dropDownContainerSize.height - suggestSize.top + 'px';
        } else if (height) {
            height = 'auto';
        }
        return height;
    },

    calcWidth(self, dropDownContainer?): string {
        const sizes = _private.getSizes(self, dropDownContainer);
        return sizes.suggest.width + 'px';
    },

    calcOffsets(self, sizes): void {
        if (document.body.clientWidth < sizes.suggest.right) {
            self._offsets.left =
                document.body.clientWidth - sizes.suggest.right + self._inputOffset;
            if (!self._options.isAdaptive) {
                self._options.layerOptions.popupOffsetCallback({
                    left: self._offsets.left + Math.abs(self._inputOffset),
                });
            }
        }
    },

    updateMaxHeight(self): void {
        const dropDownContainerBCR = _private.getDropDownContainerSize();
        if (dropDownContainerBCR !== self._dropDownContainerBCR) {
            self._dropDownContainerBCR = dropDownContainerBCR;
            const suggestBCR = self._container.getBoundingClientRect();
            if (self._options.isAdaptive) {
                const navigationPanelsSidebarHeight = self._options.isAdaptive
                    ? Number(getComputedStyle(self._container).marginBottom.replace('px', ''))
                    : 0;

                self._maxHeight =
                    document.documentElement.clientHeight -
                    suggestBCR.top -
                    navigationPanelsSidebarHeight +
                    'px';
            } else {
                self._maxHeight = dropDownContainerBCR.height - suggestBCR.top + 'px';
            }
        }
    },

    updateOffsets(self): void {
        self._inputOffset = self._container.offsetLeft;
        const sizes = _private.getSizes(self);
        _private.calcOffsets(self, sizes);
    },
};

export default class ContentLayer extends Control {
    protected _template: TemplateFunction = template;
    private _height: string = '0px';
    private _width: string = null;
    private _openDirection: string = 'right';
    private _maxHeight: string = 'none';
    private _inputWidth: string = '';
    private _showContent: boolean = false;
    private _pendingShowContent: boolean = false;
    private _controlResized: boolean = false;
    private _offsets: object = { left: null };
    private _inputOffset: number;

    _beforeMount(options): void {
        this._inputWidth = this._getInputWidth(options);
    }

    _afterMount(): void {
        moveBodyScroll();
        _private.updateHeight(this);
        _private.updateWidth(this);
        _private.updateOffsets(this);
    }

    protected _beforeUnmount() {
        unMoveBodyScroll();
    }

    _afterUpdate(): void {
        /* 1) checking suggestionsContainer in children, because suggest initializing asynchronously
       2) do not change orientation of suggest, if suggest already showed or data loading now */
        _private.updateMaxHeight(this);
        if (this._options.showContent) {
            const needNotifyControlResizeEvent = this._controlResized;

            _private.updateHeight(this);
            _private.updateWidth(this);
            this._inputWidth = this._getInputWidth(this._options);

            // Дружелюбной ошибке нужно посчитать размеры, чтобы понять, какой вид изображения отображать
            // Поэтому в случае отображения ошибки показываем контент автодополнения через цикл синхронизации
            // Чтобы не было морганий
            if (this._pendingShowContent) {
                this._showContent = this._pendingShowContent;
                this._pendingShowContent = false;
            } else if (
                this._options.errorConfig &&
                this._options.showContent &&
                !this._showContent
            ) {
                this._pendingShowContent = this._options.showContent;
            } else {
                this._showContent = this._options.showContent;
            }

            if (needNotifyControlResizeEvent) {
                this._children.resize.start();
                this._controlResized = false;
            }
        }
    }

    _resize(): void {
        _private.updateMaxHeight(this);
        _private.updateHeight(this);
        this._inputWidth = this._getInputWidth(this._options);
    }

    _getInputWidth(options): string {
        return options.target.offsetWidth + 'px';
    }

    _getNavigationTheme(): string {
        return this._options.isAdaptive
            ? `navigation_theme-${this._options.theme} controls-suggestPopup_offset-bottom`
            : '';
    }

    close(): void {
        this._notify('close', [], { bubbling: true });
    }

    static _private = _private;
}
