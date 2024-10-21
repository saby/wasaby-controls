import * as React from 'react';
import { View } from 'Controls/adaptiveTile';
import { Container } from 'Controls/scroll';
import { Memory } from 'Types/source';
import 'css!DemoStand/Controls-demo';
import { INavigationOptionValue, INavigationPageSourceConfig } from 'Controls/interface';
import { IDataConfig } from 'Controls-DataEnv/_dataFactory/interface/IDataConfig';
import { DATA } from './Data';
import { HorizontalItem } from 'Controls-Templates/itemTemplates';

interface IState {
    source: Memory;
    longSource: Memory;
    loadMode: boolean;
    itemsCount: number;
    availableHeight: number;
    availableWidth: number;
    navigation: INavigationOptionValue<INavigationPageSourceConfig>;
}

const STORE_ID = 'adaptiveTile-wi-index';

const ITEM_PADDING = {
    left: 'xs',
    right: 'xs',
    top: 'xs',
    bottom: 'xs',
};

const ITEM_TEMPLATE = React.memo(({ item, ...props }) => {
    return (
        <HorizontalItem
            {...props}
            cursor="pointer"
            captionFontSize="l"
            captionFontWeight="bold"
            descriptionVAlign="top"
            captionLines={1}
            descriptionFontSize="m"
            descriptionLines={2}
            shadowVisibility="visible"
            paddingTop="s"
            paddingBottom="s"
            paddingLeft="s"
            paddingRight="s"
            roundAngleBL="s"
            roundAngleBR="s"
            roundAngleTL="s"
            roundAngleTR="s"
            imageViewMode={'rectangle'}
            imageSize={'xlt'}
            caption={item.contents.get('caption')}
            description={item.contents.get('description')}
        />
    );
});

export default class Index extends React.Component<{}, IState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            loadMode: false,
            itemsCount: 1,
            availableHeight: 230,
            availableWidth: 757,
        };
    }
    render(): JSX.Element {
        return (
            <div
                ref={this.props.forwardedRef}
                className={'controlsDemo__wrapper'}
                style={{ width: this.state.availableWidth, height: this.state.availableHeight }}
            >
                <Container
                    className={`controls-background-unaccented
                                controlsDemo_fixedWidth${this.state.availableWidth}
                                controlsDemo__height${this.state.availableHeight}`}
                    scrollOrientation="horizontal"
                    horizontalScrollMode="buttons"
                    smoothScrolling={true}
                    itemPadding={}
                    content={
                        <View
                            storeId={STORE_ID}
                            itemPadding={ITEM_PADDING}
                            minItemHeight={80}
                            maxItemHeight={167}
                            minItemWidth={260}
                            maxItemWidth={300}
                            availableHeight={this.state.availableHeight}
                            availableWidth={this.state.availableWidth}
                            itemTemplate={ITEM_TEMPLATE}
                        />
                    }
                ></Container>
            </div>
        );
    }
    static getLoadConfig(): Record<string, IDataConfig> {
        return {
            [STORE_ID]: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        keyProperty: 'key',
                        data: DATA,
                    }),
                    keyProperty: 'key',
                },
            },
        };
    }
}
