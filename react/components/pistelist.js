const React = require("react");
const PropTypes = require("prop-types");

const Columns = require("./bulma/columns.js");
const Column = require("./bulma/column.js");
const Button = require("./bulma/button.js");
const Icon = require("./bulma/icon.js");

const PisteBlock = require("./pisteblock.js");

class PisteList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {pistes: props.pistes};
  }

    /* eslint-disable-next-line max-lines-per-function */
  render() {
    const list = this.state.pistes.map(piste => <div
      className="mb-2"
      key={piste.id}
    >
      <PisteBlock
        key={piste.id}
        piste={piste}
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
                label="Nouvelle piste"
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
PisteList.displayName = "PisteList";
PisteList.propTypes = {pistes: PropTypes.array.isRequired};
PisteList.defaultProps = {};

module.exports = PisteList;
