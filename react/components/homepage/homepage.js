const React = require("react");
const PropTypes = require("prop-types");
const df = require("dateformat");

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
        this.charts = {};
        if (this.props.graphs) {
            Object.keys(this.props.graphs).forEach(graphKey => {
                const graph = this.props.graphs[graphKey];
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
            Object.keys(this.props.graphs).forEach(graphKey => {
                const graph = this.props.graphs[graphKey];
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
    const {piste, session} = this.state;
    const allLapsGraph = this.props.graphs["allLaps"];
    return <div className="body-content">
      <Title centered size={2}>Session du: {df(new Date(session.date), "dd/mm/yyyy")}</Title>
      <br/>
      <Columns>
        <Column size={Column.Sizes.oneThird}>
          <div className="box" style={{height: "540.05px"}}>
            <img src={piste.path} alt="Image de la piste" />
              <Columns>
                <Column size={Column.Sizes.half}>
                  <div>
                    <p>Nombres de dalles: {piste.dalles}</p>
                  </div>
                </Column>
                <Column size={Column.Sizes.half}>
                  <div>
                    <p>Nombres de tours effectuer: {piste.tours}</p>
                  </div>
                </Column>
              </Columns>
            </div>
        </Column>
          <Column size={Column.Sizes.oneThird}>
              <div className="box">
                  <Title centered size={4}>Résumé</Title>
                  <Columns>
                      <Column size={Column.Sizes.half}>Nombre de tours: {session.totalLaps}</Column>
                      <Column size={Column.Sizes.half}>Temps total: {session.normal.totalDrivingTime}</Column>
                  </Columns>
                  <Columns className="is-centered">
                      <Column size={Column.Sizes.half}>Temps moyen: {session.normal.averageLap}</Column>
                  </Columns>
              </div>
              <div className="box">
                  <Title centered size={4}>Meilleur Tour</Title>
                  <Columns>
                      <Column size={Column.Sizes.half}>Voiture: {session.best.transponder.DisplayName}</Column>
                      <Column size={Column.Sizes.half}>Pilote: {session.best.transponder.Pilot.Nickname}</Column>
                  </Columns>
                  <Columns>
                      <Column size={Column.Sizes.half}>Tour: {session.best.lap.Number}</Column>
                      <Column size={Column.Sizes.half}>Temps: {session.best.lap.Duration}</Column>
                  </Columns>
              </div>
              <div className="box">
                  <Title centered size={5}>Random Data</Title>
                  <Columns>
                      <Column size={Column.Sizes.half}>Random Data</Column>
                      <Column size={Column.Sizes.half}>Random Data</Column>
                  </Columns>
                  <Columns>
                      <Column size={Column.Sizes.half}>Random Data</Column>
                      <Column size={Column.Sizes.half}>Random Data</Column>
                  </Columns>
                  <Columns>
                      <Column size={Column.Sizes.half}>Random Data</Column>
                      <Column size={Column.Sizes.half}>Random Data</Column>
                  </Columns>
              </div>
          </Column>
          <Column size={Column.Sizes.oneThird}>
            <div className="box">
              <div key={allLapsGraph.label}
                className={`is-${allLapsGraph.column} is-flex-grow-${allLapsGraph.column}`}>
              <div className="pr-2 pb-2">
                <div className={"allLapsGraph-box"}>
                  <Title size={5}>{allLapsGraph.label}</Title>
                  <div className="is-relative">
                    <canvas id="chart" ref={this.charts[allLapsGraph.label]} />
                  </div>
                </div>
              </div>
              </div>
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
  piste: PropTypes.object,
  session: PropTypes.object,
  notifs: PropTypes.array,
  graphs: PropTypes.object,
};
Homepage.defaultProps = {
  piste: undefined,
  session: undefined,
  notifs: undefined,
  graphs: undefined,
};
module.exports = Homepage;
