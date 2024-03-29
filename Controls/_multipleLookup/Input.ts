/**
 * @kaizen_zone 1194f522-9bc3-40d6-a1ca-71248cb8fbea
 */
import * as template from 'wml!Controls/_multipleLookup/Input/Input';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { ILookupInputOptions, BaseLookupInput } from 'Controls/lookup';
import { SyntheticEvent } from 'UICommon/Events';
import { TKeysSelection } from 'Controls/interface';
import { IStackPopupOptions } from 'Controls/popup';
import { EventUtils } from 'UI/Events';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { isEqual } from 'Types/object';
import { UnregisterUtil, RegisterUtil } from 'Controls/event';
import 'css!Controls/multipleLookup';

// optionName: defaultValue
const MULTIPLE_OPTIONS = {
    selectedKeys: [],
    value: '',
    items: void 0,
};

export interface ILookupInputOptions extends ILookupInputOptions {
    name: string;
}

export interface IInputOptions extends IControlOptions {
    lookupsOptions: ILookupInputOptions[];
}

type TMultipleSelectedKeys = Record<string, TKeysSelection>;
type TMultipleValue = Record<string, string>;
type TMultipleItems = Record<string, RecordSet>;
type TLookupSizes = Record<string, number>;

/**
 * Поле ввода с автодополнением и возможностью выбора значений из нескольких справочников.
 *
 * @remark
 * Отличается от {@link Controls/_lookup/Lookup поля связи} тем, что контрол разделён на несколько полей,
 * для каждого поля выводится своё автодополнение и открывается свой справочник.
 * Ширина выбранных значений будет пропорционально распределена по ширине контрола, чтобы все значения поместились.
 *
 *
 * @class Controls/_multipleLookup/Input
 * @extends UI/Base:Control
 * @implements Controls/lookup:IInput
 * @demo Controls-demo/Lookup/MultipleInput/MultipleInput
 *
 * @public
 */
export default class Input extends Control<IInputOptions> {
    protected _template: TemplateFunction = template;
    protected _suggestTarget: HTMLElement;
    protected _selectedKeys: TMultipleSelectedKeys = {};
    protected _value: TMultipleValue = {};
    protected _items: TMultipleItems = {};
    protected _lookupSizes: TLookupSizes = {};
    protected _notifyProxy: Function = EventUtils.tmplNotify;
    private _calcSizesAfterDraw: boolean = false;
    protected _children: Record<string, BaseLookupInput>;
    protected _suggestState: boolean;

    protected _beforeMount(options: IInputOptions): void {
        this._setStateFromLookupsOptions(options);
    }

    protected _afterMount(): void {
        RegisterUtil(this, 'controlResize', this._requestResize.bind(this), {
            listenAll: true,
        });
    }

    _beforeUpdate(newOptions: IInputOptions): void {
        if (!isEqual(newOptions.lookupsOptions, this._options.lookupsOptions)) {
            this._setStateFromLookupsOptions(newOptions);
        }
        Object.entries(MULTIPLE_OPTIONS).forEach(([optionName]) => {
            if (!isEqual(newOptions[optionName], this._options[optionName])) {
                newOptions.lookupsOptions.forEach((lookupOptions) => {
                    this._setOptionValue(newOptions, lookupOptions, optionName);
                });
                // Изменение опции items приведёт к синхронной перерисовке полей связи
                // после которой надо пересчитать размеры
                if (optionName === 'items') {
                    this._requestResize();
                }
            }
        });
    }

    protected _afterRender(): void {
        if (this._calcSizesAfterDraw) {
            this._calcSizesAfterDraw = false;
            this._calcSizes();
        }
    }

    protected _lookupActivated(): void {
        this._suggestTarget = this._container;
        this._calcSizes();
    }

    protected _selectedKeysChanged(
        event: SyntheticEvent,
        lookupName: string,
        selectedKeys: TKeysSelection[],
        added: TKeysSelection[]
    ): void {
        this._setStateAndNotifyEventByOptionName(
            selectedKeys,
            'selectedKeys',
            lookupName
        );
        if (added.length) {
            this._calcSizes();
        } else {
            this._requestResize();
        }
    }

    protected _valueChanged(
        event: SyntheticEvent,
        lookupName: string,
        value: string
    ): void {
        this._setStateAndNotifyEventByOptionName(value, 'value', lookupName);
    }

    protected _itemsChanged(
        event: SyntheticEvent,
        lookupName: string,
        items: RecordSet
    ): void {
        this._setStateAndNotifyEventByOptionName(items, 'items', lookupName);
    }

    private _setStateFromLookupsOptions(options: IInputOptions): void {
        options.lookupsOptions.forEach((lookupOptions) => {
            Object.entries(MULTIPLE_OPTIONS).forEach(([optionName]) => {
                this._setOptionValue(options, lookupOptions, optionName);
            });
        });
    }

    protected _getLookupOptions(
        options: IInputOptions,
        lookupName: string
    ): ILookupInputOptions {
        return options.lookupsOptions.find(({ name }) => {
            return name === lookupName;
        });
    }

    private _getOptionValueByLookupName(
        option: unknown,
        lookupName: string
    ): unknown {
        if (option instanceof Object && option.hasOwnProperty(lookupName)) {
            return option[lookupName];
        }
    }

