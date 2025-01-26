import dependencyTest from './testEnv/dependencyTest';
import {
    ANY_NEW_PUBLIC_COMPONENT_LIBS,
    ANY_OLD_PUBLIC_COMPONENT_LIBS,
    ANY_RENDER_LIBS,
    LibPath,
} from './testEnv/constants';

describe(LibPath.GridDisplay, () => {
    dependencyTest(
        LibPath.GridDisplay,
        [],
        [
            ...ANY_OLD_PUBLIC_COMPONENT_LIBS,
            ...ANY_NEW_PUBLIC_COMPONENT_LIBS,

            ...ANY_RENDER_LIBS,

            LibPath.ListsCommonLogic,
            LibPath.ListVisualAspects,

            LibPath.TreeGridDisplay,
            LibPath.ListWebReducers,
        ]
    );
});
