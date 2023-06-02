/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
import { TemplateFunction } from 'UI/Base';
import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import {
    IntersectionObserverContainer,
    IntersectionObserverSyntheticEntry,
} from 'Controls/scroll';
import { Context } from './Context';
import { PinController } from './PinController';
import { SyntheticEvent } from 'Vdom/Vdom';

/**
 * Интерфейс описывает структуру конфигурации контрола {@link Controls/stickyEnvironment:DataPinContainer DataPinContainer}
 * @public
 */
export interface IProps extends TInternalProps {
    /**
     * @cfg {any} Данные которые будут переданы в {@link Controls/stickyEnvironment:DataPinConsumer DataPinConsumer} при уходе текущего {@link Controls/stickyEnvironment:DataPinContainer DataPinContainer} за верхнюю границу {@link Controls/scroll:Container} (либо {@link Controls/scroll:IntersectionObserverController})
     */
    data?: object;

    /**
     * @cfg {String} Отступ от верхней границы {@link Controls/scroll:Container} (либо {@link Controls/scroll:IntersectionObserverController}) при котором будет засчитано пересечение. Представляет собой строку с синтаксисом, аналогичным синтаксису свойства CSS margin-top.
     *
     * @remark
     * Если пересечение должно быть засчитано раньше чем начинается верхняя граница, то значение должно быть отрицательным.
     *
     * @default '0px'
     */
    topMargin?: string;

    /**
     * @cfg {String} Отступ от нижней границы {@link Controls/scroll:Container} (либо {@link Controls/scroll:IntersectionObserverController}) при котором будет засчитано пересечение. Представляет собой строку с синтаксисом, аналогичным синтаксису свойства CSS margin-top.
     *
     * @default '0px'
     */
    bottomMargin?: string;

    /**
     * @cfg {TemplateFunction} Контент контрола
     */
    content: TemplateFunction;
}

// Значения пересечения при которых дергается _intersectHandler
// при такой конфигурации событие будет стрелять трижды:
//  1. при пересечении блока с верхней границей контейнера
//  2. при полном уходе блока за верхнюю границу контейнера
//  3. при полном выходе блока ниже верхней границы контейнера
const THRESHOLD = [0, 1];

const buildMarginStyle = (
    top: string = '0px',
    bottom: string = '0px'
): string => {
    return `${top} 0px ${bottom || '0px'} 0px`;
};

/**
 * Контрол контейнер на котором можно закрепить произвольные данные и который отслеживает свое положение внутри {@link Controls/scroll:Container} (либо {@link Controls/scroll:IntersectionObserverController}).
 * В случае ухода данного контейнера за верхнюю границу <i>ScrollContainer</i> его данные будут переданы в {@link Controls/stickyEnvironment:DataPinConsumer DataPinConsumer} в рамках родительского {@link Controls/stickyEnvironment:DataPinProvider DataPinProvider}.
 *
 * <strong>Важно</strong>
 * {@link Controls/stickyEnvironment:DataPinContainer DataPinContainer} не должен лежать внутри элемента с <i>overflow: hidden</i>. Иначе это на нативном уровне ломает функционал IntersectionObserver.
 * Единственный предок с <i>overflow: hidden</i> должен быть только {@link Controls/scroll:Container} (либо {@link Controls/scroll:IntersectionObserverController})
 *
 * @demo Controls-demo/StickyEnvironment/DataPinProvider/Base/Index
 * @demo Controls-demo/StickyEnvironment/DataPinProvider/Grid/Index
 * @demo Controls-demo/StickyEnvironment/DataPinProvider/Events/Index
 *
 * @public
 */
function DataPinContainer(props: IProps, ref): JSX.Element {
    // Отступы от корневого IntersectionObserverController при которых будет засчитано пересечение
    const [rootMargin, setRootMargin] = React.useState<string>(
        buildMarginStyle(props.topMargin, props.bottomMargin)
    );

    const { controller } = React.useContext(Context) as {
        controller: PinController;
    };

    /**
     * Обработчик появления/скрытия в области видимости родительского IntersectionObserverController.
     */
    const onIntersect = React.useCallback(
        (entry: IntersectionObserverSyntheticEntry) => {
            controller.processIntersect(entry);
        },
        []
    );

    React.useEffect(() => {
        return () => {
            // При дестрое надо выкинуть наши данные из стека PinController'а
            controller.dropStackItem(props.data);
        };
    }, []);

    React.useEffect(() => {
        setRootMargin(buildMarginStyle(props.topMargin, props.bottomMargin));
    }, [props.topMargin, props.bottomMargin]);

    return (
        <IntersectionObserverContainer
            data={props.data}
            forwardedRef={ref}
            threshold={THRESHOLD}
            rootMargin={rootMargin}
            content={props.content}
            customEvents={['onIntersect']}
            onIntersect={onIntersect}
        />
    );
}

export default React.forwardRef(DataPinContainer);
