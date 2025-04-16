/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { default as IPropertyGridTabbedViewOptions } from './interface/IPropertyGridTabbedView';
import { IPropertyGridOptions, IPropertyGridProperty } from 'Controls/propertyGrid';

import { Memory } from 'Types/source';

export interface ISwitchableAreaItem {
    key: string;
    templateOptions: Partial<IPropertyGridOptions>;
}

export default class TabsController {
    private _tabsSource: Memory;
    private _switchableAreaItems: ISwitchableAreaItem[];

    constructor(private _options: Partial<IPropertyGridTabbedViewOptions>) {
        this._saveTabsConfig(_options);
    }

    updateOptions(options: Partial<IPropertyGridTabbedViewOptions>): boolean | void {
        let isChanged = false;

        if (
            this._options.source !== options.source ||
            this._options.tabProperty !== options.tabProperty
        ) {
            this._saveTabsConfig(options);

            isChanged = true;
        }

        this._options = options;

        return isChanged;
    }

    getTabsSource(): Memory {
        return this._tabsSource;
    }

    getSwitchableAreaItems(): ISwitchableAreaItem[] {
        return this._switchableAreaItems;
    }

    private _saveTabsConfig(options: Partial<IPropertyGridTabbedViewOptions>): void {
        const tabs: Record<string, IPropertyGridProperty[]> = {};
        const tabProperty = options.tabProperty;

        options.source.forEach((item) => {
            tabs[item[tabProperty]] = [...(tabs[item[tabProperty]] || []), item];
        });

        const tabsSource = new Memory({
            data: Object.keys(tabs).map((item) => {
                return {
                    key: item,
                    title: item,
                    align: 'left',
                };
            }),
            keyProperty: 'key',
        });

        const switchableAreaItems: ISwitchableAreaItem[] = Object.entries(tabs).map(
            ([key, source]) => {
                return {
                    key,
                    templateOptions: {
                        source,
                    },
                };
            }
        );

        this._tabsSource = tabsSource;
        this._switchableAreaItems = switchableAreaItems;
    }
}
