import * as React from 'react';

import 'Controls/gridReact';
import { IColumnConfig, IResultConfig, useListData } from 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';
import { Number as NumberDecorator } from 'Controls/baseDecorator';
import { Model } from 'Types/entity';

import { getItems, getColumns } from './resources/CountriesData';

interface IDemoProps {
    stickyResults?: boolean;
}

function ResultCell(props: { property: string }) {
    const results = useListData(['results']).metaData.results as Model;
    const value = results.get(props.property);
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

function getDefaultResults(): IResultConfig[] {
    return [
        {
            key: 'count',
            render: <ResultCell property={'count'} />,
        },
        {
            key: 'populationCountries',
            render: <ResultCell property={'populationCountries'} />,
        },
        {
            key: 'populationCapitals',
            render: <ResultCell property={'populationCapitals'} />,
        },
    ];
}

function getResultsWithColspan(): IResultConfig[] {
    return [
        {
            key: 'count',
            render: (
                <div>
                    Общее кол-во записей:
                    <ResultCell property={'count'} />
                </div>
            ),
            startColumn: 1,
            endColumn: 4
        },
    ];
}

function ResultsDemo(
    props: IDemoProps,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    const items = React.useMemo(() => getItems(), []);
    const columns = React.useMemo<IColumnConfig[]>(() => getColumns(), []);
    const [results, setResults] = React.useState<IResultConfig[]>(getDefaultResults());

    const changeResultsField = () => {
        const results = items.getMetaData().results;
        results.set('count', results.get('count') + 1);
    };

    const changeMetaData = () => {
        const metaData = items.getMetaData();
        const newMetaData = {
            ...metaData,
            results: metaData.results.clone(),
        };
        newMetaData.results.set('count', newMetaData.results.get('count') + 1);
        items.setMetaData(newMetaData);
    };

    const setResultsWithColspan = () => {
        setResults(getResultsWithColspan);
    };

    return (
        <div ref={ref}>
            <button onClick={changeResultsField}>Change results field</button>
            <button onClick={changeMetaData}>Change full metadata</button>
            <button onClick={setResultsWithColspan}>Results with colspan</button>
            <ScrollContainer
                className={'controlsDemo__height500 controlsDemo__width800px'}
            >
                <GridItemsView
                    items={items}
                    columns={columns}
                    results={results}
                    resultsPosition="top"
                    stickyResults={props.stickyResults}
                />
            </ScrollContainer>
        </div>
    );
}

export default React.forwardRef(ResultsDemo);
