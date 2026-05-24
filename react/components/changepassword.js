const React = require("react");

const Title = require("./bulma/title.js");
const Input = require("./bulma/input.js");
const Field = require("./bulma/field.js");
const Button = require("./bulma/button.js");

const PasswordInput = require("./passwordinput.js");

/* value range [0, 4] */
const MIN_PASSWORD_STRENGTH = 3;

class ChangePassword extends React.Component {
  static async loadZXCVBNOptions() {
    const zxcvbnCommonPackage = await import("@zxcvbn-ts/language-common");
    const zxcvbnEnPackage = await import("@zxcvbn-ts/language-en");
    const zxcvbnFrPackage = await import("@zxcvbn-ts/language-fr");
    return {
      dictionnary: {
        ...zxcvbnCommonPackage,
        ...zxcvbnEnPackage,
        ...zxcvbnFrPackage,
      },
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      translations: zxcvbnEnPackage,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      previousPassword: "",
      options: null,
      password: "",
      passwordConfirm: "",
      passwordStrength: 0,
      pending: false,
      redirect: undefined,
      resetPasswordToken: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitClick = this.handleSubmitClick.bind(this);
  }

  handlePasswordChange = ({password, passwordStrength}) => {
    this.setState({
      password,
      passwordStrength,
    });
  };

  handleChange = evt => {
    this.setState({[evt.target.name]: evt.target.value});
  };

  handleSubmitClick = evt => {
    evt.preventDefault(evt);
    this.setState({pending: true});
  };

  render() {
    const buttonDisabled = this.state.pending
      || this.state.passwordStrength < MIN_PASSWORD_STRENGTH
      || this.state.password !== this.state.passwordConfirm;
    return <form method="post">
      <div>
        <Title centered size={4}>Changez votre mot de passe</Title>
        <p>Edwin nécessite maintenant l'utilisation de mot de passe "fort" et votre mot de passe
          actuel est considéré comme "faible".</p>
        <p>Saisissez un mot de passe jusqu'à ce que l'indicateur sous le champ de mot de passe
          devienne jaune, ou idéalement vert.</p>
      </div>
      <PasswordInput
        label="Nouveau mot de passe"
        previousPassword={this.state.previousPassword}
        onChange={this.handlePasswordChange}
        value={this.state.password}
      />
      <Input
        label="Confirmation mot de passe"
        placeholder="Confirmation mot de passe"
        name="passwordConfirm"
        type="password"
        value={this.state.passwordConfirm}
        onChange={this.handleChange}
      />
      <Field
        className="is-grouped is-grouped-centered"
        noLabel
      >
        <Button
          className={this.state.pending ? "is-loading" : ""}
          disabled={buttonDisabled}
          label="Valider mot de passe"
          type="submit"
        />
      </Field>
      <div className="content">
        <p>Un mot de passe fort n'est pas forcément compliqué, vous n'êtes pas obligé d'avoir des caractères spéciaux, majuscules et des chiffres si votre mot de passe est long. Avoir ces caractères rend les mots de passe plus fort mais à moins d'utiliser un gestionnaire de mot de passe, le mot de passe risque de devenir compliqué à retenir pour vous et vous pourriez être tenté de l'écrire sur un papier ce qui est une mauvaise pratique.</p>
        <p>Voici quelques recommandations :</p>
        <ul>
          <li>mot de passe d'au moins 12 caractères de long</li>
          <li>utilisez une phrase ou une succession de mots</li>
          <li>si vous mettez des majuscules, chiffres ou caractères spéciaux, évitez la séquence [majuscule][minuscules][chiffres][caractères spéciaux], mélangez-les</li>
        </ul>
      </div>
    </form>;
  }
}

ChangePassword.propTypes = {};
ChangePassword.displayName = "ChangePassword";

module.exports = ChangePassword;
