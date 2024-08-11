import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';
import * as Template from 'wml!Controls-demo/list_new/VirtualScroll/NavigationSwitcher/NavigationSwitcher';
import {
    INavigationOptionValue,
    INavigationSourceConfig,
    TNavigationDirection,
    TNavigationPagingMode,
} from 'Controls/interface';
import { SyntheticEvent } from 'Vdom/Vdom';

export interface INavigationSwitcherOptions extends IControlOptions {
    content?: TemplateFunction;
    pageSize?: number;
    page?: number;
    totalCount: number;
    direction?: TNavigationDirection;
    pagingMode?: TNavigationPagingMode;
    multiNavigation?: boolean;
    _dataOptionsValue: IContextOptionsValue;
    storeId: string;
}

class Demo extends Control<INavigationSwitcherOptions> {
    protected _template: TemplateFunction = Template;
    protected _navigation: INavigationOptionValue<INavigationSourceConfig> = null;

    _beforeMount(newOptions: INavigationSwitcherOptions): void {
        // Если демка работает через слайс, то её начальное состояние должно
        // устанавливаться только на слайсе. Код ниже только для старой схемы,
        // чтобы установить начальное значение навигации в опции.
        this._navigation = this.getNavigation({
            direction: newOptions.direction,
            pageSize: newOptions.pageSize,
            page: newOptions.page,
            totalCount: newOptions.totalCount,
            pagingMode: newOptions.pagingMode,
            multiNavigation: newOptions.multiNavigation,
        });
    }

    protected _switchNavigation(e: SyntheticEvent, pageSize?: number): void {
        this._navigation = this.getNavigation({
            pageSize,
            totalCount: this._options.totalCount,
        });
        if (this._options.storeId) {
            this.setNavigation(this._navigation, this._options);
        }
    }

    private setNavigation(
        navigation: INavigationOptionValue<INavigationSourceConfig>,
        options: INavigationSwitcherOptions
    ): void {
        options._dataOptionsValue[options.storeId].setState({
            navigation,
        });
    }

    private getNavigation(cfg: {
        pageSize?: INavigationSwitcherOptions['pageSize'];
        direction?: INavigationSwitcherOptions['direction'];
        page?: INavigationSwitcherOptions['page'];
        totalCount: INavigationSwitcherOptions['totalCount'];
        pagingMode?: INavigationSwitcherOptions['pagingMode'];
        multiNavigation?: INavigationSwitcherOptions['multiNavigation'];
    }): INavigationOptionValue<INavigationSourceConfig> {
        // eslint-disable-next-line
        const pageSize = cfg.pageSize || this._options.pageSize || 100;

        return {
            source: 'page',
            view: 'infinity',
            sourceConfig: {
                direction: cfg.direction || this._options.direction || undefined,
                multiNavigation: cfg.multiNavigation || this._options.multiNavigation || undefined,
                pageSize,
                page: this._calcPage(cfg.page || this._options.page || 0, pageSize, cfg.totalCount),
                hasMore: false,
            },
            viewConfig: {
                pagingMode: cfg.pagingMode || 'hidden',
            },
        };
    }

    private _calcPage(page: number, pageSize: number, totalCount: number): number {
        if (page === 0 || page * pageSize <= totalCount) {
            return page;
        } else {
            return Math.ceil(totalCount / pageSize);
        }
    }
}

export default connectToDataContext(Demo);
