import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/EditInPlace/KeyboardControl/KeyboardControl';
import * as EditingCellTmpl from 'wml!Controls-demo/gridNew/EditInPlace/KeyboardControl/EditingCellTemplate';
import { IColumnRes } from 'Controls-demo/gridNew/DemoHelpers/DataCatalog';
import { Editing } from 'Controls-demo/gridNew/DemoHelpers/Data/Editing';
import { Memory } from 'Types/source';
import { editing } from 'Controls/list';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Editing.getEditingData('full');
}

/**
 * Демо пример для автотестирования аспекта управления управлением редактированием по месту в таблицах с клавиатуры.
 *
 * @remark [НЕ ДЛЯ WI]
 * @private
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _columns: IColumnRes[] = Editing.getEditingColumns().map((c) => {
        return { ...c, template: EditingCellTmpl };
    });

    private _longStart: boolean = false;
    private _longEnd: boolean = false;

    private _multiSelectVisibility: 'visible' | 'hidden' | 'onhover' = 'hidden';
    private _selectedKeys: string[] = [];

    private _isCellEditingMode: boolean = false;
    private _editingConfig: {
        editOnClick: boolean;
        mode?: string;
    };

    protected _beforeMount(): void {
        this._editingConfig = { editOnClick: true };
        this._setEditingMode('row');
    }

    private _beforeBeginEdit(e, options, isAdd, columnIndex): Promise<void | editing> {
        return (
            !this._longStart
                ? Promise.resolve()
                : new Promise((resolve) => {
                      // eslint-disable-next-line no-magic-numbers
                      setTimeout(resolve, 1000);
                  })
        ).then(() => {
            if (
                this._isCellEditingMode &&
                (columnIndex === 0 ||
                    columnIndex === 3 ||
                    (columnIndex === 1 && options.item.get('key') === 4))
            ) {
                return editing.CANCEL;
            }
        });
    }

    private _beforeEndEdit(): Promise<void> | void {
        return !this._longEnd
            ? Promise.resolve()
            : new Promise((resolve) => {
                  // eslint-disable-next-line no-magic-numbers
                  setTimeout(resolve, 1000);
              });
    }

    _toggleMultiSelectVisibility(e: Event, visibility: string): void {
        this._multiSelectVisibility = visibility;
    }

    _isCellEditingModeChanged(e: Event, val: boolean): void {
        this._isCellEditingMode = val;
        this._setEditingMode(this._isCellEditingMode ? 'cell' : 'row');
    }

    _setEditingMode(mode: 'row' | 'cell'): void {
        this._editingConfig = {
            ...this._editingConfig,
            mode,
        };
    }

    _onToggleSequentialEditingMode(e: Event, mode: string): void {
        this._setSequentialEditingMode(mode);
    }

    _setSequentialEditingMode(mode: string): void {
        if (mode) {
            this._editingConfig = {
                ...this._editingConfig,
                sequentialEditingMode: mode,
            };
        } else {
            delete this._editingConfig.sequentialEditingMode;
            this._editingConfig = { ...this._editingConfig };
        }
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    }
}
