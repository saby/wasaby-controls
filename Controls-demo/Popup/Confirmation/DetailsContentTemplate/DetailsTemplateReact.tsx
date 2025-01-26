function DetailsTemplateReact(props) {
    return (
        <div>
            <div>
                Детальное <a href="#">описание</a>
            </div>
            <div>{props.text}</div>
        </div>
    );
}

export default DetailsTemplateReact;
