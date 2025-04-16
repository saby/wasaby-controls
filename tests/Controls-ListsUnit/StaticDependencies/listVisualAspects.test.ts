import dependencyTest from './testEnv/dependencyTest';
import {
    ANY_DISPLAY_LIBS,
    ANY_NEW_PUBLIC_COMPONENT_LIBS,
    ANY_OLD_PUBLIC_COMPONENT_LIBS,
    ANY_RENDER_LIBS,
    LibPath,
} from './testEnv/constants';

describe(LibPath.ListVisualAspects, () => {
    dependencyTest(
        LibPath.ListVisualAspects,
        [LibPath.ListsCommonLogic],
        [
            ...ANY_OLD_PUBLIC_COMPONENT_LIBS,
            ...ANY_NEW_PUBLIC_COMPONENT_LIBS,
            ...ANY_RENDER_LIBS,
            ...ANY_DISPLAY_LIBS,
            LibPath.ListWebReducers,
        ]
    );
});
