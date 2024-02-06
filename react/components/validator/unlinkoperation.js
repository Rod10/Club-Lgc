const React = require("react");

const ValidatorModule = require("./validatormodule.js");

class UnlinkOperation extends ValidatorModule {
  constructor(props) {
    super(props);
    this.action = "unlink";
    this.icon = "unlink";
    this.label = "Délier l'operation";
    this.buttonText = "Délier";
    this.hasModal = true;
    this.modal = {
      cancelText: "Annuler",
      confirmText: "DÉLIER",
    };

    this._renderModalContent = this._renderModalContent.bind(this);
  }

  /* eslint-disable-next-line class-methods-use-this */
  _renderModalContent() {
    return <div>
      <p>Souhaitez vous confirmer la suppression du lien de l'opération ?</p>
    </div>;
  }
}
UnlinkOperation.displayName = "UnlinkOperation";

module.exports = UnlinkOperation;
