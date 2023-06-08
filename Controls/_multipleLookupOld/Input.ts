/**
 * @kaizen_zone 1194f522-9bc3-40d6-a1ca-71248cb8fbea
 */
import {
    ItemTemplate as itemTemplate,
    ShowSelectorTemplate,
    BaseLookupInput,
    ILookupInputOptions,
    showSelector,
    BaseLookup,
} from 'Controls/lookup';
import { TemplateFunction } from 'UI/Base';
import { IStackPopupOptions } from 'Controls/popup';
import { getWidth } from 'Controls/sizeUtils';
import * as inputRender from 'wml!Controls/_multipleLookupOld/Input/resources/inputRender';

let SHOW_SELECTOR_WIDTH = 0;
let OUTER_INDENT_INPUT = 0;
/**
 * Поле ввода с автодополнением и возможностью выбора значений из справочника.
 *
 * @remark
 * Отличается от {@link Controls/_lookup/Lookup поля связи} выводом выбранных значений.
 * Ширина выбранных занчений будет пропорционально распределена по ширине контрола, чтобы все значения поместились.
 *
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FLookup%2FIndex демо-пример}
 * * {@link /doc/platform/developmentapl/interface-development/controls/input-elements/directory/lookup/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_lookup.less переменные тем оформления}
 *
 * @class Controls/_multipleLookupOld/Input
 * @extends UI/Base:Control
 * @implements Controls/interface:ILookup
 * @implements Controls/interface/ISelectedCollection
 * @implements Controls/interface:ISelectorDialog
 * @implements Controls/interface:ISuggest
 * @implements Controls/interface:ISearch
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/interface:ITextValue
 * @implements Controls/interface:INavigation
 * @implements Controls/interface:IMultiSelectable
 * @implements Controls/interface:ISorting
 * @mixes Controls/input:IBase
 * @implements Controls/interface:IInputPlaceholder
 * @mixes Controls/input:IText
 * @implements Controls/interface:IHeight
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IInputTag
 * @mixes Controls/input:IValue
 * @implements Controls/interface:ILookup
 *
 * @public
 */
export default class Input extends BaseLookupInput {
    protected _rootContainerClasses: string = 'controls-Lookup controls-MultipleInput';
    protected _itemTemplateClasses: string = 'controls-MultipleInput__SelectedCollection_item';
    protected _listOfDependentOptions: string[] = [
        'displayProperty',
        'readOnly',
        'placeholder',
        'isInputVisible',
    ];
    protected _availableWidthCollection: number;

    showSelector(popupOptions?: IStackPopupOptions): boolean {
        this.closeSuggest();
        return showSelector(this, popupOptions, false);
    }

    _calculateSizes(options: ILookupInputOptions): void {
        this._maxVisibleItems = this._items.getCount();
        this._availableWidthCollection = this._getAvailableWidthCollection(options);
    }

    _isInputVisible(options: ILookupInputOptions): boolean {
        return (
            (!options.readOnly || this._getInputValue(options)) &&
            this._items.getCount() < options.maxVisibleItems
        );
    }

    _isNeedCalculatingSizes(options: ILookupInputOptions): boolean {
        return !options.readOnly && !this._isEmpty();
    }

    private _getAvailableWidthCollection(options: ILookupInputOptions): number {
        let placeholderWidth;
        let availableWidthCollection = this._getFieldWrapperWidth();

        this._initializeConstants();

        if (!options.readOnly) {
            availableWidthCollection -= SHOW_SELECTOR_WIDTH;
        }

        if (this._isInputVisible(options)) {
            placeholderWidth = Input._getPlaceholderWidth(options.placeholder);
            availableWidthCollection -= placeholderWidth + OUTER_INDENT_INPUT;
        }

        return availableWidthCollection;
    }

    private _initializeConstants(): void {
        if (!SHOW_SELECTOR_WIDTH) {
            // The template runs in isolation from the application, so the theme will not be inherited from Application.
            const showSelectorTemplate = [
                ShowSelectorTemplate.render({ theme: this._options.theme }),
            ] as unknown as HTMLElement;
            SHOW_SELECTOR_WIDTH = getWidth(showSelectorTemplate);
            OUTER_INDENT_INPUT = getWidth(
                inputRender({ theme: this._options.theme }, undefined, undefined, true)
            );
        }
    }

    private static _getPlaceholderWidth(placeholder?: string | TemplateFunction): number {
        let placeHolderTpl;

        if (placeholder) {
            if (placeholder.isDataArray) {
                placeHolderTpl = placeholder.array.reduce(
                    (currentPlaceholder: string, template: TemplateFunction) => {
                        return currentPlaceholder + template.func();
                    },
                    ''
                );
            } else if (placeholder.func instanceof Function) {
                placeHolderTpl = placeholder.func();
            } else {
                placeHolderTpl = placeholder;
            }
        }

        return placeholder ? getWidth(placeHolderTpl) : 0;
    }

    static getDefaultOptions(): object {
        return {
            ...BaseLookup.getDefaultOptions(),
            ...{
                itemTemplate,
                multiSelect: true,
                showClearButton: false,
            },
        };
    }
}

/**
 * @name Controls/_multipleLookupOld/Input#fontSize
 * @cfg {String} Размер шрифта записи
 * @demo Controls-demo/Lookup/MultipleInput/Index
 */
