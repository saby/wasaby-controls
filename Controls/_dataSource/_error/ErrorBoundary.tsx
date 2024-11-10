import { Component, PropsWithChildren, FC, RefObject, createContext } from 'react';
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
    { errorViewConfig: ErrorViewConfig | undefined }
> {
    constructor(props: PropsWithChildren<IErrorBoundaryProps>) {
        super(props);
        this.state = { errorViewConfig: undefined };
    }

    render() {
        if (typeof this.state.errorViewConfig !== 'undefined') {
            const { template: errorTemplate, options } = this.state.errorViewConfig;
            return (
                <ErrorTemplate
                    forwardedRef={this.props.forwardedRef}
                    Component={errorTemplate}
                    options={options}
                />
            );
        }

        return this.props.children;
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
