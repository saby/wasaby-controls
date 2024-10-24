/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import { Component } from 'react';
import { Control } from 'UI/Base';
import { default as ContextOptionsConsumer } from 'Controls/_context/ContextOptionsConsumer';

export default function connectData<T extends Control>(WrappedComponent: T, sliceName?: string): T {
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

    class ComponentWithDataContext extends Component<any, any> {
        _$child: any;

        constructor(props: any) {
            super(props);
            this.ref = this.ref.bind(this);
        }

        ref(node: HTMLDivElement) {
            this._$child = node;
        }

        render() {
            return (
                <ContextOptionsConsumer
                    sliceName={sliceName}
                    {...this.props}
                    contextWrapperRef={(element) => this.ref(element)}
                    contextOptionsInnerComponent={WrappedComponent}
                />
            );
        }

        static displayName: string = `withDataContext(${displayName})`;
    }

    // @ts-ignore
    ComponentWithDataContext.isReact = true;
    // многие задают этот метод для установки опций по умолчанию, этот метод используется в попапах для получения опций
    // @ts-ignore
    ComponentWithDataContext.getDefaultOptions = WrappedComponent.getDefaultOptions;
    // @ts-ignore
    ComponentWithDataContext._getDefaultOptions = WrappedComponent._getDefaultOptions;
    // альтернативный, правильный с точки зрения реакта способ задания опций по умолчанию
    // @ts-ignore
    ComponentWithDataContext.defaultProps = WrappedComponent.defaultProps;
    // @ts-ignore
    ComponentWithDataContext.getOptionTypes = WrappedComponent.getOptionTypes;
    // статическое поле для задания стилей
    // @ts-ignore
    ComponentWithDataContext._styles = WrappedComponent._styles;

    // @ts-ignore
    return ComponentWithDataContext;
}
