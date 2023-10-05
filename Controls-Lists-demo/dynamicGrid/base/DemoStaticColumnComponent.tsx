import * as React from 'react';
import { useItemData } from 'Controls/gridReact';
import { EditArrowComponent } from 'Controls/grid';

export default function DemoStaticColumnComponent(): React.ReactElement {
    const { renderValues, item } = useItemData(['fullName', 'job']);
    if (item.get('type') === true) {
        return (
            <div className="tw-flex tw-items-baseline">
                <div>
                    <div className="tw-truncate controls-fontweight-bold">{renderValues.fullName}</div>
                    <div className="tw-truncate controls-text-readonly">{renderValues.job}</div>
                </div>
                <EditArrowComponent backgroundStyle={'transparent'}/>
            </div>
        );
    }
    return (
        <span className="tw-flex tw-overflow-hidden tw-items-center">
            <div
                className={
                    'controlsListsDemo__dynamicGridBase-photo ' +
                    'controls-background-secondary-same ' +
                    'controls-margin_top-s controls-margin_bottom-s controls-margin_right-s'
                }
            ></div>
            <div className="tw-overflow-hidden">
                <div className="tw-truncate controls-fontweight-bold">{renderValues.fullName}</div>
                <div className="tw-truncate controls-text-readonly">{renderValues.job}</div>
            </div>
        </span>
    );
}
