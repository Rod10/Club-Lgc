const React = require("react");
const PropTypes = require("prop-types");

const Notifications = require("../bulma/notifications.js");

const NewOperatorCreation = require("../newoperatorcreation.js");

class NewOperatorsManagement extends React.Component {
  render() {
    return <div className="container is-fluid">
      <div className="content">
        <NewOperatorCreation {...this.props} />
      </div>
      <Notifications />
    </div>;
  }
}
NewOperatorsManagement.displayName = "NewOperatorsManagement";
/* eslint-disable react/no-unused-prop-types */
NewOperatorsManagement.propTypes = {
  alreadyExists: PropTypes.bool,
  canManageRights: PropTypes.bool,
  functions: PropTypes.array.isRequired,
  operator: PropTypes.object,
  nbEmail: PropTypes.number,
  newOperator: PropTypes.bool,
  preEdwin: PropTypes.bool,
  useSimplified: PropTypes.bool,
};
/* eslint-enable react/no-unused-prop-types */
NewOperatorsManagement.defaultProps = {
  alreadyExists: false,
  canManageRights: false,
  nbEmail: undefined,
  newOperator: false,
  operator: undefined,
  preEdwin: false,
  useSimplified: false,
};

module.exports = NewOperatorsManagement;
