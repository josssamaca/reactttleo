import React from 'react';
import ReactDOM from 'react-dom'
import ChartJS from 'chart.js';
import isEqual from 'lodash.isequal';

const propTypes = {
  className: React.PropTypes.string,
  redraw: React.PropTypes.bool,
  type: React.PropTypes.oneOf(['pie', 'doughnut', 'line', 'bar']),
  data: React.PropTypes.object.isRequired,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  options: React.PropTypes.object,
};

const defaultProps = {
  redraw: false,
  type: 'pie',
};

class Chart extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.chart = null;

    this.createChart = this.createChart.bind(this);
    this.updateChart = this.updateChart.bind(this);
  }

  componentDidMount() {
    this.createChart();
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps.data, this.props.data) || !isEqual(nextProps.options, this.props.options);
  }

  componentDidUpdate() {
    if (this.props.redraw) {
      this.createChart();
    } else {
      this.updateChart();
    }
  }

  componentWillUnmount() {
    const chart = this.chart;

    if (chart) {
      chart.destroy();
    }
  }

  createChart() {
    const { data, type, options } = this.props;
    const node = ReactDOM.findDOMNode(this);

    if (this.chart) {
	  	this.chart.destroy();
    }

    this.chart = new ChartJS(node, {
      type,
      data,
      options
    });
  }

  updateChart() {
    const { data, options } = this.props;

    if (!this.chart) {
      return;
    }

    this.chart.options = ChartJS.helpers.configMerge(this.chart.options, options);
    this.chart.config.data = {
      ...this.chart.config.data,
      ...data,
    };

    this.chart.update();
  }

  render() {
    const { width, height, className } = this.props;

    return (
      <canvas className={className} width={width} height={height} />
    );
  }
}

Chart.propTypes = propTypes;
Chart.defaultProps = defaultProps;

export default Chart;