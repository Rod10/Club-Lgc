const React = require("react");
const PropTypes = require("prop-types");

class NewBaseNavbar extends React.Component {
  static _renderLogo(src, alt) {
    return <img
      src={src}
      alt={alt || "Edwin"}
      height={32}
    />;
  }

  static _renderScrollbarButton(show, opened, handle) {
    if (show === false) {
      return null;
    }
    return <div
      className={opened ? "scrollbar-button opened" : "scrollbar-button"}
      onClick={handle}
    >
      <span />
      <span />
      <span />
    </div>;
  }

  _renderBrand() {
    return <div className="navbar-brand">
      <a className="navbar-item logo" href={this.props.base}>
        {NewBaseNavbar._renderLogo(
          this.props.logo
            ? `/logos/${this.props.logo}`
            : this.props.defaultLogo,
          this.props.logoTitle,
        )}
      </a>
      {this.props.brandContent}
    </div>;
  }

  render() {
    return <div
      className="navbar is-fixed-top is-transparent"
      role="navigation"
    >
      <div className="container is-fluid">
        {NewBaseNavbar._renderScrollbarButton(
          this.props.hasScrollBar,
          this.props.scrollBarOpened,
          this.props.scrollBarOnClick,
        )}
        {this._renderBrand()}
      </div>
    </div>;
  }
}
NewBaseNavbar.displayName = "NewBaseNavbar";
NewBaseNavbar.propTypes = {
  base: PropTypes.string.isRequired,
  brandContent: PropTypes.node,
  hasScrollBar: PropTypes.bool,
  scrollBarOpened: PropTypes.bool,
  scrollBarOnClick: PropTypes.func,
  hrefLogout: PropTypes.string,
  defaultLogo: PropTypes.string,
  logo: PropTypes.string,
  logoTitle: PropTypes.string,
  navbarLeft: PropTypes.node,
  navbarCenter: PropTypes.node,
  navbarRight: PropTypes.node,
  user: PropTypes.object,
};
NewBaseNavbar.defaultProps = {
  brandContent: undefined,
  hasScrollBar: false,
  scrollBarOpened: false,
  scrollBarOnClick: undefined,
  hrefLogout: undefined,
  defaultLogo: undefined,
  logo: undefined,
  logoTitle: undefined,
  navbarLeft: undefined,
  navbarCenter: undefined,
  navbarRight: undefined,
  user: undefined,
};

module.exports = NewBaseNavbar;