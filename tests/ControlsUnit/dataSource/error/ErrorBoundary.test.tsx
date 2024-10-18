/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { render } from '@testing-library/react';
import { error } from 'Controls/dataSource';
import * as ErrorHandling from 'ErrorHandling/ErrorHandling';
import type { ErrorViewConfig, IErrorHandlerConfig } from 'ErrorHandling/interface';

const { ErrorBoundary } = error;

interface IHelloWorldProps {
    hasError?: true;
}

function HelloWorld({ hasError }: IHelloWorldProps): JSX.Element {
    if (hasError) {
        throw new Error('custom error');
    }

    return <div>Hello world!</div>;
}

interface IErrorTemplateProps {
    message: string;
}

function ErrorTemplate({ message }: IErrorTemplateProps): JSX.Element {
    return <div>This is error template: {message}</div>;
}

function errorHandler({ error }: IErrorHandlerConfig): ErrorViewConfig {
    return {
        template: ErrorTemplate,
        options: {
            message: error.message,
        },
    };
}

describe('Controls/dataSource:error.ErrorBoundary', () => {
    let container: HTMLDivElement;
    let originalErrorHandlers;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        originalErrorHandlers = ErrorHandling.getHandlers();
        ErrorHandling.setHandlers([errorHandler]);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        container.remove();
        ErrorHandling.setHandlers(originalErrorHandlers);
        container = null;
        originalErrorHandlers = null;
    });

    it('Рендер компонента без ошибки', () => {
        render(
            <ErrorBoundary>
                <HelloWorld />
            </ErrorBoundary>,
            { container }
        );

        expect(container).toMatchSnapshot();
    });

    it('Рендер компонента с ошибкой', () => {
        render(
            <ErrorBoundary>
                <HelloWorld hasError={true} />
            </ErrorBoundary>,
            { container }
        );

        expect(container).toMatchSnapshot();
    });
});
