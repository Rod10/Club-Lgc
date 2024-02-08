const React = require("react");

const {preventDefault} = require("../utils/html.js");
const Validate = require("./form/validate.js");

const Head = require("./helpers/head.js");
const FileInput = require("./fileinput.js");
const Title = require("./bulma/title.js");
const Columns = require("./bulma/columns.js");
const Column = require("./bulma/column.js");

class PisteCreation extends React.Component {
    /* eslint-disable-next-line max-lines-per-function */
  constructor(props) {
    super(props);

    this.state = {
      dalles: 0,
      plan: null,
      // eslint-disable-next-line camelcase
      old_plan: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.handleValidateClicked = this.handleValidateClicked.bind(this);
    this.mainFormRef = React.createRef();
  }

  handleChange(evt) {
    this.setState({[evt.target.name]: evt.target.value});
  }

  onFileChange(evt) {
    if (evt.target.files.length) {
      /* eslint-disable-next-line camelcase */
      this.setState({plan: evt.target.files[0]});
    }
  }

  handleValidateClicked(evt) {
    preventDefault(evt);
    if (this.mainFormRef.current.reportValidity()) {
      this.mainFormRef.current.submit();
    }
  }

  _renderInfos() {
    return <div className="is-flex">
      <div className="mr-3">
        <Title size={4} className="is-inline">Dalles: </Title>
        <input
          className="input is-inline"
          type="text"
          required
          name="dalles"
          placeholder="Nombre de dalles"
          onChange={this.handleChange}
          value={this.state.dalles}
        />
      </div>
    </div>;
  }

  _renderFileInput() {
    return <Columns>
      <Column size={Column.Sizes.half}>
        <div className="field">
          <label className="label">Plan de la piste</label>
          <div className="control">
            <FileInput
              name="plan"
              label="Glisser la pièce jointe"
              doc={this.state.plan}
              handleFileChange={this.onFileChange}
            />
            <input
              type="hidden"
              name="old_plan"
              defaultValue={this.state.old_plan
                ? this.state.old_plan.id
                : 0}
            />
          </div>
        </div>
      </Column>
    </Columns>;
  }

  _renderConfirmations() {
    return <Columns>
      <Column>
        <Validate
          color="themed"
          onClick={this.handleValidateClicked}
          label="Créer"
        />
      </Column>
    </Columns>;
  }

  render() {
    return <div className="container is-fluid">
      <form
        id="mainForm"
        ref={this.mainFormRef}
        method="POST"
        action="/piste/new"
        encType="multipart/form-data"
      >
        <Head img="/images/track.png">
          Créer une piste
        </Head>
        <br />
        {this._renderInfos()}
        {this._renderFileInput()}
        <hr />
        {this._renderConfirmations()}
      </form>
    </div>;
  }
}
PisteCreation.displayName = "PisteCreation";
module.exports = PisteCreation;
