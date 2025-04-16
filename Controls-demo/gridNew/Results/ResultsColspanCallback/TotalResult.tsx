import { ResultColumnTemplate } from 'Controls/grid';

export default function TotalResult(props) {
    return (
        <ResultColumnTemplate
            {...props}
            contentTemplate={(contentProps) => {
                return (
                    <>
                        <b>Общая сумма:</b> {contentProps.results.get('total')}
                    </>
                );
            }}
        ></ResultColumnTemplate>
    );
}
