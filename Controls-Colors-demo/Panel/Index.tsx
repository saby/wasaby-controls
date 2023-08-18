import * as React from 'react';
import {Panel} from 'Controls-Colors/colormark';
import {items, palette} from '../data';
import 'css!Controls-Colors-demo/Style';

export default React.forwardRef(
    (props, ref: React.LegacyRef<HTMLDivElement>): React.ReactElement => {
    const [selectedKeys, setSelectedKeys] = React.useState(['1']);
    const onSelectedKeysChanged = React.useCallback((keys) => {
        setSelectedKeys(() => keys);
    }, []);
    return (
        <div className="tw-flex tw-justify-center controls-background-unaccented controls-padding_top-m
                        controls-padding_bottom-m"
        >
            <div ref={ref} className="Controls-Colors-demo_widthPanel_s controls-margin_left-3xl">
                <Panel items={items}
                       palette={palette}
                       selectedKeys={selectedKeys}
                       onSelectedKeysChanged={onSelectedKeysChanged}
                />
            </div>
        </div>
    );
});
