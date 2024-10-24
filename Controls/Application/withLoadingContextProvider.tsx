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
        private _showHandlerContext: Function;
        private _hideHandlerContext: Function;
        constructor(props: T) {
            super(props);

            // todo индикатор
            this._loadingIndicatorRef = (loadingIndicator: LoadingIndicator) => {
                if (loadingIndicator) {
                    this._showHandler = loadingIndicator._showHandler.bind(loadingIndicator);
                    this._hideHandler = loadingIndicator._hideHandler.bind(loadingIndicator);
                    this._showHandlerContext = loadingIndicator.show.bind(loadingIndicator);
                    this._hideHandlerContext = loadingIndicator.hide.bind(loadingIndicator);
                }
            };
            this.showIndicator = withWasabyEventObject(this.showIndicator.bind(this));
            this.hideIndicator = withWasabyEventObject(this.hideIndicator.bind(this));
            this.showIndicatorContext = this.showIndicatorContext.bind(this);
            this.hideIndicatorContext = this.hideIndicatorContext.bind(this);
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

        showIndicatorContext(...args: any[]) {
            return this._showHandlerContext?.(...args);
        }
        hideIndicatorContext(...args: any[]) {
            return this._hideHandlerContext?.(...args);
        }
        render() {
            return (
                <LoadingContextProvider
                    showIndicator={this.showIndicatorContext}
                    hideIndicator={this.hideIndicatorContext}
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
