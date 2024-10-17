import { memo } from 'react';
import { Record } from 'Types/entity';
import { Number as NumberViewer } from 'Controls/baseDecorator';
import { IControlOptions } from 'UI/Base';
import { ColumnTemplate } from 'Controls/grid';
import { useContent } from 'UICore/Jsx';
import 'css!Controls-Templates/hiddenNodesTemplate';

/**
 * Константы для отображения кол-ва номиналов в компоненте
 */
const MIN_COUNT_PRICE = 1;
const MIDDLE_COUNT_PRICE = 2;
const MAX_COUNT_PRICE = 4;

/**
 * Интерфейс для опций контрола {@link Controls-Templates/ChipsItems}.
 * @interface Controls-Templates/IChipsItemsProps
 * @implements UI/Base/IControlOptions
 * @public
 */
export interface IChipsItemsProps extends IControlOptions {
    item: { contents: Record };
    /**
     * @cfg {function} Функция клика по номинуалу.
     */
    nominalOpenHandler: Function;
    /**
     * @cfg {function} Функция клика для раскрытия списка скрытых номиналов.
     */
    nominalsOpenHandler: Function;
}

/**
 * Кнопка раскрытия скрытого узла внутри списка
 * @param {object} props Параметры компонента
 * @param {bool} props.expanded Флаг состояния узла
 * @param {function} props.onMouseDown Функция клика по кнопке
 */
function ExpanderComponent(props: any) {
    return (
        <div
            className={`controls-icon
                         controls-icon_size-s
                         controls-icon_style-label
                         ${props.expanded ? 'icon-MarkExpandBold' : 'icon-MarkRightBold'}
                         controls-padding_right-2xs`}
            onMouseDown={props.onMouseDown}
        />
    );
}

export function ChipsItems({ item, nominalOpenHandler, nominalsOpenHandler }: IChipsItemsProps) {
    const title = item.contents.get('title');
    const hiddenPrices: number[] = item.contents.get('Prices');
    const pricesCount = hiddenPrices?.length;
    const isExpanded = item.contents.get('isExpandedFlag');
    const moreThenOne = pricesCount > MIN_COUNT_PRICE;

    const onMouseDown = () => {
        item.contents.set('isExpandedFlag', !isExpanded);
    };

    if (!pricesCount || !moreThenOne || isExpanded) {
        return (
            <div className={'tw-flex'}>
                {isExpanded && (
                    <ExpanderComponent onMouseDown={onMouseDown} expanded={isExpanded} />
                )}
                <div>{title}</div>
            </div>
        );
    }

    return (
        <div className={'tw-flex tw-w-full tw-justify-between tw-items-baseLine'}>
            <div className={'tw-flex'}>
                <ExpanderComponent onMouseDown={onMouseDown} expanded={isExpanded} />
                <div className={'controls-margin_right-2xl'}> {title} </div>
            </div>

            <div className={'ControlsTemplates-ChipsItems_unExpandedWrapper'}>
                {hiddenPrices.map((price: number, index) => {
                    const currentCount = index + 1;
                    const isFirstThreePrice = currentCount <= MIDDLE_COUNT_PRICE;
                    const isMiddlePrice = currentCount === MAX_COUNT_PRICE;
                    const isLastPrice = currentCount === pricesCount;
                    const numberValue =
                        pricesCount <= MAX_COUNT_PRICE
                            ? price
                            : isFirstThreePrice || isLastPrice
                            ? price
                            : isMiddlePrice && '....';

                    /* eslint-disable react/no-array-index-key */
                    return (
                        <div className={isExpanded && 'tw-w-full'} key={index.toString()}>
                            {numberValue && (
                                <div
                                    className={!isExpanded && 'ControlsTemplates-ChipsItems_border'}
                                    onClick={
                                        isMiddlePrice ? nominalsOpenHandler : nominalOpenHandler
                                    }
                                >
                                    <div
                                        className={
                                            'ControlsTemplates-ChipsItems_border-opacity controls-fontsize-xs'
                                        }
                                    >
                                        .00
                                    </div>
                                    <NumberViewer
                                        fontWeight="bold"
                                        useGrouping={true}
                                        value={numberValue}
                                    />
                                    <div
                                        className={
                                            'ControlsTemplates-ChipsItems_border-opacity controls-fontsize-xs'
                                        }
                                    >
                                        .00
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                    /* eslint-enable react/no-array-index-key */
                })}
            </div>
        </div>
    );
}

function Template(props: IControlOptions) {
    const content = useContent(ChipsItems);

    return <ColumnTemplate {...props} contentTemplate={content} />;
}

export default memo(Template);
