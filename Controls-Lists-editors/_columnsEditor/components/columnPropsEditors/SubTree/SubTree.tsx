import { Provider } from 'Controls-DataEnv/context';
import {
    Content,
    ISubTreeProps,
} from 'Controls-Lists-editors/_columnsEditor/components/columnPropsEditors/SubTree/Content';

/**
 * Редактор поддерева, относящегося к папке
 */

export function SubTree(props: ISubTreeProps): JSX.Element {
    const { loadData, loadConfig } = props;
    return (
        <Provider loadResults={loadData} configs={loadConfig}>
            <Content {...props} />
        </Provider>
    );
}
