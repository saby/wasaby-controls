import PathContext from '../../contexts/ISolatedNodeContext';
import { useContext } from 'react';

export default function useCurrentContextLevelPath(): string[] {
    const pathState = useContext(PathContext);

    return pathState.path;
}
