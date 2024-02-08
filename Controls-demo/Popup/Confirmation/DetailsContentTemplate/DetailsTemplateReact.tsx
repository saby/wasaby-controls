function DetailsTemplateReact(props) {
    return (
        <div>
            <div>Детальное <a href="#">описание</a></div>
            <div>{props.text}</div>
        </div>
    );
};

DetailsTemplateReact.isReact = true;

export default DetailsTemplateReact;
