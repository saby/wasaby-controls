import { Component, ComponentType } from 'react';
import {
    ContextProvider as PendingContextProvider,
    IPendingConfig,
    PendingClass,
} from 'Controls/Pending';
import { IApplicationProps } from './Interfaces';
import { EventSubscriber, withWasabyEventObject } from 'UI/Events';
import { mergeHandlers } from 'Controls/Application/Utils';

export default function withPendingContextProvider<T extends IApplicationProps = IApplicationProps>(
    WrappedComponent: ComponentType<T>
) {
    return class extends Component<T> {
        private _pendingController: PendingClass;
        constructor(props: T) {
            super(props);

            const pendingOptions = {
                notifyHandler: () => {},
            };
            this._pendingController = new PendingClass(pendingOptions);

            this._registerPendingHandler = this._registerPendingHandler.bind(this);
            this._registerPendingEventHandler = this._registerPendingEventHandler.bind(this);
            this._finishPendingHandler = this._finishPendingHandler.bind(this);
            this._cancelFinishingPendingHandler = this._cancelFinishingPendingHandler.bind(this);
            this._cancelFinishingPendingEventHandler =
                this._cancelFinishingPendingEventHandler.bind(this);
        }

        protected _registerPendingEventHandler(
            event: Event,
            promise: Promise<void>,
            config: IPendingConfig
        ): void {
            event.stopPropagation();
            this._registerPendingHandler(promise, config);
        }
        protected _registerPendingHandler(promise: Promise<void>, config: IPendingConfig): void {
            this._pendingController.registerPending(promise, config);
        }
        protected _finishPendingHandler(
            event: Event,
            forceFinishValue: boolean,
            root: string
        ): Promise<unknown> {
            event.stopPropagation();
            return this._pendingController.finishPendingOperations(forceFinishValue, root);
        }
        protected _cancelFinishingPendingEventHandler(event: Event, root: string): void {
            event.stopPropagation();
            this._cancelFinishingPendingHandler(root);
        }
        protected _cancelFinishingPendingHandler(root: string): void {
            this._pendingController.cancelFinishingPending(root);
        }

        render() {
            return (
                <PendingContextProvider
                    registerPending={this._registerPendingHandler}
                    finishPendingOperations={this._finishPendingHandler}
                    cancelFinishingPending={this._cancelFinishingPendingHandler}
                >
                    {/*<EventSubscriber
                        onRegisterPending={withWasabyEventObject(this._registerPendingHandler)}
                        onFinishPendingOperations={withWasabyEventObject(
                            this._finishPendingHandler
                        )}
                        onCancelFinishingPending={withWasabyEventObject(
                            this._cancelFinishingPendingHandler
                        )}
                    >*/}
                    <WrappedComponent
                        {...this.props}
                        /*кастомные обработчики*/
                        registerPending={mergeHandlers(
                            this._registerPendingEventHandler,
                            this.props.registerPending,
                            true
                        )}
                        finishPendingOperations={mergeHandlers(
                            this._finishPendingHandler,
                            this.props.finishPendingOperations,
                            true
                        )}
                        cancelFinishingPending={mergeHandlers(
                            this._cancelFinishingPendingEventHandler,
                            this.props.cancelFinishingPending,
                            true
                        )}
                    />
                    {/*</EventSubscriber>*/}
                </PendingContextProvider>
            );
        }
        static displayName: string = 'withPendingContextProvider';
    };
}
