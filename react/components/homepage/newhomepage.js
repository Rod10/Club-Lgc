const React = require("react");
const PropTypes = require("prop-types");

const {
  Chart, CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  registerables,
} = require("chart.js");
const Title = require("../bulma/title.js");
const Columns = require("../bulma/columns.js");
const Column = require("../bulma/column.js");

class Homepage extends React.Component {
  constructor(props) {
    super(props);

    const piste = props.piste ? props.piste : {
      path: "",
      tours: 0,
    };

    const session = props.session ? props.session : {tours: 0};

    this.state = {
      piste,
      session,
    };
    this.charts = [];
    if (this.props.graphs) {
      this.props.graphs.forEach(graph => {
        this.charts[graph.label] = React.createRef();
      });
    }
  }

  componentDidMount() {
    Chart.register(CategoryScale);
    Chart.register(LinearScale);
    Chart.register(BarController);
    Chart.register(BarElement);
    Chart.register(...registerables);

    if (this.props.graphs) {
      this.props.graphs.forEach(graph => {
        if (graph.type === "pie") {
          this.createPieChart(graph, this.charts[graph.label].current.getContext("2d"));
        } else {
          this.createLineChart(graph, this.charts[graph.label].current.getContext("2d"));
        }
      });
    }
  }

  createPieChart(graph, chart) {
    this.context = chart;
    const {label, labels, backgroundColor} = graph;
    const data = {
      labels,
      datasets: [{
        label,
        data: graph.data,
        backgroundColor,
        hoverOffset: 4,
      }],
    };
    new Chart(this.context.canvas, {
      type: "pie",
      data,
      options: {responsive: true},
    });
  }

  createLineChart(graph, chart) {
    this.context = chart;
    const {type, data, options} = graph;
    new Chart(this.context.canvas, {
      type,
      data,
      options,
    });
  }

  /* eslint-disable indent */
  _renderNotif() {
    const {notifs} = this.props;
    return <div className="content">

      {notifs && notifs.length > 0
          ? notifs.map(notif => <div
              className={"graph-box mb-2"}
              key={notif.body}
          >
            <b>
              {notif.body}
              {this.props.page === "piste" && <a
                href={`/session/${notif.id}/view`}
                rel="noreferrer"
                title="Visualiser"
              >
                <span className="icon"><i className="fa fa-eye" /></span>
              </a>}
            </b>
            {
                notif.text && notif.text.length > 0
                && <ul>
                  {
                    <li key={notif.text}>
                      {notif.text}
                    </li>
                  }
                </ul>
            }
          </div>)
          : <p>🎉 Vous n'avez aucune session sur cette piste 🌴</p>}
    </div>;
  }

  render() {
    return <div className="body-content">
      <Columns>
        <Column size={Column.Sizes.full}>
          <img src={this.state.piste.path} alt="Image de la piste" />
        </Column>
      </Columns>
      <Columns>
        <Column size={Column.Sizes.half}>
          <div>
            <p>Nombres de dalles: {this.state.piste.dalles}</p>
          </div>
        </Column>
        <Column size={Column.Sizes.half}>
          <div>
            <p>Nombres de tours effectuer: {this.state[this.props.page].tours}</p>
          </div>
        </Column>
      </Columns>
      <Columns>
        <Column size={Column.Sizes.oneThird}>
          <article className="tile is-child box">
            {this._renderNotif()}
          </article>
        </Column>
        <Column size={Column.Sizes.twoThirds}>
          <div className="is-flex graph-container">
            {this.props.graphs && this.props.graphs.length > 0
                && this.props.graphs.map(graph => <div
                  key={graph.label}
                  className={`is-${graph.column} is-flex-grow-${graph.column}`}
                >
                  <div className="pr-2 pb-2">
                    <div className={"graph-box"}>
                      <Title size={5}>{graph.label}</Title>
                      <div className="is-relative">
                        <canvas id="chart" ref={this.charts[graph.label]} />
                      </div>
                    </div>
                  </div>
                </div>)}
          </div>
        </Column>
      </Columns>
    </div>;
  }
}

Homepage.displayName = "Homepage";
Homepage.propTypes = {
  page: PropTypes.string.isRequired,
  piste: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
  notifs: PropTypes.array,
  graphs: PropTypes.array,
};
Homepage.defaultProps = {
  notifs: undefined,
  graphs: undefined,
};
module.exports = Homepage;
