import { Component, ComponentType } from 'react';
import { ScrollContextProvider } from 'Controls/scroll';
import { IApplicationProps } from './Interfaces';

export default function withScrollContextProvider<T extends IApplicationProps = IApplicationProps>(
    WrappedComponent: ComponentType<T>
) {
    return class extends Component<T> {
        render() {
            return (
                <ScrollContextProvider pagingVisible={this.props.pagingVisible}>
                    <WrappedComponent {...this.props} />
                </ScrollContextProvider>
            );
        }
        static displayName = 'withScrollContextProvider';
    };
}
