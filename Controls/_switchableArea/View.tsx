/**
 * @kaizen_zone 6b2f7c09-87a5-4183-bd7c-59117d2711bc
 */
import { TemplateFunction } from 'UI/Base';
import ViewModel from './ViewModel';
import defaultItemTemplate from './ItemTpl';
import { factory } from 'Types/chain';
import { Logger } from 'UI/Utils';
import { IControlProps, TKey } from 'Controls/interface';
import * as React from 'react';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { TInternalProps } from 'UICore/Executor';
import { default as LoadingIndicator } from 'Controls/LoadingIndicator';
import { default as ItemTemplate } from './ItemTemplate';
import { isEqual } from 'Types/object';
import { EventSubscriber, SyntheticEvent } from 'UI/Events';
import { Container as ValidateContainer } from 'Controls/validate';

export interface ISwitchableOptions extends TInternalProps, IControlProps {
    itemTemplate?: TemplateFunction;
    selectedKey?: string | number;
    items?: ISwitchableAreaItem[];
    _dataOptionsValue?: Record<TKey, unknown>;
    loadingIndicatorOverlay?: string;
    showAllItems?: boolean;
}

export interface ISwitchableAreaItemProps {
    selected?: boolean;
    dataOptions?: Record<TKey, unknown>;
}

export interface ISwitchableAreaItem {
    key: string | number;
    itemTemplate?: TemplateFunction | React.ReactElement<ISwitchableAreaItemProps>;
    templateOptions?: object;
    loaded?: boolean;
}

interface ISwitchableAreaState {
    indicatorVisible: boolean;
}

export function correctSelectedKey(options: ISwitchableOptions, _this?: unknown): TKey {
    let selectedKey;
    factory(options.items).each((item) => {
        if (item.get) {
            if (options.selectedKey === item.get('key')) {
                selectedKey = options.selectedKey;
            }
        } else {
            if (options.selectedKey === item.key) {
                selectedKey = options.selectedKey;
            }
        }
    });

    if (selectedKey === undefined) {
        Logger.error('SwitchableArea: Incorrect selectedKey', _this);
        if (options.items instanceof Array) {
            selectedKey = options.items[0].key;
        } else {
            selectedKey = options.items.at(0).get('key');
        }
    }

    return selectedKey;
}

/**
 * Контрол для переключения контентных областей.
 * @class Controls/_switchableArea/View
 *
 * @implements Controls/interface:IControl
 * @public
 * @demo Controls-demo/SwitchableArea/DemoSwitchableArea
 */
export default class View extends React.Component<ISwitchableOptions, ISwitchableAreaState> {
    protected _viewModel: ViewModel;
    protected _selectedKey: TKey;
    protected _validateEventCb: Record<
        TKey,
        (_: SyntheticEvent, validateContainer: ValidateContainer) => void
    > = {};

    constructor(props: ISwitchableOptions) {
        super(props);
        const selectedKey = this._correctSelectedKey(props);
        this._selectedKey = selectedKey;
        const state: ISwitchableAreaState = {
            indicatorVisible: false,
        };
        this.state = state;
        this._viewModel = new ViewModel(props.items, selectedKey, props.showAllItems);
        this._setValidateEventCb(props.items);
    }

    protected _correctSelectedKey(options: ISwitchableOptions) {
        const selectedKey = correctSelectedKey(options, this);
        if (this._viewModel) {
            this.setState({
                indicatorVisible: !this._viewModel.getVisibilityStatus(selectedKey),
            });
        }
        return selectedKey;
    }

    shouldComponentUpdate(options: ISwitchableOptions, state?: ISwitchableAreaState): boolean {
        if (this.props !== options || !isEqual(this.state, state)) {
            if (this.props.items !== options.items) {
                this._viewModel.updateItems(options.items, options.showAllItems);
                this._setValidateEventCb(options.items);
            }
            if (this.props.selectedKey !== options.selectedKey) {
                this._selectedKey = this._correctSelectedKey(options);
                this._viewModel.updateSelectedKey(options.selectedKey);
            }
            return true;
        }
        return false;
    }

    protected _setValidateEventCb(items?: ISwitchableAreaItem[]) {
        if (items) {
            items.forEach((item) => {
                if(!this._validateEventCb[item.key]) {
                    this._validateEventCb[item.key] = (_, validateContainer: ValidateContainer) => {
                        validateContainer.setAreaKey?.(item.key);
                    };
                }
            });
        }
    }

