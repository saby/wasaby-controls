import { Component, PropsWithChildren, FC, RefObject } from 'react';
import { HTTPError, HTTPStatus } from 'TransportCore/transport';
import { ErrorViewMode, ErrorViewConfig } from 'ErrorHandling/interface';
import { ErrorController } from 'Controls/error';
import AsyncContainer from 'Controls/Container/Async';
import { Logger } from 'UI/Utils';
import { TInternalProps } from 'UICore/executor';

interface IErrorTemplateProps {
    Component: FC<TInternalProps> | string;
    options: object;
    forwardedRef: RefObject<Element>;
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

/**
 * Класс, отображающий заглушку, если в дочернем реакт-компоненте произошла ошибка.
 * @public
 */
export class ErrorBoundary extends Component<
    PropsWithChildren<TInternalProps>,
    { errorViewConfig: ErrorViewConfig | undefined }
> {
    constructor(props: PropsWithChildren<TInternalProps>) {
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
}