    private _setOptionValue(
        options: IInputOptions,
        lookupOptions: ILookupInputOptions,
        optionName: string
    ): void {
        const lookupName = lookupOptions.name;
        const optionValue =
            lookupOptions[optionName] ||
            this._getOptionValueByLookupName(options[optionName], lookupName) ||
            MULTIPLE_OPTIONS[optionName];
        this._cloneAndSetStateByOptionValue(
            optionValue,
            optionName,
            lookupName
        );
    }

    protected _cloneAndSetStateByOptionValue(
        value: unknown,
        optionName: string,
        lookupName: string
    ): void {
        const state = this._getStateNameByOptionName(optionName);
        this[state] = this._cloneObject(this[state]);
        this[state][lookupName] =
            value instanceof Object && value[lookupName] !== undefined
                ? value[lookupName]
                : value;
    }

    protected _getValueFromStateByOptionName(
        optionName: string,
        lookupName: string
    ): unknown {
        return this[this._getStateNameByOptionName(optionName)][lookupName];
    }

    protected _getStateNameByOptionName(optionName: string): string {
        return '_' + optionName;
    }

    protected _setStateAndNotifyEventByOptionName(
        value: unknown,
        optionName: string,
        lookupName: string
    ): void {
        this._cloneAndSetStateByOptionValue(value, optionName, lookupName);
        this._notify(optionName + 'Changed', [
            this[this._getStateNameByOptionName(optionName)],
            lookupName,
        ]);
    }

    protected _cloneObject(obj: object): object {
        const newObject = {};

        for (const i in obj) {
            if (obj.hasOwnProperty(i)) {
                newObject[i] = obj[i];
            }
        }

        return newObject;
    }

    protected _calcSizes(): void {
        this._options.lookupsOptions.forEach(({ name }, index) => {
            if (!this._selectedKeys[name].length) {
                if (!this._lookupSizes[name]) {
                    const isLastLookup =
                        index === this._options.lookupsOptions.length - 1;
                    const lookupContainer =
                        this._children[name].getLookupContainer();
                    this._lookupSizes = { ...this._lookupSizes };
                    this._lookupSizes[name] = isLastLookup
                        ? this._getLastLookupWidth(lookupContainer)
                        : lookupContainer.getBoundingClientRect().width;
                }
            } else if (this._lookupSizes.hasOwnProperty(name)) {
                this._lookupSizes = { ...this._lookupSizes };
                delete this._lookupSizes[name];
            }
        });
    }

    private _getLastLookupWidth(lookupContainer: HTMLElement): number {
        const placeholder = lookupContainer.querySelector(
            '.controls-Lookup__placeholder_style-multipleInputNew'
        );
        const showSelectorButton = lookupContainer.querySelector(
            '.controls-Lookup__rightFieldWrapper'
        );
        // Ширина placeholder'a + ширина кнопки открытия справочника
        // + ширина крестика (считаем просто как ширина кнопки открытия справочника * 2)
        if (placeholder) {
            // Ширина внутреннего поля связи не может быть больше ширины контрола
            return Math.min(
                this._container.offsetWidth,
                placeholder.getBoundingClientRect().width +
                    showSelectorButton.getBoundingClientRect().width * 2
            );
        } else {
            return 0;
        }
    }

    private _requestResize(): void {
        this._calcSizesAfterDraw = true;
        this._lookupSizes = {};
    }

    protected _showSelector(
        event: SyntheticEvent,
        lookupName: string
    ): unknown {
        const eventResult = this._notify('showSelector');
        if (eventResult !== false) {
            this.showSelector(lookupName);
        }
        event.stopPropagation();
        return eventResult;
    }

    protected _itemClick(
        event: SyntheticEvent,
        lookupName: string,
        item: Model
    ): void {
        this._notify('itemClick', [item, lookupName]);
    }

    protected _choose(
        event: SyntheticEvent,
        lookupName: string,
        item: Model
    ): void {
        this._notify('choose', [item, lookupName]);
    }

    protected _proxyEvent(
        event: SyntheticEvent,
        eventName: string,
        lookupName: string
    ): void {
        const eventArgsIndex = 3;
        const args = Array.prototype.slice.call(arguments, eventArgsIndex);
        return this._notify(eventName, args.concat(lookupName));
    }

    protected _needShowSeparator(
        lookupOptionsIndex: number,
        lookupsOptions: ILookupInputOptions[],
        readOnly: boolean
    ): boolean {
        return (
            lookupOptionsIndex !== lookupsOptions.length - 1 &&
            (!readOnly ||
                !!this._selectedKeys[
                    lookupsOptions[lookupOptionsIndex + 1]?.name
                ]?.length)
        );
    }

    protected _beforeUnmount(): void {
        UnregisterUtil(this, 'controlResize');
    }

    showSelector(lookupName: string, popupOptions?: IStackPopupOptions): void {
        this._children[lookupName].showSelector(popupOptions);
    }

    openSuggest(lookupName: string): void {
        this._children[lookupName].openSuggest();
    }

    closeSuggest(lookupName: string): void {
        this._children[lookupName].closeSuggest();
    }

    suggestStateChanged(event: SyntheticEvent, state: boolean): void {
        this._suggestState = state;
    }
}

/**
 * @name Controls/_multipleLookup/Input#showSelectButton
 * @cfg {Boolean} Управляет отображением кнопки выбора из справочника.
 * @default true
 * @demo Controls-demo/Lookup/MultipleInputNew/ShowSelectButton/Index
 */
