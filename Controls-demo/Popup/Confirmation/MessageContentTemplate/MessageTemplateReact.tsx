function MessageTemplateReact(props) {
    return (
        <div>
            <div>
                Согласовать <a href="#">документ</a>?
            </div>
            <div>{props.messageOptions.text}</div>
        </div>
    );
}

export default MessageTemplateReact;
