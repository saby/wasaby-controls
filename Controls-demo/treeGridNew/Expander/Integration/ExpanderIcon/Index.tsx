import { ItemsView } from 'Controls/treeGrid';
import { RecordSet } from 'Types/collection';
import { DemoTree } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Gadgets';
import * as React from 'react';
export default React.forwardRef(function Index(props, ref: React.ForwardedRef<HTMLDivElement>) {
    const [styles, setStyles] = React.useState([]);
    const [expanderIconStyle, setExpanderIconStyle] = React.useState([]);
    const [valigns, setValigns] = React.useState([]);
    const [columns, setColumns] = React.useState([
        [
            {
                displayProperty: 'title',
            },
        ],
    ]);
    React.useEffect(() => {
        setStyles(['master', 'default']);
        setExpanderIconStyle(['default', 'master', '2xs']);
        setValigns(['center', 'top', 'bottom']);
        setColumns([
            [
                {
                    displayProperty: 'title',
                },
            ],
            [
                {
                    displayProperty: 'title',
                    valign: 'top',
                },
            ],
            [
                {
                    displayProperty: 'title',
                    valign: 'bottom',
                },
            ],
        ]);
    }, []);
    const { getData, getEmptyNodeData } = DemoTree;
    function getBaseRecordSet(): RecordSet {
        return new RecordSet({
            rawData: getData(),
            keyProperty: 'key',
        });
    }
    function getEmptyNodeRecordSet(): RecordSet {
        return new RecordSet({
            rawData: getEmptyNodeData(),
            keyProperty: 'key',
        });
    }
    const items = React.useMemo(() => {
        return getBaseRecordSet();
    }, []);
    const emptyNodeItems = React.useMemo(() => {
        return getEmptyNodeRecordSet();
    }, []);
    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <h3 key={1}>expanderIcon = none</h3>
            <ItemsView
                columns={columns[0]}
                expanderIcon={'none'}
                items={items}
                keyProperty={'key'}
                nodeProperty={'type'}
                parentProperty={'parent'}
            />
            {styles.map((item) => {
                return (
                    <div key={item}>
                        <div className="controlsDemo__flexRow">
                            <h3>style = {item}</h3>
                        </div>
                        {expanderIconStyle.map((iconStyle) => {
                            return (
                                <div className="controlsDemo__flexRow" key={item + iconStyle}>
                                    <h4 className="controlsDemo__mr2">
                                        {' '}
                                        ExpanderIconSize = {iconStyle}
                                    </h4>
                                    <div className="controlsDemo__flexRow">
                                        {valigns.map((alignItem, index) => {
                                            return (
                                                <div
                                                    className="controlsDemo__mr2"
                                                    key={item + iconStyle + alignItem}
                                                >
                                                    <span>valign = {alignItem}</span>
                                                    <ItemsView
                                                        style={item}
                                                        columns={columns[index]}
                                                        expanderIconSize={iconStyle}
                                                        items={items}
                                                        keyProperty={'key'}
                                                        nodeProperty={'type'}
                                                        parentProperty={'parent'}
                                                    />
                                                    <ItemsView
                                                        style={item}
                                                        columns={columns[index]}
                                                        expanderIconSize={iconStyle}
                                                        items={emptyNodeItems}
                                                        keyProperty={'key'}
                                                        nodeProperty={'type'}
                                                        parentProperty={'parent'}
                                                        expanderIcon={'emptyNode'}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
});
