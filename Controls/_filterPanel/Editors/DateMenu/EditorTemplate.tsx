import * as React from 'react';
import { IDateMenuOptions } from './IDateMenu';
import DropdownTemplate from './DropdownTemplate';

export default React.memo(
    React.forwardRef((props: IDateMenuOptions, ref) => {
        return (
            <div
                data-qa={props.dataQa}
                className={`ws-ellipsis controls-FilterViewPanel__basicEditor-cloud
                            controls-FilterViewPanel__basicEditor-cloud-${props.filterViewMode}`}
            >
                <DropdownTemplate
                    viewMode={props.viewMode}
                    filterViewMode={props.filterViewMode}
                    filterIndex={props.filterIndex}
                    fontColorStyle={props.fontColorStyle}
                    caption={props.caption}
                    extendedCaption={props.extendedCaption}
                    fontSize={props.fontSize}
                    items={props.items}
                    keyProperty={props.keyProperty}
                    displayProperty={props.displayProperty}
                    selectedKeys={props.selectedKeys}
                    attrs={props.attrs}
                    onItemClick={props.onItemClick}
                    underline="hidden"
                />
            </div>
        );
    })
);
