import { useState, forwardRef } from 'react';
import { Button } from 'Controls/buttons';
import { Title } from 'Controls/heading';
import { Money } from 'Controls/baseDecorator';
import { Text } from 'Controls/input';
import { Input } from 'Controls/search';
import { Path } from 'Controls/breadcrumbs';
import { View } from 'Controls/treeGrid';
import { View as ColumnsView, ItemTemplate } from 'Controls/columns';
import { Buttons } from 'Controls/tabs';
import ShowMoreButton from 'Controls/ShowMoreButton';
import 'css!Controls-demo/themes/ZenWrapper/resources/Style';
import { Model } from 'Types/entity';
import { HierarchicalMemory } from 'Types/source';
import { RecordSet } from 'Types/collection';

const tgColumns = [
    {
        displayProperty: 'title',
    },
];
const bcitems = [
    { id: 1, title: 'Первая папка', parent: null },
    { id: 2, title: 'Вторая папка', parent: 1 },
    { id: 3, title: 'Третья папка', parent: 2 },
].map((item) => {
    return new Model({
        rawData: item,
        keyProperty: 'id',
    });
});
const tgSource = new HierarchicalMemory({
    keyProperty: 'key',
    data: [
        {
            key: 2,
            title: 'Samsung',
            country: 'Южная Корея',
            parent: null,
            type: true,
        },
        {
            key: 21,
            title: 'Samsung A10',
            parent: 2,
            type: null,
        },
        {
            key: 22,
            title: 'Samsung A20',
            parent: 2,
            type: null,
        },
        {
            key: 3,
            title: 'Iphone',
            parent: null,
            type: null,
        },
    ],
    parentProperty: 'parent',
});
const tabsItems = new RecordSet({
    keyProperty: 'id',
    rawData: [
        {
            id: '1',
            title: 'Document',
        },
        {
            id: '2',
            title: 'Files',
        },
        {
            id: '3',
            title: 'Orders',
        },
    ],
});

