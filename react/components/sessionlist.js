const React = require("react");
const PropTypes = require("prop-types");

const Columns = require("./bulma/columns.js");
const Column = require("./bulma/column.js");
const Button = require("./bulma/button.js");
const Icon = require("./bulma/icon.js");

const SessionBlock = require("./sessionblock.js");

class SessionList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {sessions: props.sessions};
  }

    /* eslint-disable-next-line max-lines-per-function */
  render() {
    const list = this.state.sessions.map(session => <div
      className="mb-2"
      key={session.id}
    >
      <SessionBlock
        key={session.id}
        session={session}
      />
    </div>);
    return <div className="container is-fluid">
      <div className="operator-list">
        <Columns>
          <Column>
            <div className="has-text-right">
              <Button
                className="has-text-weight-bold mr-3"
                type="themed"
                href={"new"}
                icon={<Icon size="small" icon="plus" />}
                label="Nouvelle session"
              />
            </div>
          </Column>
        </Columns>
        <Columns>
          <div className="column">
            <div className="content operator-scrollblock">
              {list}
            </div>
          </div>
        </Columns>
      </div>
    </div>;
  }
}
SessionList.displayName = "SessionList";
SessionList.propTypes = {sessions: PropTypes.array.isRequired};
SessionList.defaultProps = {};

module.exports = SessionList;
