import { Component, PropsWithChildren, FC, RefObject, createContext, createRef } from 'react';
import { HTTPError, HTTPStatus } from 'TransportCore/transport';
import { ErrorViewMode, ErrorViewConfig } from 'ErrorHandling/interface';
import { ErrorController } from 'Controls/error';
import AsyncContainer from 'Controls/Container/Async';
import { Logger } from 'UI/Utils';
import { TInternalProps } from 'UICore/executor';

type ErrorHandler = (error: Error) => void;

interface IErrorTemplateProps {
    Component: FC<TInternalProps> | string;
    options: object;
    forwardedRef: RefObject<Element>;
}

interface IErrorBoundaryProps extends TInternalProps {
    onError?: ErrorHandler;
}

interface IErrorBoundaryContext {
    onError?: ErrorHandler;
}

function ErrorTemplate({ Component, options, forwardedRef }: IErrorTemplateProps): JSX.Element {
    if (typeof Component !== 'string') {
        return <Component forwardedRef={forwardedRef} {...options} />;
    }

    return (
        // @ts-ignore
        <AsyncContainer
            forwardedRef={forwardedRef}
            templateName={Component}
            templateOptions={options}
        />
    );
}

const errorController = new ErrorController();

export const ErrorBoundaryContext = createContext<IErrorBoundaryContext>({
    onError: () => {},
});

/**
 * Класс, отображающий заглушку, если в дочернем реакт-компоненте произошла ошибка.
 * @public
 */
export class ErrorBoundary extends Component<
    PropsWithChildren<IErrorBoundaryProps>,
    { errorViewConfig: ErrorViewConfig | undefined; availableWidth: number | undefined }
> {
    ref: RefObject<HTMLDivElement>;
    constructor(props: PropsWithChildren<IErrorBoundaryProps>) {
        super(props);
        this.state = { errorViewConfig: undefined, availableWidth: undefined };
        this.ref = createRef();
    }

    render() {
        if (typeof this.state.errorViewConfig !== 'undefined') {
            const { template: errorTemplate, options } = this.state.errorViewConfig;

            return (
                <div className="tw-contents" ref={this.ref}>
                    <ErrorTemplate
                        forwardedRef={this.props.forwardedRef}
                        Component={errorTemplate}
                        options={options}
                    />
                </div>
            );
        }

        return this.props.children;
    }
    componentDidUpdate(
        _: Readonly<PropsWithChildren<IErrorBoundaryProps>>,
        __: Readonly<{ errorViewConfig: ErrorViewConfig | undefined }>,
        ___?: any
    ): void {
        if (this.ref?.current !== null && typeof this.state.availableWidth === 'undefined') {
            const parent = this.ref.current?.parentElement;

            const availableHeight = parent?.clientHeight ?? 0;
            const availableWidth = parent?.clientWidth ?? 0;
            if (
                availableWidth < 166 ||
                (availableWidth >= 275 && availableHeight < 180) ||
                (availableWidth >= 166 && availableWidth < 274 && availableHeight < 132)
            ) {
                this.setState((preState) => {
                    const state = { ...preState };
                    state.availableWidth = availableWidth;
                    delete state.errorViewConfig?.options.action;
                    delete state.errorViewConfig?.options.image;
                    return state;
                });
            }
        }
    }
    componentDidCatch(error: Error): void {
        Logger.error('Ошибка при рендере', null, error);

        if (this.props.onError) {
            this.props.onError(error);
        } else if (this.context.onError) {
            this.context.onError(error);
        }
    }

    reset(): void {
        this.setState({ errorViewConfig: undefined });
    }

    static getDerivedStateFromError(error: Error) {
        const renderError = new HTTPError({
            message: '',
            httpError: HTTPStatus.InternalServerError,
            url: '',
        });

        const errorViewConfig = errorController.processSync({
            error: renderError,
            mode: ErrorViewMode.include,
        });

        if (errorViewConfig && !errorViewConfig.options.message) {
            errorViewConfig.options.message = error.message;
        }

        return { errorViewConfig };
    }

    static contextType = ErrorBoundaryContext;
}