export default forwardRef(function Component(props, ref) {
    const [expandedEllipsis, setExpandedEllipsis] = useState();
    const [expandedArrow, setExpandedArrow] = useState();
    const [tabsSelectedKey, setTabsSelectedKey] = useState('1');
    return (
        <div className={props.className} ref={ref} style={props.style}>
            <div className="ws-flexbox">
                <div
                    className="ws-flexbox ws-flex-column ws-align-items-start"
                    style={{ width: '50%' }}
                >
                    <span className="controls-text-default">controls-text-default</span>
                    <span className="controls-text-primary">controls-text-primary</span>
                    <span className="controls-text-secondary">controls-text-secondary</span>
                    <span className="controls-text-label">controls-text-label</span>
                    <span className="controls-text-link">controls-text-link</span>
                    <span className="controls-text-unaccented">controls-text-unaccented</span>
                    <span className="controls-text-readonly">controls-text-readonly</span>
                </div>
                <div className="ws-flexbox ws-flex-column ws-align-items-start controls-padding_left-l">
                    <Button
                        viewMode="link"
                        icon="icon-Edit"
                        iconSize="s"
                        iconStyle="default"
                        caption="link"
                        fontColorStyle="default"
                    ></Button>
                    <Button
                        viewMode="link"
                        icon="icon-Edit"
                        iconSize="s"
                        iconStyle="primary"
                        caption="link"
                        fontColorStyle="primary"
                    ></Button>
                    <Button
                        viewMode="link"
                        icon="icon-Edit"
                        iconSize="s"
                        iconStyle="secondary"
                        caption="link"
                        fontColorStyle="secondary"
                    ></Button>
                    <Button
                        viewMode="link"
                        icon="icon-Edit"
                        iconSize="s"
                        iconStyle="label"
                        caption="link"
                        fontColorStyle="label"
                    ></Button>
                    <Button
                        viewMode="link"
                        icon="icon-Edit"
                        iconSize="s"
                        iconStyle="unaccented"
                        caption="link"
                        fontColorStyle="unaccented"
                    ></Button>
                    <Button
                        viewMode="link"
                        icon="icon-Edit"
                        iconSize="s"
                        iconStyle="secondary"
                        caption="link"
                        fontColorStyle="secondary"
                        readOnly={true}
                    ></Button>
                </div>
            </div>
            <div className="ws-flexbox controls-padding_top-l">
                <div
                    className="ws-flexbox ws-flex-column ws-align-items-start"
                    style={{ width: '50%' }}
                >
                    <Title
                        caption="Default heading"
                        fontColorStyle="default"
                        readOnly={true}
                    ></Title>
                    <Title caption="Primary heading" fontColorStyle="primary"></Title>
                    <Title caption="Secondary heading" fontColorStyle="secondary"></Title>
                    <Title
                        caption="Unaccented heading"
                        fontColorStyle="unaccented"
                        readOnly={true}
                    ></Title>
                </div>
                <div className="ws-flexbox ws-flex-column ws-align-items-start controls-padding_left-l">
                    <Money value="123.45" fontColorStyle="default" />
                    <Money value="123.45" fontColorStyle="primary" />
                    <Money value="123.45" fontColorStyle="secondary" />
                    <Money value="123.45" fontColorStyle="unaccented" />
                    <Money value="123.45" fontColorStyle="label" />
                    <Money value="123.45" fontColorStyle="readonly" />
                </div>
            </div>

            <div className="ws-flexbox controls-padding_top-l">
                <div
                    className="ws-flexbox ws-flex-column ws-align-items-start"
                    style={{ width: '50%' }}
                >
                    <ShowMoreButton
                        caption="Button"
                        value={expandedEllipsis}
                        onValueChanged={setExpandedEllipsis}
                        iconMode="ellipsis"
                    ></ShowMoreButton>
                </div>
                <div className="ws-flexbox ws-flex-column ws-align-items-start controls-padding_left-l">
                    <ShowMoreButton
                        caption="Button 2"
                        value={expandedArrow}
                        onValueChanged={setExpandedArrow}
                        iconMode="arrow"
                    ></ShowMoreButton>
                </div>
            </div>

            <div className="ws-flexbox controls-padding_top-l">
                <div
                    className="ws-flexbox ws-flex-column ws-align-items-start"
                    style={{ width: '50%' }}
                >
                    <ShowMoreButton
                        caption="Button"
                        value={expandedEllipsis}
                        onValueChanged={(value) => {
                            setExpandedEllipsis(value);
                        }}
                        readOnly={true}
                        iconMode="ellipsis"
                    ></ShowMoreButton>
                </div>
                <div className="ws-flexbox ws-flex-column ws-align-items-start controls-padding_left-l"></div>
            </div>

            <div className="ws-flexbox controls-padding_top-l">
                <div
                    className="ws-flexbox ws-flex-column ws-align-items-start"
                    style={{ width: '50%' }}
                >
                    <Button
                        contrastBackground={false}
                        buttonStyle="primary"
                        caption="Button"
                    ></Button>
                </div>
                <div className="ws-flexbox ws-flex-column ws-align-items-start controls-padding_left-l">
                    <Button viewMode="filled" buttonStyle="primary" caption="Button"></Button>
                </div>
            </div>

            <div className="ws-flexbox controls-padding_top-l">
                <div
                    className="ws-flexbox ws-flex-column ws-align-items-start"
                    style={{ width: '50%' }}
                >
                    <Button
                        contrastBackground={false}
                        buttonStyle="primary"
                        caption="Button"
                        readOnly={true}
                    ></Button>
                </div>
                <div className="ws-flexbox ws-flex-column ws-align-items-start controls-padding_left-l">
                    <Button
                        contrastBackground={false}
                        buttonStyle="primary"
                        caption="Button"
                        readOnly={true}
                    ></Button>
                </div>
            </div>

            <div className="ws-flexbox controls-padding_top-l">
                <div
                    className="ws-flexbox ws-flex-column ws-align-items-start"
                    style={{ width: '30%' }}
                >
                    <Button
                        viewMode="filled"
                        icon="icon-EmptyMessage"
                        translucent={true}
                        iconSize="s"
                        iconStyle="contrast"
                        buttonStyle="pale"
                    />
                </div>
                <div
                    className="ws-flexbox ws-flex-column ws-align-items-start controls-padding_left-m"
                    style={{ width: '30%' }}
                >
                    <Button
                        viewMode="filled"
                        icon="icon-EmptyMessage"
                        translucent="light"
                        iconSize="s"
                        iconStyle="contrast"
                        buttonStyle="pale"
                    />
                </div>
                <div className="ws-flexbox ws-flex-column ws-align-items-start controls-padding_left-l">
                    <Button
                        viewMode="filled"
                        icon="icon-EmptyMessage"
                        iconSize="s"
                        iconStyle="primary"
                        buttonStyle="pale"
                    />
                </div>
            </div>

            <div className="ws-flexbox controls-padding_top-l">
                <div
                    className="ws-flexbox ws-flex-column ws-align-items-start"
                    style={{ width: '30%' }}
                >
                    <Button
                        viewMode="filled"
                        caption="Button"
                        translucent={true}
                        iconSize="s"
                        iconStyle="contrast"
                        buttonStyle="pale"
                    />
                </div>
                <div
                    className="ws-flexbox ws-flex-column ws-align-items-start controls-padding_left-m"
                    style={{ width: '30%' }}
                >
                    <Button
                        viewMode="filled"
                        caption="Button"
                        translucent="light"
                        iconSize="s"
                        iconStyle="contrast"
                        buttonStyle="pale"
                    />
                </div>
                <div className="ws-flexbox ws-flex-column ws-align-items-start controls-padding_left-l">
                    <Button
                        viewMode="filled"
                        caption="Button"
                        iconSize="s"
                        iconStyle="primary"
                        buttonStyle="pale"
                    />
                </div>
            </div>

            <div className="ws-flexbox controls-padding_top-l">
                <div
                    className="ws-flexbox ws-flex-column ws-align-items-start"
                    style={{ width: '50%' }}
                >
                    <Text placeholder="Placeholder" />
                </div>
                <div
                    className="ws-flexbox ws-flex-column ws-align-items-start"
                    style={{ width: '50%' }}
                >
                    <Input placeholder="Placeholder" />
                </div>
                <div
                    className="ws-flexbox ws-flex-column ws-align-items-start"
                    style={{ width: '50%' }}
                >
                    <Input placeholder="Placeholder" contrastBackground={true} />
                </div>
                <div className="ws-flexbox ws-flex-column ws-align-items-start controls-padding_left-l"></div>
            </div>

            <div className="ws-flexbox controls-padding_top-l">
                <div
                    className="ws-flexbox ws-flex-column ws-align-items-start"
                    style={{ width: '50%' }}
                >
                    <Path keyProperty="id" items={bcitems} />
                </div>
                <div className="ws-flexbox ws-flex-column ws-align-items-start controls-padding_left-l"></div>
            </div>

            <div className="ws-flexbox controls-padding_top-l">
                <div
                    className="ws-flexbox ws-flex-column ws-align-items-start"
                    style={{ width: '50%' }}
                >
                    <View
                        expandedItems={[2]}
                        keyProperty="key"
                        source={tgSource}
                        columns={tgColumns}
                        parentProperty="parent"
                        nodeProperty="type"
                    />
                </div>
                <div className="ws-flexbox ws-flex-column ws-align-items-start controls-padding_left-l"></div>
            </div>

            <div className="ws-flexbox controls-padding_top-l">
                <div
                    className="ws-flexbox ws-flex-column ws-align-items-start"
                    style={{ width: '50%' }}
                >
                    <ColumnsView
                        keyProperty="key"
                        backgroundStyle="transparent"
                        source={tgSource}
                        itemTemplate={(itemTemplateProps) => {
                            return (
                                <ItemTemplate
                                    {...itemTemplateProps}
                                    highlightOnHover={false}
                                    className="controlsDemo__height36_item"
                                />
                            );
                        }}
                    ></ColumnsView>
                </div>
                <div className="ws-flexbox ws-flex-column ws-align-items-start controls-padding_left-l"></div>
            </div>

            <div className="ws-flexbox controls-padding_top-l">
                <div
                    className="ws-flexbox ws-flex-column ws-align-items-start"
                    style={{ width: '50%' }}
                >
                    <Buttons
                        selectedKey={tabsSelectedKey}
                        onSelectedKeyChanged={setTabsSelectedKey}
                        keyProperty="id"
                        borderVisible={false}
                        items={tabsItems}
                    />
                </div>
                <div className="ws-flexbox ws-flex-column ws-align-items-start controls-padding_left-l"></div>
            </div>
        </div>
    );
});
