import * as React from 'react';
import Async from 'Controls/Container/Async';
import 'css!Controls/MasterCounter';

interface ICounter {
    style: string;
    tooltip?: string;
    value: number | string;
    onClick?: Function;
}

export interface IMasterCounterProps {
    counters: ICounter[];
    onClick: Function;
}

const defaultCounterStyles = ['label', 'danger'];

/**
 * Контрол счётчика для элемента списка в области master двухколоночного реестра с возможностью обработки кликов
 * @class Controls/MasterCounter
 * @demo Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/MasterCounter/Index
 * @public
 */

/**
 * @typedef {Object} ICounter
 * @description Конфигурация значений счетчика
 * @property {String} style Стиль отображения счетчика
 * @property {String} tooltip Подсказка при наведении на значение
 * @property {String|Number} value Текущее значение счетчика
 * @property {Function} onClick  Обработчик клика по данному значению счетчика
 */

/**
 * @name Controls/MasterCounter#counters
 * @cfg {ICounter[]} Конфигурация значений счетчиков элемента списка.
 */

/**
 * @name Controls/MasterCounter#parentProperty
 * @cfg {onClick} Обработчик клика по всему контролу.
 */

function MasterCounter(
    props: IMasterCounterProps,
    ref: React.ForwardedRef<object>
): React.ReactElement {
    const { counters } = props;
    const onClick = React.useCallback(
        (counter) => {
            if (counter.onClick) {
                counter.onClick(counter);
            } else {
                props.onClick(counter);
            }
        },
        [props.counters]
    );
    return (
        <div ref={ref} className={'Controls__MasterCounter__wrapper'}>
            {counters &&
                counters.map((counter, index) => (
                    <div
                        className={`Controls__MasterCounter__item ${
                            index ? 'Controls__MasterCounter__item_withSeparator' : ''
                        } controls-text-${counter.style || defaultCounterStyles[index]}`}
                        key={counter.value}
                        title={counter.tooltip || counter.value}
                        onClick={() => onClick(counter)}
                    >
                        {typeof counter.value === 'number' ? (
                            <Async
                                templateName="Controls/baseDecorator:Number"
                                templateOptions={{
                                    value: counter.value,
                                }}
                            />
                        ) : (
                            counter.value
                        )}
                    </div>
                ))}
        </div>
    );
}

export default React.forwardRef(MasterCounter);
