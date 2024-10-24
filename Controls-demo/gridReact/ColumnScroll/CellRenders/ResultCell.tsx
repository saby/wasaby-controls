import { Highlight as HighlightDecorator, Number as NumberDecorator } from 'Controls/baseDecorator';

export interface IResultCellProps {
    property: 'secondFixed' | `scrollable_${0 | 1 | 2}`;
}

export default function ResultCell({ property }: IResultCellProps) {
    if (property === 'secondFixed') {
        return (
            <div>
                <div>
                    <HighlightDecorator value="Всего организаций 25" highlightedValue="25" />
                </div>
                <div>
                    <HighlightDecorator value="Сформировано заявок: 142" highlightedValue="142" />
                </div>
            </div>
        );
    }
    // Удалить по https://online.sbis.ru/opendoc.html?guid=af6d7e07-3c82-4461-a9d1-876b48d9670d&client=3
    const isBugFixes = false;
    let value: number;

    if (!isBugFixes) {
        value = 151.56;
    } else {
        // const results = useListData(['results']).metaData.results as Model;
        // value = results.get(property);
    }
    return (
        <NumberDecorator
            value={value}
            useGrouping
            fontSize={'m'}
            fontWeight={'bold'}
            fontColorStyle={'secondary'}
        />
    );
}
