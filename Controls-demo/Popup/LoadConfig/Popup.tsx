import { forwardRef } from 'react';
import { getPopupComponent } from 'Controls/popup';

function LoadConfig(props, ref) {
    const Component = getPopupComponent(props.popupComponentName);
    return (
        <Component
            ref={ref}
            headerContentTemplate={() => {
                return <div>{props.loadResult.popupConfig.title}</div>;
            }}
            bodyContentTemplate={() => {
                return (
                    <div
                        className="controlsDemo__flex"
                        style={{ width: '200px', height: '100px', padding: '10px' }}
                    >
                        {props.loadResult.popupConfig.text}
                    </div>
                );
            }}
        />
    );
}

export default forwardRef(LoadConfig);
