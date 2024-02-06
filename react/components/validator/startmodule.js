const React = require("react");
const PropTypes = require("prop-types");

const ValidatorModule = require("./validatormodule.js");

class StartModule extends ValidatorModule {
  constructor(props) {
    super(props);
    this.action = "start";
    this.hasModal = true;
    this.icon = "check-circle-o";
    this.label = "Démarrer l'opération";
    this.buttonText = "Démarrer";
    this.ready = props.valid.opIsValid && !props.valid.notReady.length;
    if (this.ready) {
      this.mClass = "";
      this.modal = {
        cancelText: "Annuler",
        confirmText: "JE VALIDE",
        type: "confirm",
      };
    } else {
      this.mClass = " disabled";
      this.modal = {
        confirmText: "Fermer",
        type: "alert",
      };
      this.handleConfirmClick = this.handleCloseClick;
    }

    this._renderModalContent = this._renderModalContent.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.valid !== this.props.valid) {
      this.modal.type = this.props.valid ? "confirm" : "alert";
      this.mClass = this.props.valid ? "" : " disabled";
      this.setState({});
    }
  }

  _renderModalContent() {
    const v = this.props.valid;
    if (v.opIsValid && !v.notReady.length) {
      return <div>
        <p>
          <span>La validation de ce document fait office de </span>
          <span className="has-text-danger">signature certifiée et définitive.</span>
        </p>
        <p><span> Une fois validée, ces données ne peuvent pas être modifiées.</span></p>
        <p><span className="has-text-danger">Cette action est irréversible.</span></p>
      </div>;
    } else if (!v.opIsValid) {
      return <div>
        <p>Tous les opérateurs nécessaire pour commencer l'opération ne sont pas sélectionnés.</p>
        <p>
          <span>Rendez vous sur la page de </span>
          <a href="operators">sélection des opérateurs</a>
          <span> pour ajouter les opérateurs manquants</span>
        </p>
      </div>;
    }
    return <div>
      <p>Au moins une des opérations liée n'est pas prête pour démarrer.</p>
      <p>Opérations non prêtes</p>
      <ul>{v.notReady.map(e => <li key={`nr${e.id}`}>
        <a href={`/society/operation/${e.id}`}>{e.reference}</a>
      </li>)}</ul>
    </div>;
  }
}
StartModule.displayName = "StartModule";
StartModule.propTypes = {valid: PropTypes.object.isRequired};

module.exports = StartModule;
