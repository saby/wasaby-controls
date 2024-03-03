import { Component, ComponentType, LegacyRef } from 'react';
import LoadingIndicator, {
    ContextProvider as LoadingContextProvider,
} from 'Controls/LoadingIndicator';
import { IApplicationProps } from './Interfaces';
import { EventSubscriber, withWasabyEventObject } from 'UI/Events';

interface IHandlers {
    showIndicator: (...args: any[]) => void;
    hideIndicator: (...args: any[]) => void;
}
interface IComponentState extends IHandlers {}

export default function withLoadingContextProvider<T extends IApplicationProps = IApplicationProps>(
    WrappedComponent: ComponentType<T>
) {
    return class extends Component<T, IComponentState> {
        private _loadingIndicatorRef: LegacyRef<LoadingIndicator>;
        constructor(props: T) {
            super(props);

            this.state = {
                showIndicator: () => {},
                hideIndicator: () => {},
            };
            // todo индикатор
            this._loadingIndicatorRef = (loadingIndicator: LoadingIndicator) => {
                if (loadingIndicator) {
                    this.setState({
                        showIndicator: loadingIndicator._showHandler.bind(loadingIndicator),
                        hideIndicator: loadingIndicator._hideHandler.bind(loadingIndicator),
                    });
                }
            };
        }
        render() {
            const indicators: IHandlers = {
                showIndicator: () => {},
                hideIndicator: () => {},
            };
            const handlers = {
                onShowIndicator: () => {},
                onHideIndicator: () => {},
            };
            if (this.state.showIndicator) {
                indicators.showIndicator = withWasabyEventObject(this.state.showIndicator);
                handlers.onShowIndicator = withWasabyEventObject(this.state.showIndicator);
            }
            if (this.state.hideIndicator) {
                indicators.hideIndicator = withWasabyEventObject(this.state.hideIndicator);
                handlers.onHideIndicator = withWasabyEventObject(this.state.hideIndicator);
            }
            return (
                <LoadingContextProvider {...indicators}>
                    {/*<EventSubscriber {...handlers}>*/}
                    <WrappedComponent
                        {...this.props}
                        loadingIndicator={() => {
                            return (
                                <LoadingIndicator
                                    ref={this._loadingIndicatorRef}
                                    mainIndicator={true}
                                    isGlobal={true}
                                >
                                    <div></div>
                                </LoadingIndicator>
                            );
                        }}
                        /*кастомные обработчики*/
                        {...indicators}
                    />
                    {/*</EventSubscriber>*/}
                </LoadingContextProvider>
            );
        }
        static displayName = 'withLoadingContextProvider';
    };
}
