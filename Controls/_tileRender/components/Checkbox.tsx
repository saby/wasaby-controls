import { ICheckboxProps } from 'Controls/interface';

export function Checkbox(props: ICheckboxProps) {
    if (props.checkboxVisibility === 'hidden') {
        return null;
    }

    return <div>checkbox</div>;
}
