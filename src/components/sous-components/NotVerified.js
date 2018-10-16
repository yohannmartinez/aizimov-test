import React from 'react';
import logo from '../../img/logo.svg'
import { Route , withRouter} from 'react-router-dom';


class NotVerify extends React.Component {
    constructor(props) {
        super(props);
        this.deconnexion = this.deconnexion.bind(this);
    }

    deconnexion() {
        localStorage.removeItem("token");
        this.props.history.push('/');
    }

    render() {
        return (
            <div className="not_verified_container">
                <div className="not_verified_div">
                    <img src={logo} className="not_verified_logo" />
                    <p className="not_verified_text">Votre compte est en cours de vérification, vous recevrez un mail lorsque ce sera terminé.</p>
                    <p>En cas de problème, envoyez un message à contact@spacefill.fr</p>
                    <button className="not_verified_button" onClick={this.deconnexion}>Retourner vers le site</button>
                </div>
            </div>
        )
    }
}

export default NotVerify;