import { useTheme } from 'UI/Contexts';
import { IComponentProps } from 'Controls/interface';

interface IRadioCircleProps extends IComponentProps {
    selected?: boolean;
}

export default function RadioCircle({ selected, className }: IRadioCircleProps) {
    const theme = useTheme();
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Слой_1"
            data-name="Слой 1"
            className={`${className} controls_toggle_theme-${theme}
      controls-Menu__row-radioCircle
      controls-Menu__row-radioCircle_${selected ? 'selected' : 'unselected'}`}
            viewBox="0 0 12 12"
        >
            <circle
                className="controls-Menu__row-radioCircle__borderCircle"
                cx="6"
                cy="6"
                r="3.5"
            />
            <circle
                className={`controls-Menu__row-radioCircle__innerCircle
                   controls-Menu__row-radioCircle__innerCircle_${
                       selected ? 'selected' : 'unselected'
                   }`}
                cx="6"
                cy="6"
                r="3"
            />
        </svg>
    );
}
