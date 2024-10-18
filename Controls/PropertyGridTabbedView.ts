/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_PropertyGridTabbedView/PropertyGridTabbedView';

import { Memory } from 'Types/source';

import { default as IPropertyTabbedViewOptions } from 'Controls/_PropertyGridTabbedView/interface/IPropertyGridTabbedView';

import TabsController, {
    ISwitchableAreaItem,
} from 'Controls/_PropertyGridTabbedView/TabsController';

/**
 * Контрол, который позволяет пользователям просматривать и редактировать свойства объекта с возможностью группировки по вкладкам
 * @public
 * @implements Controls/_PropertyGridTabbedView/interface/IPropertyGridTabbedView
 * @demo Controls-demo/PropertyGridNew/TabbedView/Index
 * @extends UI/Base:Control
 */
export default class PropertyGridTabbedView extends Control<IPropertyTabbedViewOptions> {
    protected _template: TemplateFunction = template;

    private _tabsController: TabsController;

    protected _tabsSource: Memory;
    protected _switchableAreaItems: ISwitchableAreaItem[];

    protected _selectedKey: string;

    protected _beforeMount(options: IPropertyTabbedViewOptions): void {
        this._tabsController = new TabsController(options);
        this._applyNewStateFromController();
    }

    protected _beforeUpdate(options: IPropertyTabbedViewOptions): void {
        if (this._tabsController.updateOptions(options)) {
            this._applyNewStateFromController();
        }
    }

    protected _applyNewStateFromController(): void {
        this._tabsSource = this._tabsController.getTabsSource();
        this._switchableAreaItems = this._tabsController.getSwitchableAreaItems();

        this._selectedKey = this._switchableAreaItems[0].key;
    }

    protected _handleObjectChange(_: Event, obj: object): void {
        this._notify('editingObjectChanged', [obj]);
    }

    static getDefaultOptions(): Partial<IPropertyTabbedViewOptions> {
        return {
            tabProperty: 'tab',
        };
    }
}
