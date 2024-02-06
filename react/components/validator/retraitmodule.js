const React = require("react");
const PropTypes = require("prop-types");

const StartModule = require("./startmodule.js");

class RetraitModule extends StartModule {
  constructor(props) {
    super(props);
    this.action = "retrait";
    this.icon = "file-text-o";
    this.label = "Demander retrait conduite";
    this.buttonText = "Demander";
    this.ready = props.valid.opIsValid && !props.valid.notReady.length;
    if (this.ready) {
      this.mClass = "";
      this.modal = {
        cancelText: "Annuler",
        confirmText: "DEMANDER RETRAIT CONDUITE",
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

  _renderModalContent() {
    const v = this.props.valid;
    if (v.opIsValid && !v.notReady.length) {
      return <div>
        <p>Demander l'avis de retrait de conduite au chargé de conduite.</p>
        <p>Une fois la demande effectuée, l'opération ne peut plus être modifiée.</p>
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
      <p>
        <span>Au moins une des opérations liée n'est pas prête pour démarrer.</span>
      </p>
      <p>Opérations non prêtes</p>
      <ul>
        {v.notReady.map(e => <li key={`nr${e.id}`}>
          <a href={`/society/operation/${e.id}`}>{e.reference}</a>
        </li>)}
      </ul>
    </div>;
  }
}
RetraitModule.displayName = "RetraitModule";
RetraitModule.propTypes = {valid: PropTypes.object.isRequired};

module.exports = RetraitModule;
