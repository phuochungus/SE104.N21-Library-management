import "./CustomServiceCard.scss"

const CustomServiceCard = props => {

    return (<div className="card">
        {props.children}
    </div>);
}

export default CustomServiceCard;