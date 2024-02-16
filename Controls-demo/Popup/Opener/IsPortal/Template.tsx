import Async from 'Controls/Container/Async';

export default function TemplateDemo(props) {
    return (
        <Async
            templateName={props.popupTemplateName}
            templateOptions={{
                bodyContentTemplate: (
                    <div>
                        Значение счетчика, обновляемое за пределами открытого окна: {props.counter}
                    </div>
                ),
                allowAdaptive: props.allowAdaptive,
            }}
            onClose={props.onClose}
            customEvents={['onClose']}
        />
    );
}
