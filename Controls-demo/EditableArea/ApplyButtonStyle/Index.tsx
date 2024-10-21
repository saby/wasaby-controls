import { forwardRef, LegacyRef, useMemo } from 'react';
import { main as editingObject } from '../Data';
import { View } from 'Controls/editableArea';
import { Text } from 'Controls/input';

function ContentTemplate(props) {
    return <div className="tw-flex">
        <Text contrastBackground={true} className="controls-Input_negativeOffset controls-margin_right-m"/>
        <props.buttonsTemplate/>
    </div>;
}

export default forwardRef(function ApplyButtonStyle(_, ref: LegacyRef<HTMLDivElement>) {
    const buttonStyles = useMemo(() => {
        return ['accent', 'unaccent'];
    }, []);
    return <div
        ref={ref}
        className="controlsDemo_fixedWidth500"
    >
        <div className="controlsDemo__wrapper controlsDemo_fixedWidth500 tw-flex tw-flex-col">
            {
                buttonStyles.map((buttonStyle) => {
                    return <View
                        className="controls-margin_bottom-m"
                        key={`item-${buttonStyle}`}
                        autoEdit={true}
                        editingObject={editingObject}
                        applyButtonStyle={buttonStyle}
                        children={<ContentTemplate/>}
                    />;
                })
            }
        </div>
    </div>;
});