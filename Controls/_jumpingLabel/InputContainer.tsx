/**
 * @kaizen_zone 7dd3138c-f6ab-4bda-9286-9be5b08d2ae4
 */
import * as React from 'react';
import Base, { IBaseOptions } from './Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import { TInternalProps } from 'UICore/Executor';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { withWasabyEventObject } from 'UICore/Events';

export interface IInputContainerOptions extends IBaseOptions {
    value: null | string;
}

interface IReactInputContainerOptions extends IInputContainerOptions, TInternalProps {
    onValueChanged?: Function;
}

/**
 * Контрол, отображающий подсказку рядом с полем ввода. Если в поле ввода нет данных, подсказка отображается как placeholder.
 * <b>Важно:</b> При использовании прыгающей метки опцию value нужно задавать не на полях ввода, а на самой метке.
 * @remark
 * Используется с контролами, поддерживающими интерфейс {@link Controls/input:IValue}.
 *
 * Полезные ссылки
 * * {@link /materials/DemoStand/app/Controls-demo%2FJumpingLabel%2FStandard%2FIndex демо-пример}
 * * {@link /doc/platform/developmentapl/interface-development/controls/input-elements/input/label/#jump руководство разработчика}
 * * {@link http://axure.tensor.ru/StandardsV8/%D0%BF%D0%BE%D0%BB%D1%8F_%D0%B2%D0%B2%D0%BE%D0%B4%D0%B0.html Стандарт}
 *
 * @class Controls/_jumpingLabel/InputContainer
 * @extends Controls/jumpingLabel:Abstract
 * @exclude Base
 *
 * @public
 * @demo Controls-demo/JumpingLabel/Base/Index
 *
 */
class InputContainer extends Base<IReactInputContainerOptions> {
    constructor(props: IReactInputContainerOptions) {
        super(props);
    }

    protected _setShowFromAbove(options: IInputContainerOptions): object {
        return {
            _showFromAbove:
                options.value !== null && options.value !== undefined && options.value !== '',
        };
    }

    private _valueChangedHandler(event: SyntheticEvent, inputValue: any): void {
        this.setState({
            _showFromAbove: Boolean(inputValue),
        });
        if (this.props.onValueChanged) {
            this.props.onValueChanged(event, inputValue);
        }
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
            placeholderVisibility: 'empty',
            placeholder: this._getPlaceholder(),
        };
        const mainProps = {
            context: this.context,
            className: 'controls-JumpingLabel__content',
            onValueChanged: withWasabyEventObject(this._valueChangedHandler.bind(this)),
            customEvents: ['onValueChanged']
        };
        if (this.props.onValueChanged !== undefined) {
            contentProps.value = this.props.value;
        }
        const reactProps: any = {...contentProps, ...mainProps};
        if (!this.props.content.isWasabyTemplate && this.props.content.props) {
            reactProps.props = {...(this.props.content.props?.props || {}), ...reactProps};
        }
        return (
            <div
                {...attrs}
                ref={this.props.$wasabyRef}
                className={`controls-JumpingLabel ${attrs.className || this.props.className}`}
            >
                <div className="ws-flexbox ws-flex-column">
                    <div className="controls-JumpingLabel__wrapper">
                        <div
                            className={`controls-JumpingLabel__value controls-JumpingLabel__value_${
                                this.state._fontColorStyle
                            }
               ${this.state._showFromAbove ? '' : 'ws-invisible'}`}
                        >
                            {this.props.caption}
                        </div>
                        {this.props.required ? (
                            <div
                                className={
                                    'controls-JumpingLabel__asterisk ' +
                                    `${this.state._showFromAbove ? '' : 'ws-invisible'}`
                                }
                            >
                                &nbsp;*
                            </div>
                        ) : null}
                    </div>
                    {
                        this.props.content.isWasabyTemplate ? <this.props.content {...contentProps} {...mainProps}/> :
                            React.cloneElement(this.props.content, reactProps)
                    }
                </div>
            </div>
        );
    }
}

export default InputContainer;
