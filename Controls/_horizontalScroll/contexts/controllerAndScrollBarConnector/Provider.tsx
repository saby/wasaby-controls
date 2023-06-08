/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { TemplateFunction } from 'UI/Base';
import { Context } from './Context';
import ScrollBar from '../../scrollBar/ScrollBar';
import { Controller } from '../../Controller';

export interface IProps extends TInternalProps {
    doScrollUtil: (position: number) => void;
    controller: Controller;
    contentWidth: number;
    viewportWidth: number;
    fixedColumnsWidth: number;

    content: TemplateFunction;
}
interface IState {
    contentWidth: number;
    viewportWidth: number;
    fixedColumnsWidth: number;

    scrollPositionChangedCallback: (position: number) => void;
    scrollBarReadyCallback: (scrollBar: ScrollBar) => void;
}

export default class Provider extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            scrollPositionChangedCallback: (position: number) => {
                props.doScrollUtil(position);
            },
            scrollBarReadyCallback: (scrollBar: ScrollBar) => {
                props.controller.setScrollBar(scrollBar);
            },
            contentWidth: props.contentWidth,
            viewportWidth: props.viewportWidth,
            fixedColumnsWidth: props.fixedColumnsWidth,
        };
    }

    setOptions(options: Partial<IProps>): void {
        const changedOptions = {};
        ['contentWidth', 'viewportWidth', 'fixedColumnsWidth'].forEach(
            (optionName) => {
                if (
                    optionName in options &&
                    options[optionName] !== this[optionName]
                ) {
                    changedOptions[optionName] = options[optionName];
                    this[optionName] = options[optionName];
                }
            }
        );
        if (Object.keys(changedOptions).length) {
            this.setState(changedOptions);
        }
    }
    componentDidUpdate(): void {
        this.setOptions(this.props);
    }
    // используем Provider контекста для передачи данных в контекст
    render(): React.ReactElement {
        return (
            <Context.Provider value={this.state}>
                <this.props.content
                    ref={this.props.forwardedRef}
                    attrs={this.props.attrs}
                />
            </Context.Provider>
        );
    }
}
