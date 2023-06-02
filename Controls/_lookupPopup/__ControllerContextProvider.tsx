/**
 * @kaizen_zone 1194f522-9bc3-40d6-a1ca-71248cb8fbea
 */
import { List, RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { TemplateFunction } from 'UI/Base';
import * as React from 'react';
import { ControllerContext } from './__ControllerContext';
import { TInternalProps } from 'UICore/Executor';

interface IProps extends TInternalProps {
    selectedItems?: List<Model> | RecordSet;
    content: TemplateFunction;
}
interface IState {
    selectedItems: List<Model> | RecordSet;
    setSelectedItems: (selectedItems: List<Model> | RecordSet) => void;
}

export default class ControllerContextProvider extends React.Component<
    IProps,
    IState
> {
    private itemsVersion: number;

    constructor(props: IProps) {
        super(props);

        this.itemsVersion = props.selectedItems.getVersion();
        this.state = {
            selectedItems: props.selectedItems, // данные переместились в state
            setSelectedItems: (selectedItems) => {
                this.setState({ selectedItems }); // в сеттере обновляем state для перерисовки
            },
        };
    }
    componentDidUpdate(prevProps: Readonly<IProps>): void {
        if (
            this.props.selectedItems !== prevProps.selectedItems ||
            (this.props.selectedItems &&
                this.itemsVersion !== this.props.selectedItems.getVersion())
        ) {
            this.itemsVersion = this.props.selectedItems.getVersion();
            this.state.setSelectedItems(this.props.selectedItems);
        }
    }
    // используем Provider контекста для передачи данных в контекст
    render(): React.ReactElement {
        return (
            <ControllerContext.Provider value={this.state}>
                <this.props.content {...this.props} />
            </ControllerContext.Provider>
        );
    }
}
