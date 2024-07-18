import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/EditInPlace/ViewTemplates/ViewTemplates';
import * as EditingCellTmpl from 'wml!Controls-demo/gridNew/EditInPlace/ViewTemplates/EditingCellTemplate';
import { IColumnRes } from 'Controls-demo/gridNew/DemoHelpers/DataCatalog';
import { Editing } from 'Controls-demo/gridNew/DemoHelpers/Data/Editing';
import { Memory } from 'Types/source';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Editing.getEditingData();
}

/**
 * Демо пример для автотестирования различных шаблонов в таблице с редактированием.
 *
 * @remark [НЕ ДЛЯ WI]
 * @private
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _useBackground: boolean = false;
    protected _inputBackgroundVisibility: 'visible' | 'onhover' = 'onhover';
    protected _highlightOnHover?: boolean;
    private _columns: IColumnRes[];

    protected _beforeMount(): void {
        this._setColumns();
    }

    protected _toggleInputBackgroundVisibility(
        e: SyntheticEvent,
        visibility: 'visible' | 'onhover'
    ): void {
        if (this._inputBackgroundVisibility !== visibility) {
            this._inputBackgroundVisibility = visibility;
            this._setColumns();
        }
    }

    protected _toggleUseBackground(): void {
        this._useBackground = !this._useBackground;
    }

    protected _toggleHighlightOnHover(e: Event, value: boolean): void {
        if (this._highlightOnHover !== value) {
            this._highlightOnHover = value;
        }
    }

    protected _setColumns(params: object = {}): void {
        this._columns = Editing.getEditingColumns().map((column) => {
            return {
                ...column,
                template: EditingCellTmpl,
                inputBackgroundVisibility: this._inputBackgroundVisibility,
                ...params,
            };
        });
    }

    static _styles: string[] = ['DemoStand/Controls-demo'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EditInPlaceViewTemplates: {
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
