/* global axios */
const React = require("react");
const PropTypes = require("prop-types");

const {OK} = require("../../../express/utils/error.js");

const {preventDefault} = require("../../utils/html.js");
const Icon = require("../bulma/icon.js");
const Modal = require("../modal.js");

class ValidatorModule extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      pending: false,
    };
    this.linkBase = `/society/operation/${this.props.operation.id}/`;

    this.handleClick = this.handleClick.bind(this);
    this.handleConfirmClick = this.handleConfirmClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this._renderModal = this._renderModal.bind(this);
  }

  handleClick(evt) {
    preventDefault(evt);
    this.setState({modal: true});
  }

  handleConfirmClick() {
    if (this.state.pending) return;

    this.setState({pending: true}, () => {
      axios.post(`${this.linkBase}${this.action}`)
        .then(response => {
          if (response.status === OK) {
            window.location = response.data.redirect;
          } else {
            this.setState({modal: false, pending: false});
            this.props.openAlert();
          }
        })
        .catch(() => {
          this.setState({modal: false, pending: false});
          this.props.openAlert();
        });
    });
  }

  handleCloseClick() {
    this.setState({modal: false, pending: false});
  }

  _renderModal() {
    return <Modal
      visible={this.state.modal}
      pending={this.state.pending}
      type="confirm"
      onClose={this.handleCloseClick}
      onConfirm={this.handleConfirmClick}
      {...this.modal}
    >
      {this._renderModalContent()}
    </Modal>;
  }

  render() {
    return <div>
      {this.hasModal && this._renderModal()}
      <div className={`validate has-text-centered ${this.mClass}`}>
        <p>{this.label}</p>
        <figure>
          <Icon size="large" faSize="3x" icon={this.icon} />
        </figure>
        {this.buttonLink
          ? <a className="button is-info" href={this.buttonLink}>{this.buttonText}</a>
          : (
            <button
              type="button"
              className="button is-info"
              onClick={this.handleClick}
            >{this.buttonText}</button>
          )}
      </div>
    </div>;
  }
}
ValidatorModule.displayName = "ValidatorModule";
ValidatorModule.propTypes = {
  operation: PropTypes.object.isRequired,
  openAlert: PropTypes.func.isRequired,
};

module.exports = ValidatorModule;
