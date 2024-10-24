/**
 * @kaizen_zone 7dd3138c-f6ab-4bda-9286-9be5b08d2ae4
 */
import * as React from 'react';
import Base, { IBaseOptions, IStateBase } from './Base';
import {
    IMultiSelectable,
    IMultiSelectableOptions,
    ISingleSelectable,
    ISingleSelectableOptions,
} from 'Controls/interface';
import { TInternalProps } from 'UICore/Executor';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';

export interface ISelectionContainerOptions
    extends IBaseOptions,
        ISingleSelectableOptions,
        IMultiSelectableOptions {}

interface IReactSelectionContainerOptions extends ISelectionContainerOptions, TInternalProps {}

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
                _showFromAbove: Boolean(options.selectedKey || options.selectedKeys?.length),
            });
            return true;
        }
        return res;
    }

    protected _setShowFromAbove(options: ISelectionContainerOptions): object {
        if ('selectedKey' in options) {
            return {
                _showFromAbove: options.selectedKey !== null && options.selectedKey !== undefined,
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

    private _valueChangedHandler(value: string): void {
        if (!this.state._hasKeys) {
            this.setState({
                _showFromAbove: Boolean(value),
            });
        }
    }

    private _onSelectedKeyChanged(keys: any): void {
        this._selectedChangedHandler(keys);
        this.props.onSelectedKeyChanged?.(keys);
    }

    private _onSelectedKeysChanged(keys: any[]): void {
        this._selectedChangedHandler(keys);
        this.props.onSelectedKeysChanged?.(keys);
    }

    private _selectedChangedHandler(keys: any[]): void {
        let hasKeys: boolean = false;
        if (Array.isArray(keys)) {
            hasKeys = Boolean(keys.length && keys[0] !== null);
        } else if (keys !== null && keys !== undefined) {
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
                <div className="controls-JumpingLabel__placeholder">{this.props.caption}</div>
                {this.props.required ? (
                    <div className="controls-JumpingLabel__asterisk">&nbsp;*</div>
                ) : null}
            </div>
        );
    }

    render(): React.ReactNode {
        const attrs = this.props.attrs ? wasabyAttrsToReactDom(this.props.attrs) || {} : {};
        const contentProps = {
            borderVisibility: this.state._borderVisibility,
            horizontalPadding: this.state._horizontalPadding,
            validationStatus: this.state._validationStatus,
            placeholder: this._getPlaceholder(),
        };
        const mainProps = {
            context: this.context,
            className: 'controls-JumpingLabel__content',
            onValueChanged: this._valueChangedHandler.bind(this),
            onSelectedKeyChanged: this._onSelectedKeyChanged.bind(this),
            onSelectedKeysChanged: this._onSelectedKeysChanged.bind(this),
            customEvents: ['onValueChanged', 'onSelectedKeyChanged', 'onSelectedKeysChanged'],
        };
        return (
            <div
                {...attrs}
                ref={this.props.$wasabyRef}
                className={`controls-JumpingLabel ${attrs.className || this.props.className}`}
            >
                <div className="controls-JumpingLabel__wrapper">
                    <div
                        className={`controls-JumpingLabel__value
               ${
                   this.state._fontColorStyle === 'valid' && this.props.fontColorStyle
                       ? `controls-text-${this.props.fontColorStyle}`
                       : `controls-JumpingLabel__value_${this.state._fontColorStyle}`
               }
               ${this.state._showFromAbove ? '' : 'ws-invisible'}`}
                    >
                        {this.props.caption}
                    </div>
                    {this.props.required ? (
                        <div
                            className={
                                'controls-JumpingLabel__asterisk' +
                                ` ${this.state._showFromAbove ? '' : 'ws-invisible'}`
                            }
                        >
                            &nbsp;*
                        </div>
                    ) : null}
                </div>
                {React.cloneElement(this.props.children || this.props.content, {
                    ...contentProps,
                    ...mainProps,
                })}
            </div>
        );
    }
}

export default SelectionContainer;
