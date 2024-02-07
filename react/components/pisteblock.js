const df = require("dateformat");
const React = require("react");
const PropTypes = require("prop-types");

class PisteBlock extends React.Component {
  render() {
    return <div className="box slide-in is-clickable">
      <div className="columns is-flex">
        <div className="column">
          <div>
            <a>{this.props.piste.id}</a> •&nbsp;
            <b>{df(this.props.piste.creationDate, "dd/mm/yyyy")}</b>&nbsp;
          </div>
          <div>
            <b>Dalles: {this.props.piste.dalles}</b>
          </div>
          <div>
            <b>Tours: {this.props.piste.tours}</b>
          </div>
        </div>
        <div className="column">
          <a
            href={`/piste/${this.props.piste.id}/view`}
            rel="noreferrer"
            title="Visualiser"
          >
            <span className="icon"><i className="fa fa-eye" /></span>
          </a>
          <a
            href={`/piste/${this.props.piste.id}/delete`}
            rel="noreferrer"
            title="Supprimer"
          >
            <span className="icon"><i className="fa fa-trash" /></span>
          </a>
        </div>
      </div>
    </div>;
  }
}

PisteBlock.displayName = "PisteBlock";
PisteBlock.propTypes = {piste: PropTypes.object.isRequired};
module.exports = PisteBlock;
