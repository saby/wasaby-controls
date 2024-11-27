import Async from 'Controls/Container/Async';

export default function phoneFlag(props: object) {
    return <Async templateName="Controls/flagSelector:View" templateOptions={props} />;
}
