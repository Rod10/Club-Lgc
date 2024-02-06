const React = require("react");
const PropTypes = require("prop-types");

const Notifications = require("../bulma/notifications.js");

const ContributorList = require("../contributorlist/index.js");
const OperatorCreation = require("../operatorcreation.js");

const Head = require("../helpers/head.js");

class OperatorsManagement extends React.Component {
  render() {
    return <div className="container is-fluid">
      <div className="content">
        <OperatorCreation {...this.props} />
      </div>
      <div>
        <Head img="/images/icons/address-card-solid.svg">
          Opérateurs
        </Head>
        <div>
          <ContributorList {...this.props} />
        </div>
      </div>
      <Notifications />
    </div>;
  }
}
OperatorsManagement.displayName = "OperatorsManagement";
/* eslint-disable react/no-unused-prop-types */
OperatorsManagement.propTypes = {
  alreadyExists: PropTypes.bool,
  canManageRights: PropTypes.bool,
  functions: PropTypes.array.isRequired,
  operator: PropTypes.object,
  nbEmail: PropTypes.number,
  newOperator: PropTypes.bool,
  preEdwin: PropTypes.bool,
};
/* eslint-enable react/no-unused-prop-types */
OperatorsManagement.defaultProps = {
  alreadyExists: false,
  canManageRights: false,
  nbEmail: undefined,
  newOperator: false,
  operator: undefined,
  preEdwin: false,
};

module.exports = OperatorsManagement;
