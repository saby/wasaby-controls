import { ResultColumnTemplate } from 'Controls/grid';

export default function CountResult(props) {
    return (
        <ResultColumnTemplate
            {...props}
            contentTemplate={(contentProps) => {
                return contentProps.results.get('count');
            }}
        ></ResultColumnTemplate>
    );
}
