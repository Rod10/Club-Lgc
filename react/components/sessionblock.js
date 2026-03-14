const df = require("dateformat");
const React = require("react");
const PropTypes = require("prop-types");

class SessionBlock extends React.Component {
  render() {
    return <div className="box slide-in is-clickable">
      <div className="columns is-flex">
        <div className="column">
          <div>
            <a>{this.props.session.id}</a> •&nbsp;
            <b>{df(this.props.session.creationDate, "dd/mm/yyyy")}</b>&nbsp;
          </div>
          <div>
            <b>Tours: {this.props.session.laps.length}</b>
          </div>
        </div>
        <div className="column">
          <a
            href={`/session/${this.props.session.id}/view`}
            rel="noreferrer"
            title="Visualiser"
          >
            <span className="icon"><i className="fa fa-eye" /></span>
          </a>
        </div>
      </div>
    </div>;
  }
}

SessionBlock.displayName = "SessionBlock";
SessionBlock.propTypes = {session: PropTypes.object.isRequired};
module.exports = SessionBlock;
