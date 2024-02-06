const React = require("react");
const PropTypes = require("prop-types");

const Notifications = require("../bulma/notifications.js");
const NewContributorList = require("../contributorlist/newindex.js");

const Head = require("../helpers/head.js");

class NewOperatorsList extends React.Component {
  render() {
    return <div className="container is-fluid">
      <div>
        <Head img="/images/icons/address-card-solid.svg">
          Gestion des opérateurs
        </Head>
        <div>
          <NewContributorList {...this.props} />
        </div>
      </div>
      <Notifications />
    </div>;
  }
}
NewOperatorsList.displayName = "NewOperatorsList";
/* eslint-disable react/no-unused-prop-types */
NewOperatorsList.propTypes = {
  alreadyExists: PropTypes.bool,
  canManageRights: PropTypes.bool,
  functions: PropTypes.array.isRequired,
  operator: PropTypes.object,
  nbEmail: PropTypes.number,
  newOperator: PropTypes.bool,
  preEdwin: PropTypes.bool,
};
/* eslint-enable react/no-unused-prop-types */
NewOperatorsList.defaultProps = {
  alreadyExists: false,
  canManageRights: false,
  nbEmail: undefined,
  newOperator: false,
  operator: undefined,
  preEdwin: false,
};

module.exports = NewOperatorsList;
