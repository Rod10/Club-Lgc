const React = require("react");
const PropTypes = require("prop-types");

const Civilities = require("../../express/constants/civilities.js");

class BaseNavbar extends React.Component {
  static _renderLogo(src, alt) {
    return <img
      src={src}
      alt={alt || "Edwin"}
      height={25}
    />;
  }

  constructor(props) {
    super(props);

    this.state = {active: ""};

    this.handleBurgerClick = this.handleBurgerClick.bind(this);
  }

  handleBurgerClick() {
    this.setState(prevState => ({active: prevState.active ? "" : "is-active"}));
  }

  _renderBrand() {
    return <div className="navbar-brand">
      <a className="navbar-item logo" href={this.props.base}>
        {BaseNavbar._renderLogo(
          this.props.logo
            ? `/logos/${this.props.logo}`
            : "/images/small_logo_light.png",
          this.props.logoTitle,
        )}
      </a>
      {this.props.brandContent}
      {/* burger */}
      <button
        type="button"
        className={`button navbar-burger ${this.state.active}`}
        onClick={this.handleBurgerClick}
      >
        {this.props.burgerLogo
          ? BaseNavbar._renderLogo(`/images/${this.props.burgerLogo}`)
          : <>
            <span />
            <span />
            <span />
          </>}
      </button>
    </div>;
  }

  _renderUser() {
    const quit = <a
      className="navbar-item"
      href={this.props.hrefLogout || `${this.props.base}/logout`}
    >
      Quitter
    </a>;
    if (this.props.user) {
      const user = this.props.user;
      return <div className="navbar-item has-dropdown is-hoverable">
        <a className="navbar-link">{`${Civilities[user.civility].short} ${user.firstName} ${user.lastName}`}</a>
        <div className="navbar-dropdown is-boxed">{quit}</div>
      </div>;
    }
    return quit;
  }

  _renderMenu() {
    return <div className={`navbar-menu ${this.state.active}`}>
      {this.props.navbarLeft && <div className="navbar-start">
        {this.props.navbarLeft}
      </div>}
      <div className="navbar-end">
        {this.props.navbarRight}
        {this._renderUser()}
      </div>
    </div>;
  }

  render() {
    return <div
      className="navbar is-fixed-top is-transparent"
      role="navigation"
    >
      <div className="container is-fluid">
        {this._renderBrand()}
        {this._renderMenu()}
      </div>
    </div>;
  }
}
BaseNavbar.displayName = "BaseNavbar";
BaseNavbar.propTypes = {
  base: PropTypes.string.isRequired,
  brandContent: PropTypes.node,
  burgerLogo: PropTypes.string,
  hrefLogout: PropTypes.string,
  logo: PropTypes.string,
  logoTitle: PropTypes.string,
  navbarLeft: PropTypes.node,
  navbarRight: PropTypes.node,
  user: PropTypes.object,
};
BaseNavbar.defaultProps = {
  brandContent: undefined,
  burgerLogo: undefined,
  hrefLogout: undefined,
  logo: undefined,
  logoTitle: undefined,
  navbarLeft: undefined,
  navbarRight: undefined,
  user: undefined,
};

module.exports = BaseNavbar;
