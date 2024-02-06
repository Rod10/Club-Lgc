const React = require("react");
const PropTypes = require("prop-types");

const Notifications = require("../bulma/notifications.js");
const ContributorList = require("../contributorlist/index.js");

const Head = require("../helpers/head.js");

class OperatorsArchive extends React.Component {
  render() {
    return <div className="container is-fluid">
      <div>
        <Head img="/images/icons/address-card-solid.svg">
          Archive des opérateurs
        </Head>
        <div>
          <ContributorList {...this.props} />
        </div>
      </div>
      <Notifications />
    </div>;
  }
}
OperatorsArchive.displayName = "OperatorsArchive";
/* eslint-disable react/no-unused-prop-types */
OperatorsArchive.propTypes = {
  alreadyExists: PropTypes.bool,
  canManageRights: PropTypes.bool,
  functions: PropTypes.array.isRequired,
  operator: PropTypes.object,
  nbEmail: PropTypes.number,
  newOperator: PropTypes.bool,
  preEdwin: PropTypes.bool,
};
/* eslint-enable react/no-unused-prop-types */
OperatorsArchive.defaultProps = {
  alreadyExists: false,
  canManageRights: false,
  nbEmail: undefined,
  newOperator: false,
  operator: undefined,
  preEdwin: false,
};

module.exports = OperatorsArchive;
