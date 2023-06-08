/**
 * @kaizen_zone 7dd3138c-f6ab-4bda-9286-9be5b08d2ae4
 */
import * as React from 'react';
import Base, { IBaseOptions, IStateBase } from './Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import {
    IMultiSelectable,
    IMultiSelectableOptions,
    ISingleSelectable,
    ISingleSelectableOptions,
} from 'Controls/interface';
import { TInternalProps } from 'UICore/Executor';
import { createElement, wasabyAttrsToReactDom } from 'UICore/Jsx';
import { getArgs } from 'UICore/Events';

export interface ISelectionContainerOptions
    extends IBaseOptions,
        ISingleSelectableOptions,
        IMultiSelectableOptions {}

interface IReactSelectionContainerOptions
    extends ISelectionContainerOptions,
        TInternalProps {}

interface IStateSelectionContainer extends IStateBase {
    _hasKeys: boolean;
}

/**
 * Контрол, отображающий подсказку рядом со своим контентом. Если в контентной области нет данных, подсказка отображается как placeholder.
 * @remark
 * Используется с контролами, поддерживающими интерфейс {@link Controls/interface/IMultiSelectable IMultiSelectable}
 * Полезные ссылки
 * * {@link /materials/DemoStand/app/Controls-demo%2FJumpingLabel%2FStandard%2FIndex демо-пример}
 * * {@link http://axure.tensor.ru/StandardsV8/%D0%BF%D0%BE%D0%BB%D1%8F_%D0%B2%D0%B2%D0%BE%D0%B4%D0%B0.html Стандарт}
 *
 * @class Controls/_jumpingLabel/SelectionContainer
 * @extends Controls/jumpingLabel:Abstract
 * @exclude Base
 *
 * @public
 *
 */
class SelectionContainer
    extends Base<IReactSelectionContainerOptions>
    implements ISingleSelectable, IMultiSelectable
{
    state: IStateSelectionContainer;

    readonly '[Controls/_interface/IMultiSelectable]': boolean = true;
    readonly '[Controls/_interface/ISingleSelectable]': boolean = true;

    constructor(props: IReactSelectionContainerOptions) {
        super(props);
    }

    shouldComponentUpdate(options: ISelectionContainerOptions, state): boolean {
        const res = super.shouldComponentUpdate(options, state);
        if (
            options.selectedKey !== this.props.selectedKey ||
            options.selectedKeys !== this.props.selectedKeys
        ) {
            this.setState({
                _showFromAbove: Boolean(
                    options.selectedKey || options.selectedKeys?.length
                ),
            });
            return true;
        }
        return res;
    }

    protected _setShowFromAbove(options: ISelectionContainerOptions): object {
        if ('selectedKey' in options) {
            return {
                _showFromAbove:
                    options.selectedKey !== null &&
                    options.selectedKey !== undefined,
            };
        }
        if ('selectedKeys' in options) {
            return {
                _showFromAbove: Boolean(options.selectedKeys.length),
            };
        }
        return {
            _showFromAbove: false,
        };
    }

    private _valueChangedHandler(event: SyntheticEvent, value: string): void {
        const [_event, _value] = getArgs(event, value);
        if (!this.state._hasKeys) {
            this.setState({
                _showFromAbove: Boolean(_value),
            });
        }
    }

    private _selectedChangedHandler(event: SyntheticEvent, keys: any[]): void {
        const [_event, _keys] = getArgs(event, keys);
        let hasKeys: boolean = false;
        if (Array.isArray(_keys)) {
            hasKeys = Boolean(_keys.length && _keys[0] !== null);
        } else if (_keys !== null && _keys !== undefined) {
            hasKeys = true;
        }
        this.setState({
            _hasKeys: hasKeys,
            _showFromAbove: hasKeys,
        });
    }

    protected _getPlaceholder(): React.ReactNode {
        return (
            <div className="controls-JumpingLabel__placeholder-wrapper">
                <div className="controls-JumpingLabel__placeholder">
                    {this.props.caption}
                </div>
                {this.props.required ? (
                    <div className="controls-JumpingLabel__asterisk">
                        &nbsp;*
                    </div>
                ) : null}
            </div>
        );
    }

    render(): React.ReactNode {
        const attrs = this.props.attrs
            ? wasabyAttrsToReactDom(this.props.attrs) || {}
            : {};
        const contentProps = {
            borderVisibility: this.state._borderVisibility,
            horizontalPadding: this.state._horizontalPadding,
            validationStatus: this.state._validationStatus,
            placeholder: this._getPlaceholder(),
        };
        const contentEvents = {
            'on:valueChanged': [this._valueChangedHandler.bind(this)],
            'on:selectedKeyChanged': [this._selectedChangedHandler.bind(this)],
            'on:selectedKeysChanged': [this._selectedChangedHandler.bind(this)],
        };
        return (
            <div
                {...attrs}
                ref={this.props.$wasabyRef}
                className={`controls-JumpingLabel ${attrs.className}`}
            >
                <div className="controls-JumpingLabel__wrapper">
                    <div
                        className={`controls-JumpingLabel__value
               controls-JumpingLabel__value_${this.state._fontColorStyle}
               ${this.state._showFromAbove ? '' : 'ws-invisible'}`}
                    >
                        {this.props.caption}
                    </div>
                    {this.props.required ? (
                        <div
                            className={
                                'controls-JumpingLabel__asterisk' +
                                ` ${
                                    this.state._showFromAbove
                                        ? ''
                                        : 'ws-invisible'
                                }`
                            }
                        >
                            &nbsp;*
                        </div>
                    ) : null}
                </div>
                {createElement(
                    this.props.content,
                    contentProps,
                    { class: 'controls-JumpingLabel__content' },
                    contentEvents,
                    undefined,
                    this.context
                )}
            </div>
        );
    }
}

export default SelectionContainer;
