import { getPopupComponent } from 'Controls/popup';
import { Title } from 'Controls/heading';
import { forwardRef } from 'react';

function TemplateDemo(props, ref) {
    const getHeaderContentTemplate = () => {
        return (
            <div>
                <Title caption="Заголовок" />
            </div>
        );
    };

    const getBodyContentTemplate = () => {
        return (
            <div
                style={{
                    width: '200px',
                    margin: '5px',
                }}
            >
                Здесь распологается контент в bodyContentTemplate
            </div>
        );
    };

    const Component = getPopupComponent(props.popupComponentName);

    return (
        <Component
            ref={ref}
            headerContentTemplate={getHeaderContentTemplate()}
            bodyContentTemplate={getBodyContentTemplate()}
            allowAdaptive={props.allowAdaptive}
        />
    );
}

export default forwardRef(TemplateDemo);
