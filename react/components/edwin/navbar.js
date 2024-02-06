const React = require("react");
const PropTypes = require("prop-types");

const BaseNavbar = require("../basenavbar.js");

const Options = require("../../../express/utils/options.js");
const ExpectedOptions = require("../../../express/constants/expectedoptions.js");
const ExpectedRoles = require("../../../express/constants/expectedroles.js");
const EdwinLinks = require("../../../express/constants/links.js");

const {hasOneOfRoles} = require("../../../express/utils/role.js");
const Roles = require("../../../express/constants/roles.js");
const SwitchCitySelectionModal = require("../switchcityselectionmodal.js");
const Search = require("./search.js");

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    if (props.society) {
      this.options = props.society.options;
    } else {
      this.options = new Options();
    }
    if (!(this.options instanceof Options)) {
      this.options = new Options(this.options);
    }

    this.showSwitcher = this.options.hasOneOf(ExpectedOptions.preEdwin);
    this.showCitySwitcher = hasOneOfRoles(props.user, Roles.SWITCH) && props.subsSocieties !== null;
    if (this.showSwitcher && props.user) {
      this.showSwitcher = props.user.roles
        .map(e => typeof e === "string" ? e : e.type)
        .find(e => ExpectedRoles.preEdwin.includes(e));
    }

    this.state = {
      modal: null,
      cities: [],
      subsSocieties: props.subsSocieties,
    };

    this.openCitySwitcherModal = this.openCitySwitcherModal.bind(this);
    this.onCityChange = this.onCityChange.bind(this);
  }

  openCitySwitcherModal() {
    this.setState(prevState => ({modal: prevState.modal === "city" ? null : "city"}));
  }

  onCityChange(cities) {
    this.setState({
      cities: cities || [],
      modal: null,
    });
  }

  _renderBrandContent() {
    const sub = this.props.society.subscription;
    return <a className="navbar-item" href="/society/">
      <strong>{this.props.society.parentId
        ? `${this.props.society.employer} - ${this.props.society.city}`
        : this.props.society.employer}</strong>
      <span className="credits" title="Crédits utilisé / total">
        {sub && `${Math.floor(sub.consumption)} / ${sub.operation}`}
      </span>
    </a>;
  }

  _renderDropdownMenu(group) {
    return <div className="navbar-item has-dropdown is-hoverable">
      <a className="navbar-link">
        <img src={group.logo} />
      </a>
      <div className="navbar-dropdown is-boxed">
        {group.routes
          .filter(route => !route.canAccess || route.canAccess(this.props.society, this.props.user))
          .map(route => {
            const href = route.query
              ? `${route.href}?${route.query}`
              : route.href;
            return <a
              key={href}
              className="navbar-item"
              href={href}
            >{route.label}</a>;
          })}
      </div>
    </div>;
  }

  _renderNavbarLeft() {
    const mainDashboard = EdwinLinks.monitoring.routes[0];
    return <>
      <a
        className="navbar-item"
        href={`${mainDashboard.href}?${mainDashboard.query}`}
      >Opérations</a>
      {this._renderDropdownMenu(EdwinLinks.operations)}
      {this._renderDropdownMenu(EdwinLinks.operators)}
      {this._renderDropdownMenu(EdwinLinks.monitoring)}
    </>;
  }

  _renderNavbarRight() {
    const sub = this.props.society.subscription;
    return <>
      {sub && <div className="navbar-item">
        <img src={`/images/svg/picto_${sub.planType.toLowerCase()}_W.svg`} />
      </div>}
      <div className="navbar-item">
        <Search />
      </div>
      {this.showCitySwitcher && <div className="navbar-item is-hoverable">
        <a
          onClick={this.openCitySwitcherModal}
          title="Changer de ville"
        >
          <span className="icon"><i className="fa fa-lg fa-city" style={{color: "#ffffff"}} /></span>
        </a>
        <SwitchCitySelectionModal
          visible={this.state.modal === "city"}
          onCloseClick={this.openCitySwitcherModal}
          changeCity={this.onCityChange}
          cities={this.state.cities}
          subsSocieties={this.state.subsSocieties}
        />
      </div>}
      {this.showSwitcher && <div className="navbar-item has-dropdown is-hoverable">
        <a className="navbar-link">Aller</a>
        <div className="navbar-dropdown is-boxed">
          <a className="navbar-item" href="/society/pre-edwin">Pre-Edwin</a>
        </div>
      </div>}
    </>;
  }

  render() {
    return <BaseNavbar
      base="/society"
      brandContent={this._renderBrandContent()}
      burgerLogo="/small_logo_light.png"
      logo={this.props.society.logo}
      logoTitle={this.props.society.parentId
        ? `${this.props.society.employer} - ${this.props.society.city}`
        : this.props.society.employer}
      navbarLeft={this._renderNavbarLeft()}
      navbarRight={this._renderNavbarRight()}
      user={this.props.user}
    />;
  }
}
Navbar.displayName = "Navbar";
Navbar.propTypes = {
  society: PropTypes.object,
  user: PropTypes.object.isRequired,
  subsSocieties: PropTypes.object,
};
Navbar.defaultProps = {
  society: undefined,
  subsSocieties: undefined,
};

module.exports = Navbar;
