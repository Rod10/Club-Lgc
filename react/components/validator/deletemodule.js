const React = require("react");

const ValidatorModule = require("./validatormodule.js");

class DeleteModule extends ValidatorModule {
  constructor(props) {
    super(props);
    this.action = "delete";
    this.hasModal = true;
    this.icon = "trash";
    this.label = "Supprimer l'opération";
    this.buttonText = "Supprimer";
    this.mClass = "tomato-bg";
    this.modal = {
      cancelText: "Annuler",
      confirmText: "SUPPRIMER",
    };

    this._renderModalContent = this._renderModalContent.bind(this);
  }

  /* eslint-disable-next-line class-methods-use-this */
  _renderModalContent() {
    return <div>
      <p>
        <span>La suppression d'une opération est </span>
        <span className="has-text-danger">définitive</span>
        <span>.</span>
      </p>
      <p>Souhaitez vous confirmer la suppression ?</p>
    </div>;
  }
}
DeleteModule.displayName = "DeleteModule";

module.exports = DeleteModule;
