import { memo } from 'react';
import { Record } from 'Types/entity';
import { Money as MoneyViewer } from 'Controls/baseDecorator';
import { Button as ButtonControl, IButtonOptions } from 'Controls/buttons';
import { IControlOptions } from 'UI/Base';
import { ColumnTemplate } from 'Controls/grid';
import { useContent } from 'UICore/Jsx';
import { HeaderContent } from 'Controls/grid';
import 'css!Controls-Templates/hiddenNodesTemplate';

/**
 * Шаблон заголовка цен с кастомным отступом
 */
export function HeaderColumn(props) {
    return (
        <HeaderContent
            {...props}
            className={'controls-Grid__cell_spacing_money'}
        />
    );
}

/**
 * Интерфейс для опций контрола {@link Controls-Templates/HiddenItems}.
 * @interface Controls-Templates/IHiddenItemsProps
 * @implements UI/Base/IControlOptions
 * @public
 */
export interface IHiddenItemsProps extends IControlOptions {
    item: { contents: Record };
    /**
     * @cfg {IButtonOptions} Объект для настройки кнопки скрытого узла.
     */
    buttonsOptions: IButtonOptions;
}
/**
 * Константа для отображения минимального кол-ва номинала
 */
const MIN_COUNT_PRICE = 1;

export function HiddenItems({ item, buttonsOptions }: IHiddenItemsProps) {
    const hiddenPrices: number[] = item.contents.get('Prices');
    const pricesCount = hiddenPrices?.length;
    const isExpanded = item.contents.get('isExpandedFlag');
    const isOnlyOne = pricesCount === MIN_COUNT_PRICE;
    const isMoreThenOne = pricesCount > MIN_COUNT_PRICE;

    if ((!pricesCount && !isOnlyOne) || (isMoreThenOne && !isExpanded)) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <></>;
    }

    return (
        <div className={'tw-flex tw-w-full'}>
            <div
                className={`tw-w-full ${
                    isExpanded
                        ? 'Controls-Templates-HiddenItems-expandedWrapper'
                        : 'Controls-Templates-HiddenItems-unExpandedWrapper'
                }`}
            >
                {hiddenPrices.map((price: number, index) => {
                    /* eslint-disable react/no-array-index-key */
                    return (
                        <div
                            className={
                                'Controls-Templates-HiddenItems-CardWrapper tw-w-full'
                            }
                            key={index.toString()}
                        >
                            <ButtonControl
                                readOnly={false}
                                icon={'icon-ProductsDownload'}
                                iconSize={'m'}
                                buttonStyle={'link'}
                                viewMode={'link'}
                                {...buttonsOptions}
                            />
                            <MoneyViewer
                                fontSize="xl"
                                fontWeight="bold"
                                value={price}
                            />
                        </div>
                    );
                    /* eslint-enable react/no-array-index-key */
                })}
            </div>
        </div>
    );
}

function Template(props: IControlOptions) {
    const content = useContent(HiddenItems);

    return <ColumnTemplate {...props} contentTemplate={content} />;
}

export default memo(Template);
