import { Component, ComponentType } from 'react';
import { IApplicationProps } from './Interfaces';
import { detection } from 'Env/Env';

function isIOS13() {
    const oldIosVersion: number = 12;
    return detection.isMobileIOS && detection.IOSVersion > oldIosVersion;
}

export default function withWhiteSpaceOnRotationHack<
    T extends IApplicationProps = IApplicationProps
>(WrappedComponent: ComponentType<T>) {
    return class extends Component<T> {
        protected _prevOrientationChangeState: number = 0;
        protected _prevInnerHeight: number;

        componentDidMount() {
            if (isIOS13()) {
                window.visualViewport.addEventListener('resize', this._resizePage.bind(this));
                // Хак актуален только для телефона с Ios и мета тегом viewport
                if (this.props.isAdaptive) {
                    this._prevInnerHeight = window.innerHeight;
                    window.addEventListener(
                        'orientationchange',
                        this._orientationChange.bind(this)
                    );
                }
            }
            window.addEventListener('resize', this._resizePage.bind(this));
        }

        protected _resizePage(event: Event): void {
            this._prevInnerHeight =
                (event.target as VisualViewport).height || (event.target as Window).innerHeight;
        }
        /**
         * Решения взято отсюда
         * https://stackoverflow.com/questions/62717621/white-space-at-page-bottom-after-device-rotation-in-ios-safari
         * @protected
         */
        protected _orientationChange(event: Event): void {
            if (!event || !event.target) {
                return;
            }
            // @ts-ignore
            const currentOrientationState = event.target.orientation;
            // orientationChange на айпаде стреляет даже при сворачивании браузера, поэтому смотрим еще за размерами.
            if (
                // @ts-ignore
                event.target.innerHeight !== this._prevInnerHeight &&
                this._prevOrientationChangeState !== currentOrientationState
            ) {
                document.documentElement.style.height = 'initial';
                setTimeout(() => {
                    document.documentElement.style.height = '100%';
                }, 500);
                this._prevOrientationChangeState = currentOrientationState;
                // @ts-ignore
                this._prevInnerHeight = event.target.innerHeight;
            }
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
        static displayName = 'withWhiteSpaceOnRotationHack';
    };
}
