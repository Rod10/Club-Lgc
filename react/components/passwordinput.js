const React = require("react");
const PropTypes = require("prop-types");
const {zxcvbn, zxcvbnOptions} = require("@zxcvbn-ts/core");

const {getScore} = require("../../express/utils/entropy.js");

const Field = require("./bulma/field.js");
const Input = require("./bulma/input.js");

const SUPER_WEAK = 1;
const WEAK = 2;
const MILD = 3;
const STRONG = 4;

const loadZXCVBNOptions = async () => {
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
    translations: zxcvbnEnPackage.translations,
    useLevenshteinDistance: true,
  };
};

class PasswordInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      computation: 0,
      error: undefined,
      passwordStrength: 0,
    };
  }

  componentDidMount() {
    this.lazyLoadDependencies();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.value !== prevProps.value) {
      this.doComputePasswordStrength(this.props.value);
    }
    if (this.state.computation !== prevState.computation) {
      this.props.onChange({
        password: this.props.value,
        passwordStrength: this.state.passwordStrength,
      });
    }
  }

  async lazyLoadDependencies() {
    try {
      const options = await loadZXCVBNOptions();
      zxcvbnOptions.setOptions(options);
    } catch (error) {
      this.setState({error: error.message});
    }
  }

  doComputePasswordStrength = password => {
    this.setState(prevState => ({
      computation: prevState.computation + 1,
      passwordStrength: this.props.previousPassword === this.props.value
        ? 0
        : Math.min(
          zxcvbn(password).score,
          getScore(password),
        ),
    }));
  };

  handlePasswordChange = evt => {
    this.props.onChange({
      password: evt.target.value,
      passwordStrength: 0,
    });
  };

  _renderPasswordStrength() {
    if (this.props.hideStrength) return null;
    return <div className="password-strength">
      <div className="scale">
        <div className={this.state.passwordStrength >= SUPER_WEAK ? "super-weak" : ""} />
        <div className={this.state.passwordStrength >= WEAK ? "weak" : ""} />
        <div className={this.state.passwordStrength >= MILD ? "mild" : ""} />
        <div className={this.state.passwordStrength >= STRONG ? "strong" : ""} />
      </div>
    </div>;
  }

  _renderSamePassword() {
    if (!this.props.previousPassword || this.props.previousPassword !== this.props.value) {
      return null;
    }
    return <p className="help is-danger">Le mot de passe ne peut pas être le même que le précédent</p>;
  }

  render() {
    return <Field label={this.props.label}>
      <Input
        className="is-login"
        id={this.props.inputId}
        noField
        placeholder="Mot de passe"
        type="password"
        name={this.props.name}
        value={this.props.value}
        onChange={this.handlePasswordChange}
      />
      {this._renderPasswordStrength()}
      {this._renderSamePassword()}
    </Field>;
  }
}
PasswordInput.displayName = "PasswordInput";
PasswordInput.propTypes = {
  hideStrength: PropTypes.bool,
  inputId: PropTypes.string.isRequired,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  previousPassword: PropTypes.string,
  value: PropTypes.string,
};
PasswordInput.defaultProps = {
  hideStrength: false,
  label: undefined,
  name: "password",
  previousPassword: undefined,
  value: "",
};

module.exports = PasswordInput;
