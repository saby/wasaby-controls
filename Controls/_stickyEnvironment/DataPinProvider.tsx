/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { TemplateFunction } from 'UI/Base';
import { Context } from './Context';
import { PinController } from './PinController';
import { IEdgesData } from './interfaces';

export interface IProps extends TInternalProps {
    content: TemplateFunction;
    onEdgesDataChanged?: (intersectInfo: IEdgesData) => void;
}

export interface IState {
    controller: PinController;
}

/**
 * Контрол, организующий связь между {@link Controls/stickyEnvironment:DataPinContainer DataPinContainer} и {@link Controls/stickyEnvironment:DataPinConsumer DataPinConsumer}.
 *
 * Задача данного контрола - отслеживать и уведомлять пользователей об обновление граничных данных относительно верхней и нижней границы {@link Controls/scroll:Container} (либо {@link Controls/scroll:IntersectionObserverController})
 * Уведомление пользователей происходит путём генерации события ${@link Controls/stickyEnvironment:DataPinProvider#edgesDataChanged edgesDataChanged}
 *
 * @demo Controls-demo/StickyEnvironment/DataPinProvider/Base/Index
 * @demo Controls-demo/StickyEnvironment/DataPinProvider/Grid/Index
 * @demo Controls-demo/StickyEnvironment/DataPinProvider/Events/Index
 *
 * @class Controls/stickyEnvironment:DataPinProvider
 * @public
 */
export class DataPinProvider extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            controller: new PinController<unknown>({
                onEdgesDataChanged: (intersectInfo: IEdgesData) => {
                    this.props.onEdgesDataChanged?.(intersectInfo);
                },
            }),
        };
    }

    /**
     * Временный метод для очистики стека закрепленных итемов.
     * Понадобился как быстрое решение вот этой проблемы
     * https://online.sbis.ru/opendoc.html?guid=a17584db-5cc5-429f-b975-c18dbc52e601
     */
    clearStack(): void {
        this.state.controller.clearStack();
    }

    render(): React.ReactElement {
        if (this.props.content) {
            return (
                <Context.Provider value={this.state}>
                    <this.props.content
                        {...this.props}
                        forwardedRef={this.props.forwardedRef}
                        attrs={this.props.attrs}
                    />
                </Context.Provider>
            );
        }

        return <Context.Provider value={this.state}>{this.props.children}</Context.Provider>;
    }
}

export default DataPinProvider;

/* eslint-disable */
/**
 * @event edgesDataChanged Происходи при обновлении граничных данных относительно верхней и нижней границы родительского {@link Controls/scroll:Container Controls/scroll:Container} (либо {@link Controls/scroll:IntersectionObserverController Controls/scroll:IntersectionObserverController})
 * @name Controls/stickyEnvironment:DataPinProvider#edgesDataChanged
 */
/* eslint-enable */
