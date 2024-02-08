const React = require("react");

const PropTypes = require("prop-types");
const {preventDefault} = require("../utils/html.js");
const Validate = require("./form/validate.js");

const Head = require("./helpers/head.js");
const FileInput = require("./fileinput.js");
const Columns = require("./bulma/columns.js");
const Column = require("./bulma/column.js");

class SessionCreation extends React.Component {
    /* eslint-disable-next-line max-lines-per-function */
  constructor(props) {
    super(props);
    this.state = {
      session: null,
      // eslint-disable-next-line camelcase
      old_session: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.handlePisteChange = this.handlePisteChange.bind(this);
    this.handleValidateClicked = this.handleValidateClicked.bind(this);
    this.mainFormRef = React.createRef();
  }

  handleChange(evt) {
    this.setState({[evt.target.name]: evt.target.value});
  }

  onFileChange(evt) {
    if (evt.target.files.length) {
      /* eslint-disable-next-line camelcase */
      this.setState({session: evt.target.files[0]});
    }
  }

  handlePisteChange(evt) {
    this.setState(() => {
      const el = evt.target;
      const piste = this.props.pistes.rows.find(i => `${i.id}` === el.value);
      return {piste};
    });
  }

  handleValidateClicked(evt) {
    preventDefault(evt);
    if (this.mainFormRef.current.reportValidity()) {
      this.mainFormRef.current.submit();
    }
  }

  _renderFileInput() {
    return <Columns>
      <Column size={Column.Sizes.half}>
        <div className="field">
          <label className="label">Résultat de la session</label>
          <div className="control">
            <FileInput
              name="session"
              label="Glisser la pièce jointe"
              doc={this.state.session}
              handleFileChange={this.onFileChange}
            />
            <input
              type="hidden"
              name="old_session"
              defaultValue={this.state.old_session
                ? this.state.old_session.id
                : 0}
            />
          </div>
        </div>
      </Column>
    </Columns>;
  }

  _renderInfos() {
    return <div className="is-flex">
      <div className="mr-3">
        <div className="field">
          <div className="select is-fullwidth">
            <select
              name="piste"
              defaultValue={"default"}
              data-list="piste"
              onChange={this.handlePisteChange}
            >
              <option
                key="default"
                value="default"
              >
                Choississez une piste
              </option>;
              {this.props.pistes.rows.map(piste => <option
                key={piste.id}
                value={`${piste.id}`}
              >
                {`${piste.id}`}
              </option>)}
            </select>
          </div>
        </div>
      </div>
    </div>;
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
        action="/session/new"
        encType="multipart/form-data"
      >
        <Head img="/images/timetable.png">
          Enregistrer une session
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
SessionCreation.displayName = "SessionCreation";
SessionCreation.propTypes = {pistes: PropTypes.object.isRequired};

module.exports = SessionCreation;

/* <div className="field">
              <div className="select is-fullwidth">
                <select
                  name={`executors[${index}][piste][2]`}
                  defaultValue={item.piste[2]}
                  data-list="executors"
                  data-scope="piste"
                  data-index={index}
                  data-key={item.key}
                  data-pisteindex={2}
                  onChange={this.handleItstChange}
                >
                  <option
                    key="default"
                    value="default"
                  >
                    Choississez une piste
                  </option>;
                  {this.props.pistes.rows.map(piste => {
                    if (piste.data.piste.firstName === item.firstName
                      && piste.data.piste.lastName === item.lastName) {
                      return <option
                        key={piste.id}
                        value={`${piste.data.reference}`}
                      >
                        {`${piste.data.reference}`}
                      </option>;
                    }
                    return null;
                  })}
                </select>
              </div>
            </div> */
