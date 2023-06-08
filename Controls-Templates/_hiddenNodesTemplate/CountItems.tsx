import { memo } from 'react';
import { Number as NumberViewer } from 'Controls/baseDecorator';
import { IControlOptions } from 'UI/Base';
import { Record } from 'Types/entity';
import 'css!Controls-Templates/hiddenNodesTemplate';

/**
 * Константа для отображения минимального кол-ва суммы
 */
const MIN_COUNT = 1;

/**
 * Интерфейс для опций контрола {@link Controls-Templates/CountItems}.
 * @interface Controls-Templates/ICountItemsProps
 * @implements UI/Base/IControlOptions
 * @public
 */
export interface ICountItemsProps extends IControlOptions {
    item: {
        contents: Record;
        isExpanded: Function;
    };
}

export function CountItems({ item }: ICountItemsProps) {
    const hiddenCounts: number[] = item.contents.get('Counts');
    const countLength = hiddenCounts?.length;
    const isExpanded = item.contents.get('isExpandedFlag');
    const isMinimumNodes = countLength === MIN_COUNT;
    const isMoreThenOne = countLength > MIN_COUNT;

    if (!countLength) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <></>;
    }

    return (
        <div className={'ControlsTemplates-CountItems'}>
            {hiddenCounts.map((count: number, index) => {
                if ((isMoreThenOne && isExpanded) || isMinimumNodes) {
                    /* eslint-disable react/no-array-index-key */
                    return (
                        <NumberViewer
                            key={index.toString()}
                            useGrouping={true}
                            value={count}
                        />
                    );
                    /* eslint-enable react/no-array-index-key */
                }
            })}
        </div>
    );
}

export default memo(CountItems);
