import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/DemoLayout/DemoLayout';

type TSidebarItems = { template: TemplateFunction }[];

interface ISidebarOptions {
    isExpanded?: boolean;
    items: TSidebarItems;
}

export interface IOptions extends IControlOptions {
    leftSidebar?: ISidebarOptions;
    rightSidebar?: ISidebarOptions;
}

export default class extends Control<IOptions> {
    protected _template: TemplateFunction = Template;

    private _isLeftSidebarOpened: boolean;
    private _isRightSidebarOpened: boolean;

    protected _beforeMount(newOptions: IOptions): void {
        this._isLeftSidebarOpened = !!newOptions.leftSidebar?.isExpanded;
        this._isRightSidebarOpened = !!newOptions.rightSidebar?.isExpanded;
    }

    private _getSidebarItems(side: 'left' | 'right'): [] | null {
        const items = this._options[`${side}Sidebar`]?.items;
        return items && items.length ? items : null;
    }

    private _toggleSidebar(_: unknown, side: 'left' | 'right'): void {
        if (side === 'left' && !!this._options.leftSidebar?.items?.length) {
            this._isLeftSidebarOpened = !this._isLeftSidebarOpened;
        } else if (
            side === 'right' &&
            !!this._options.rightSidebar?.items?.length
        ) {
            this._isRightSidebarOpened = !this._isRightSidebarOpened;
        }
    }

    static _styles: string[] = ['Controls-demo/gridNew/DemoLayout/DemoLayout'];
}
