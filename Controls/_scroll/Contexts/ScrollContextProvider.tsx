import { TemplateFunction } from 'UI/Base';
import * as React from 'react';
import { ScrollContext } from './ScrollContext';

interface IScrollContextProps {
    pagingVisible?: boolean;
    content: TemplateFunction;
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
                <this.props.content {...this.props} />
            </ScrollContext.Provider>
        );
    }
}
