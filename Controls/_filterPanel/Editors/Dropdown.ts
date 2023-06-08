/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Model } from 'Types/entity';
import { StackOpener } from 'Controls/popup';
import { _Controller as DdlController } from 'Controls/dropdown';
import { TKey } from 'Controls/interface';
import { isEqual } from 'Types/object';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { RecordSet, List } from 'Types/collection';
import { IMenuPopupOptions } from 'Controls/menu';
import { IFrequentItemOptions } from 'Controls/_filterPanel/Editors/resources/IFrequentItem';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { factory } from 'Types/chain';
import * as cInstance from 'Core/core-instance';
import DropdownTemplate = require('wml!Controls/_filterPanel/Editors/Dropdown');
import 'css!Controls/filterPanel';

interface IDropdownOptions
    extends IControlOptions,
        IMenuPopupOptions,
        IFrequentItemOptions {
    propertyValue: number[] | string[];
    keyProperty: string;
    displayProperty: string;
    multiSelect: boolean;
    fontSize: string;
    items: RecordSet;
}

interface IDropdown {
    readonly '[Controls/_filterPanel/Editors/Dropdown]': boolean;
}

/**
 * Контрол используют в качестве редактора для выбора значения из выпадающего списка.
 * @class Controls/_filterPanel/Editors/Dropdown
 * @extends UI/Base:Control
 * @mixes Controls/menu:IMenuPopup
 * @mixes Controls/filterPopup:Dropdown
 * @public
 */

class DropdownEditor extends Control<IDropdownOptions> implements IDropdown {
    readonly '[Controls/_filterPanel/Editors/Dropdown]': boolean = true;
    protected _template: TemplateFunction = DropdownTemplate;
    protected _textValue: string = '';
    protected _stackOpener: StackOpener;
    protected _sourceController: SourceController;
    protected _controller: DdlController;

    protected _handleSelectedKeysChanged(
        event: SyntheticEvent,
        value: number[] | string[]
    ): void {
        const viewMode =
            !this._options.emptyText &&
            !this._options.selectedAllText &&
            this._options.extendedCaption &&
            isEqual(value, this._options.resetValue)
                ? 'extended'
                : 'basic';
        this._notifySelectedKeysChanged(value, this._textValue, viewMode);
    }

    protected _handleMenuItemActivate(
        event: SyntheticEvent,
        data: Model
    ): void {
        const result = this._prepareResultFromMenu([data]);
        this._notifySelectedKeysChanged(
            this._options.multiSelect ? result.value : result.value[0],
            result.textValue
        );
    }

    protected _handleApplyClick(data: Model[]): void {
        this._applySelectedItems(data);
    }

    protected _applySelectedItems(data: Model[]): void {
        const result = this._prepareResultFromMenu(data);
        this._notifySelectedKeysChanged(
            this._options.multiSelect ? result.value : result.value[0],
            result.textValue
        );
    }

    protected _handleItemClick(): void {
        const value = this._options.multiSelect
            ? [this._options.emptyKey]
            : this._options.emptyKey;
        this._textValue = this._options.emptyText;
        this._notifySelectedKeysChanged(value, this._textValue);
    }

    protected _prepareResultFromMenu(result: Model[]): {
        value: TKey[];
        textValue: string;
    } {
        const selectedKeys = [];
        const textValue = [];

        result.forEach((item) => {
            selectedKeys.push(item.get(this._options.keyProperty));
            textValue.push(item.get(this._options.displayProperty));
        });

        return {
            value: selectedKeys,
            textValue: textValue.join(', '),
        };
    }

    protected _hasHistory(): boolean {
        return (
            this._options.historyId ||
            cInstance.instanceOfModule(
                this._options.source,
                'Controls/history:Source'
            )
        );
    }

    protected _frequentItemClickHandler(event, extendedValue): void {
        this._notifySelectedKeysChanged(
            extendedValue.value,
            extendedValue.textValue
        );
    }

    protected _openMenu(event: Event): void {
        const eventHandlers = {
            onResult: (action, data) => {
                switch (action) {
                    case 'itemClick':
                        const item = this._controller.getPreparedItem(data);
                        this._handleMenuItemActivate(null, item);
                        this._controller.handleSelectedItems(item);
                        break;
                    case 'applyClick':
                        this._handleApplyClick(data);
                        this._controller.handleSelectedItems(data);
                        break;
                    case 'openSelectorDialog':
                        this._openSelectorDialog(data);
                }
            },
        };

        this._getDropdownController().then(() => {
            this._controller.setMenuPopupTarget(this._container);
            this._controller.openMenu({ eventHandlers }).then((items) => {
                if (items) {
                    this._applySelectedItems(items);
                }
            });
        });
    }

    protected _openMenuWithItems(
        event: SyntheticEvent,
        items: RecordSet
    ): void {
        if (!items.getCount()) {
            this._handleItemClick();
        }
    }

    protected _deactivated(): void {
        if (this._controller) {
            this._controller.closeMenu();
        }
    }

    protected _beforeUnmount(): void {
        if (this._controller) {
            this._controller.destroy();
        }
    }

    private _openSelectorDialog(items: object[]): void {
        this._controller.openSelectorDialog(items);
    }

    private _getDropdownController(): Promise<DdlController> {
        return loadAsync('Controls/dropdown').then(({ _Controller }) => {
            const selectedKeys =
                this._options.propertyValue instanceof Array
                    ? this._options.propertyValue
                    : [this._options.propertyValue];
            return (this._controller = new _Controller({
                ...this._options,
                openerControl: this._children.opener,
                popupClassName: 'controls-MenuButton_outlined__m_popup',
                markerVisibility: this._options.multiSelect
                    ? 'hidden'
                    : 'onactivated',
                headingCaption: this._options.menuHeadingCaption,
                selectorDialogResult: this._selectorTemplateResult.bind(this),
                selectedKeys,
            }));
        });
    }

    private _selectorTemplateResult(items: List<Model>): void {
        this._applySelectedItems(factory(items).toArray());
        this._controller.handleSelectorResult(items);
    }

    protected _handleTextValueChanged(
        event: SyntheticEvent,
        value: string
    ): void {
        this._textValue = value;
    }

    private _notifySelectedKeysChanged(
        value: TKey[] | TKey,
        textValue: string,
        viewMode: string = 'basic'
    ): void {
        if (!isEqual(value, this._options.propertyValue)) {
            const extendedValue = {
                value,
                textValue,
                viewMode,
            };
            this._notify('propertyValueChanged', [extendedValue], {
                bubbling: true,
            });
        }
    }
}

export default DropdownEditor;
