import { useMemo, useEffect } from 'react';
import { Model } from 'Types/entity';
import { SbisService } from 'Types/source';
import { FIELD_LIST_ENDPOINT } from 'Frame-DataEnv/dataFactory';
import { default as Stack } from 'Layout/Selector/Stack';
import { default as Browser } from 'Layout/Selector/Browser';
import { Input as SearchInput } from 'Controls/search';
import { View as TreeGridView } from 'Controls/treeGrid';
import * as rk from 'i18n!Controls-editors';
import { appendFilter, createFieldListSource, capitalizeTypeNames } from './Selector';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { Container as ScrollContainer } from 'Controls/scroll';
import { DataMapTreeEmptyTemplate as EmptyTemplate } from './DataMapTreeEmptyTemplate';
import { TDataFieldDefinition } from 'Frame/base';

interface ISelectorStackTemplateProps {
    objectNames: string[];
    types: string[];
    constructorType: unknown;
}
const ITEM_PADDING = {
    left: 'S',
    right: 'S',
};

function SelectorStackTemplate(props: ISelectorStackTemplateProps) {
    const { keyProperty, parentProperty, displayProperty, nodeProperty, contract, method } =
        FIELD_LIST_ENDPOINT;

    const source = useMemo<SbisService>(() => {
        return createFieldListSource(props.constructorType);
    }, [keyProperty, contract, method]);

    const FieldListModule = loadSync('FrameEditor/dataObjectFieldList');

    useEffect(() => {
        const handler = (eventObject: Event, name: string, args: Record<string, unknown>) => {
            if (name === method) {
                const filter = args.Фильтр as Model;
                appendFilter(filter, {
                    Types: capitalizeTypeNames(props.types),
                    Разворот: 'С разворотом',
                });
            }
            eventObject.setResult(args);
        };
        source.subscribe('onBeforeProviderCall', handler);
        return () => {
            source.unsubscribe('onBeforeProviderCall', handler);
        };
    }, [source, method, props.types, props.objectNames]);

    const COLUMNS = [
        {
            displayProperty,
            textOverflow: 'ellipsis',
            align: 'left',
            template: FieldListModule.TitleColumnTemplate,
        },
        {
            displayProperty,
            textOverflow: 'ellipsis',
            width: '36px',
            align: 'right',
            template: FieldListModule.IconColumnTemplate,
        },
    ];

    const StackBodyContent = useMemo(() => {
        return (
            <Browser
                keyProperty={keyProperty}
                parentProperty={parentProperty}
                nodeProperty={nodeProperty}
                selectionType={'leaf'}
                source={source}
                multiSelectVisibility="hidden"
                search={SearchInput}
                searchParam="Search"
            >
                <ScrollContainer className={'tw-h-full'}>
                    <TreeGridView
                        displayProperty={displayProperty}
                        className="controls-DataObjectFieldListPage controls-air-m"
                        expanderIcon="hiddenNode"
                        contextMenuVisibility={false}
                        itemPadding={ITEM_PADDING}
                        searchNavigationMode="expand"
                        columns={COLUMNS}
                        emptyTemplate={EmptyTemplate}
                    />
                </ScrollContainer>
            </Browser>
        );
    }, [COLUMNS, displayProperty, keyProperty, nodeProperty, parentProperty, source]);

    return (
        <Stack
            headingCaption={rk('Данные')}
            bodyContentTemplate={StackBodyContent}
            newDesign={true}
        />
    );
}

export { SelectorStackTemplate };
