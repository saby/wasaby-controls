import * as React from 'react';
import { Selector, ItemTemplate as DropdownItemTemplate } from 'Controls/dropdown';
import { companies } from 'Controls-demo/dropdown_new/Data';

function ContentItemTemplate(props) {
    return (
        <div className="ws-flexbox">
            <div className="controls-padding_right-s">{props.item.contents.get('title')}</div>
            <div className="controls-text-label controls-fontsize-s">
                {props.item.contents.get('city')}
            </div>
        </div>
    );
}

function ItemTemplate(props) {
    return (
        <DropdownItemTemplate
            {...props}
            contentTemplate={ContentItemTemplate}
        ></DropdownItemTemplate>
    );
}

export default React.forwardRef(function DropdownDemo(props, ref) {
    const [selectedKeys, setSelectedKeys] = React.useState(['1']);
    const selectedKeysChanged = React.useCallback(
        (newSelectedKeys) => {
            setSelectedKeys(newSelectedKeys);
        },
        [setSelectedKeys]
    );
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__flexRow">
            <div className="controlsDemo__ml2">
                <Selector
                    selectedKeys={selectedKeys}
                    onSelectedKeysChanged={selectedKeysChanged}
                    emptyText="Не выбрано"
                    keyProperty="key"
                    displayProperty="title"
                    items={companies}
                    useMenuListRender={true}
                    itemTemplate={ItemTemplate}
                />
            </div>
        </div>
    );
});
