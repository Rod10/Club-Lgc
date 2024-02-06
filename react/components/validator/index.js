/* eslint-disable max-classes-per-file */
const React = require("react");
const PropTypes = require("prop-types");

const Modal = require("../modal.js");

const DeleteModule = require("./deletemodule.js");
const LinkOperation = require("./linkoperation.js");
const ModifyModule = require("./modifymodule.js");
const RetraitModule = require("./retraitmodule.js");
const StartModule = require("./startmodule.js");
const UnlinkOperation = require("./unlinkoperation.js");

class Validator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {alert: false};
    this.handleAlertClick = this.handleAlertClick.bind(this);
    this.openAlert = this.openAlert.bind(this);
  }

  openAlert() {
    this.setState({alert: true});
  }

  /* eslint-disable-next-line class-methods-use-this */
  handleAlertClick() {
    /* eslint-disable-next-line no-self-assign */
    window.location = window.location;
  }

  render() {
    const props = {
      openAlert: this.openAlert,
      operation: this.props.operation,
      valid: this.props.valid,
    };

    let block;
    if (!this.props.hideStart) {
      if (this.props.showRetrait) {
        block = <RetraitModule {...props} />;
      } else {
        block = <StartModule {...props} />;
      }
    }

    return <div className="is-flex is-justify-content-flex-end is-flex-wrap-wrap" style={{gap: 10}}>
      <DeleteModule {...props} />
      <ModifyModule {...props} />
      {this.props.showLink && <LinkOperation {...props} />}
      {this.props.showLink && <UnlinkOperation {...props} />}
      {block}
      <Modal
        visible={this.state.alert}
        type="alert"
        confirmText="Recharger la page"
        onConfirm={this.handleAlertClick}
      >
        <p>Une erreur est survenue lors de la validation, rechargez la page et ré-essayez</p>
        <p>Si le problème persiste, merci de contacter les responsables du site.</p>
      </Modal>
    </div>;
  }
}
Validator.displayName = "Validator";
Validator.propTypes = {
  hideStart: PropTypes.bool,
  operation: PropTypes.object.isRequired,
  showLink: PropTypes.bool,
  showRetrait: PropTypes.bool,
  valid: PropTypes.object.isRequired,
};
Validator.defaultProps = {
  hideStart: false,
  showLink: false,
  showRetrait: false,
};

module.exports = Validator;
