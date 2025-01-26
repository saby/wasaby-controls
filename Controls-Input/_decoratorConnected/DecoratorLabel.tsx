import { InputLabel, IInputLabelProps } from 'Controls-Input/inputConnected';

interface IDecoratorLabelProps extends IInputLabelProps {
}

function DecoratorLabel(props: IDecoratorLabelProps) {
    return <InputLabel {...props} label={props.value ? props.label : undefined}/>;
}

DecoratorLabel.displayName = 'Controls-Input/decoratorConnected:DecoratorLabel';
export { DecoratorLabel };