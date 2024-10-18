import { TemplateFunction } from 'UI/Base';
import * as React from 'react';
import { DataContext } from './_OptionsField';

interface IProps {
    content: TemplateFunction;
    options: object;
}

export default class OptionsFieldProvider extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }
    render(): React.ReactElement {
        return (
            <DataContext.Provider value={this.props.options}>
                <this.props.content {...this.props} />
            </DataContext.Provider>
        );
    }
}
