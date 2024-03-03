import Async from 'Controls/Container/Async';
import { Title } from 'Controls/heading';

export default function TemplateDemo(props) {
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

    return (
        <Async
            templateName={props.popupTemplateName}
            templateOptions={{
                headerContentTemplate: getHeaderContentTemplate(),
                bodyContentTemplate: getBodyContentTemplate(),
                allowAdaptive: props.allowAdaptive,
            }}
            onClose={props.onClose}
            customEvents={['onClose']}
        />
    );
}
