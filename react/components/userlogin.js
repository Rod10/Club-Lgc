const React = require("react");
const PropTypes = require("prop-types");

const Input = require("./bulma/input.js");

class UserLogin extends React.Component {
  static renderPasswordChangedArticle() {
    return <article className="message is-success"> <div className="message-body">
      <span>✅ Mot de passe modifié avec succès.</span>
    </div> </article>;
  }

  static renderInvalidPassword() {
    return <article className="message is-danger"> <div className="message-body">
      <span>❌ Nom d'utilisateur ou mot de passe invalide.</span>
    </div> </article>;
  }

  render() {
    return <div className="content">
      <div className="login-box">
        <div className="quizz-box">

          <h2 className="title">Connexion</h2>

          {this.props.passwordChanged
                        && UserLogin.renderPasswordChangedArticle()}
          {this.props.error
                        && UserLogin.renderInvalidPassword()}

          <form
            method="POST"
            action={`/login${this.props.query}`}
          >
            <Input
              label="Nom d'utilisateur"
              type="username"
              name="username"
              placeholder="Nom d'utilisateur"
              defaultValue={this.props.username || ""}
              autoFocus
            />
            <Input
              label="Mot de passe"
              type="password"
              name="password"
              placeholder="Mot de passe"
            />
            <br />
            <div className="has-text-centered">
              <div>
                <button type="submit" className="button is-info">
                  <b>Se connecter</b>
                  <span className="icon is-small">
                    <i className="fa fa-arrow-right" />
                  </span>
                </button>
              </div>
              <br />
              <div>
                <a href="password-reset" className="link">Mot de passe oublié ?</a>
              </div>
              <div>
                <a href="register" className="link">Pas encore inscrit ?</a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>;
  }
}
UserLogin.displayName = "UserLogin";
UserLogin.propTypes = {
  username: PropTypes.string,
  error: PropTypes.bool,
  passwordChanged: PropTypes.bool,
  query: PropTypes.string,
};
UserLogin.defaultProps = {
  username: "",
  error: false,
  passwordChanged: false,
  query: "",
};

module.exports = UserLogin;
