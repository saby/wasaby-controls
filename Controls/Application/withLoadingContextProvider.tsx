import { Component, ComponentType, LegacyRef } from 'react';
import LoadingIndicator, {
    ContextProvider as LoadingContextProvider,
} from 'Controls/LoadingIndicator';
import { IApplicationProps } from './Interfaces';
import { withWasabyEventObject } from 'UI/Events';

export default function withLoadingContextProvider<T extends IApplicationProps = IApplicationProps>(
    WrappedComponent: ComponentType<T>
) {
    return class extends Component<T> {
        private _loadingIndicatorRef: LegacyRef<LoadingIndicator>;
        private _showHandler: Function;
        private _hideHandler: Function;
        constructor(props: T) {
            super(props);

            // todo индикатор
            this._loadingIndicatorRef = (loadingIndicator: LoadingIndicator) => {
                if (loadingIndicator) {
                    this._showHandler = loadingIndicator._showHandler.bind(loadingIndicator);
                    this._hideHandler = loadingIndicator._hideHandler.bind(loadingIndicator);
                }
            };
            this.showIndicator = withWasabyEventObject(this.showIndicator.bind(this));
            this.hideIndicator = withWasabyEventObject(this.hideIndicator.bind(this));
        }
        renderLoadingIndicator() {
            return (
                <LoadingIndicator
                    ref={this._loadingIndicatorRef}
                    mainIndicator={true}
                    isGlobal={true}
                >
                    <div></div>
                </LoadingIndicator>
            );
        }
        showIndicator(...args: any[]) {
            return this._showHandler?.(...args);
        }
        hideIndicator(...args: any[]) {
            return this._hideHandler?.(...args);
        }
        render() {
            return (
                <LoadingContextProvider
                    showIndicator={this.showIndicator}
                    hideIndicator={this.hideIndicator}
                >
                    <WrappedComponent
                        {...this.props}
                        loadingIndicator={this.renderLoadingIndicator.bind(this)}
                        /*кастомные обработчики*/
                        showIndicator={this.showIndicator}
                        hideIndicator={this.hideIndicator}
                    />
                </LoadingContextProvider>
            );
        }
        static displayName = 'withLoadingContextProvider';
    };
}