    protected onAfterMount(item): void {
        this.setState({ indicatorVisible: false });
        this._viewModel.updateVisibilityStatus(item.key);
    }

    render(): React.ReactElement {
        const getAttrClass = () => {
            if (this.props.attrs?.className) {
                return this.props.attrs.className;
            } else if (this.props.className) {
                return this.props.className;
            }
        };
        const attrs = wasabyAttrsToReactDom(this.props.attrs) || {};

        const content = (
            <>
                {this.props.items.map((item, index) => {
                    if (this._viewModel && this._viewModel.getItems()[index].loaded) {
                        return (
                            <EventSubscriber
                                key={'provider_' + item.key}
                                onValidateCreated={this._validateEventCb[item.key]}
                            >
                                <ItemTemplate
                                    currentItemKey={item.key}
                                    className={
                                        this._selectedKey !== item.key && !this.props.showAllItems
                                            ? 'ws-hidden'
                                            : ''
                                    }
                                    key={item.key}
                                    dataOptions={this.props._dataOptionsValue}
                                    autofocus={item.autofocus}
                                    itemTemplate={item.itemTemplate}
                                    selectedKey={this.props.selectedKey || this._selectedKey}
                                    onAfterMount={this.onAfterMount.bind(
                                        this,
                                        this._viewModel.getItems()[index]
                                    )}
                                    templateOptions={item.templateOptions}
                                    content={this.props.itemTemplate}
                                    context={this.props.context}
                                />
                            </EventSubscriber>
                        );
                    }
                    return null;
                })}
            </>
        );
        return (
            <LoadingIndicator
                {...attrs}
                attrs={attrs}
                className={'controls-SwitchableArea ws-flex-grow-1 ' + getAttrClass()}
                isGlobal={false}
                small={false}
                forwardedRef={this.props.forwardedRef}
                overlay={this.props.loadingIndicatorOverlay}
                visible={this.state.indicatorVisible}
                content={content}
            />
        );
    }

    static defaultProps: Partial<ISwitchableOptions> = {
        loadingIndicatorOverlay: 'dark',
        itemTemplate: defaultItemTemplate,
    };
}

/**
 * @typedef {Object} SwitchableAreaItem
 * @property {String|Number} key Ключ элемента.
 * @property {Function} itemTemplate Шаблон элемента (контентной области).
 *
 * Шаблон, который указан в настройках этого свойства, нужно предварительно импортировать в родительский контрол.
 * Т.к. загрузка шаблонов происходит синхронно, то длительность инициализации контрола может быть увеличена.
 *
 * Чтобы инициализация контрола происходила быстрее, шаблоны можно подгружать по необходимости, т.е. только при переключении на шаблон.
 * Для этого в конфигурации свойства **itemTemplate** рекомендуется использовать контрол-контейнер {@link Controls/Container/Async}.
 * Он позволяет реализовать отложенную загрузку шаблонов для {@link Controls/switchableArea:View}.
 * Это поведение показано в <a href="/materials/DemoStand/app/Controls-demo%2FSwitchableArea%2FDemoSwitchableArea">демо-примере</a>.
 * Подробнее об использовании Controls/Container/Async можно прочитать <a href="/doc/platform/developmentapl/interface-development/pattern-and-practice/async-load/">здесь</a>.
 * @property {Object} templateOptions Опции, передаваемые в itemTemplate.
 * @property {Boolean} [autofocus=true] Определяет, установится ли фокус на контентную область.
 * @property {Boolean} [loaded=false] Определяет, необходимость отрисовки вкладки при построении контрола. Если item.key не совпадает с selectedKey, то вкладка отрисуется, но будет не видна для пользователя.
 */

/**
 * @name Controls/_switchableArea/View#items
 * @cfg {Array.<SwitchableAreaItem>} Данные элементов.
 */

/**
 * @name Controls/_switchableArea/View#selectedKey
 * @cfg {String} Ключ выбранного элемента.
 */

/**
 * @name Controls/_switchableArea/View#showAllItems
 * @cfg {Boolean} Определяет необходимость отображения всех элементов
 * @default false
 */

/**
 * @name Controls/_switchableArea/View#itemTemplate
 * @cfg {Function} Шаблон отображения элемента.
 */
