/**
 * @kaizen_zone 7932f75e-2ad3-49ad-b51a-724eb5c140eb
 */
import { TemplateFunction } from 'UI/Base';
import * as React from 'react';
import { default as WorkByKeyboardContext } from 'Controls/WorkByKeyboard/Context';
import { default as FormConsumer } from 'Controls/WorkByKeyboard/Consumer';
import { IControlProps } from 'Controls/interface';

interface IFormContextProviderOptions extends IControlProps {
    status?: boolean;
    content: TemplateFunction;
}

interface IFormContextProviderState {
    workByKeyboard: {
        status: boolean;
        setStatus: (status: boolean) => void;
    };
}

/**
 * Контрол-обертка для связи управления с клавиатуры и подсветки контролов, на который приходит фокус.
 * @implements Controls/interface:IControl
 * @public
 */
export default class FormContextProvider extends React.Component<
    IFormContextProviderOptions,
    IFormContextProviderState
> {
    constructor(props: IFormContextProviderOptions) {
        super(props);

        this.state = {
            workByKeyboard: {
                status: props.status || false,
                setStatus: (status) => {
                    this.setState((state) => {
                        const newState = { ...state };
                        newState.workByKeyboard.status = status;
                        return newState;
                    });
                },
            },
        };
    }

    componentDidUpdate(prevProps: Readonly<IFormContextProviderOptions>): void {
        if (this.props.status !== prevProps.status) {
            this.setState((state) => {
                const newState = { ...state };
                newState.workByKeyboard.status = this.props.status;
                return newState;
            });
        }
    }

    render(): React.ReactElement {
        return (
            <WorkByKeyboardContext.Provider value={this.state}>
                <FormConsumer {...this.props} content={this.props.content} />
            </WorkByKeyboardContext.Provider>
        );
    }
}
