import { IDataContextOptions, Provider } from 'Controls-DataEnv/context';
import 'Controls/dataSource';

type TConfigs = Required<IDataContextOptions>['configs'];
type TLoadResults = Required<IDataContextOptions>['loadResults'];
export type TContextProps = {
    configs: TConfigs;
    loadResults: TLoadResults | null;
    children: JSX.Element;
};

export function ContextProvider({ children, configs, loadResults }: TContextProps) {
    return loadResults === null ? (
        <>'Loading...'</>
    ) : (
        <Provider configs={configs} loadResults={loadResults} children={children} />
    );
}
