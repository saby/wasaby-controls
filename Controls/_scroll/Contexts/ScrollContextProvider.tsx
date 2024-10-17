import * as React from 'react';
import { ScrollContext } from './ScrollContext';

interface IScrollContextProps {
    pagingVisible?: boolean;
    children: JSX.Element;
}

interface IScrollContextState {
    pagingVisible: boolean;
    setPagingVisible: (pagingVisible: boolean) => void;
}

export default class ControllerContextProvider extends React.Component<
    IScrollContextProps,
    IScrollContextState
> {
    constructor(props: IScrollContextProps) {
        super(props);

        this.state = {
            pagingVisible: props.pagingVisible,
            setPagingVisible: (pagingVisible) => {
                this.setState({ pagingVisible });
            },
        };
    }

    componentDidUpdate(prevProps: Readonly<IScrollContextProps>): void {
        if (this.props.pagingVisible !== prevProps.pagingVisible) {
            this.state.setPagingVisible(this.props.pagingVisible);
        }
    }

    render(): React.ReactElement {
        return (
            <ScrollContext.Provider value={this.state}>
                {React.cloneElement(this.props.children, {
                    ...this.props,
                    children: this.props.children.props.children,
                })}
            </ScrollContext.Provider>
        );
    }
}
