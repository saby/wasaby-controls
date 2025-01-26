import dependencyTest from './testEnv/dependencyTest';
import {
    ANY_DISPLAY_LIBS,
    ANY_NEW_PUBLIC_COMPONENT_LIBS,
    ANY_OLD_PUBLIC_COMPONENT_LIBS,
    ANY_RENDER_LIBS,
    LibPath,
} from './testEnv/constants';

describe(LibPath.ListsCommonLogic, () => {
    dependencyTest(
        LibPath.ListsCommonLogic,
        [],
        [
            ...ANY_OLD_PUBLIC_COMPONENT_LIBS,
            ...ANY_RENDER_LIBS,
            ...ANY_NEW_PUBLIC_COMPONENT_LIBS,
            ...ANY_DISPLAY_LIBS,

            LibPath.ListVisualAspects,
            LibPath.ListWebReducers,
        ]
    );
});
