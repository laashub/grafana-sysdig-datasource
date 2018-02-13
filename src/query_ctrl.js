import {QueryCtrl} from 'app/plugins/sdk';
import './css/query-editor.css!';
import {SysdigDashboardImporter} from './sysdig-dashboard-importer';

export class GenericDatasourceQueryCtrl extends QueryCtrl {
  constructor($scope, $injector)  {
    super($scope, $injector);

    this.scope = $scope;
    this.target.target = this.target.target || 'select metric';
    this.target.timeAggregation = this.target.timeAggregation || 'timeAvg';
    this.target.groupAggregation = this.target.groupAggregation || 'avg';
    this.target.segmentation = this.target.segmentation || null;
    this.target.sortDirection = this.target.sortDirection || 'desc';
    this.target.pageLimit = this.target.pageLimit || 10;
  }

  shouldLoadTimeSeries() {
    return true;
    // return this.panel.type !== 'table';
  }

  getMetricOptions(query) {
    const shouldLoadTimeSeries = this.shouldLoadTimeSeries();

    let parseMetric;
    if (shouldLoadTimeSeries) {
      parseMetric = (m) => ({ text: m.id, value: m.id });
    } else {
      parseMetric = (m) => {
        if (m.isNumeric) {
          return { text: `(#) ${m.id}`, value: m.id };
        } else {
          return { text: `(A) ${m.id}`, value: m.id };
        }
      };
    }

    return this.datasource.metricFindQuery({ type: 'METRIC_TYPE_VALUE'})
      .then((data) => {
        return data.map(parseMetric);
      })
    ;
  }

  getTimeAggregationOptions() {
    const options = [
      { value: 'timeAvg', text: 'Rate' },
      { value: 'avg', text: 'Average' },
      { value: 'min', text: 'Min' },
      { value: 'max', text: 'Max' },
    ];

    return this.datasource.metricFindQuery({ type: 'METRIC_TYPE_VALUE'})
      .then((data) => {
        return data.filter((m) => m.id === this.target.target)[0];
      })
      .then((m) => {
        if (m) {
          return options.filter((d) => m.timeAggregations.indexOf(d.value) >= 0);
        } else {
          return [];
        }
      })
    ;
  }

  getGroupAggregationOptions() {
    const options = [
      { value: 'avg', text: 'Average' },
      { value: 'sum', text: 'Sum' },
      { value: 'min', text: 'Min' },
      { value: 'max', text: 'Max' },
    ];

    return this.datasource.metricFindQuery({ type: 'METRIC_TYPE_VALUE'})
      .then((data) => {
        return data.filter((m) => m.id === this.target.target)[0];
      })
      .then((m) => {
        if (m) {
          return options.filter((d) => m.groupAggregations.indexOf(d.value) >= 0);
        } else {
          return [];
        }
      })
    ;
  }

  getSortDirectionOptions() {
    return [
      { value: 'desc', text: 'Top' },
      { value: 'asc', text: 'Bottom' },
    ];
  }

  getSegmentByOptions(query) {
    return this.datasource.findSegmentBy(this.target.target)
      .then((data) => {
        return [
          { text: 'no segmentation', value: null },
            ...data.map((k) => ({ text: k, value: k }))
          ];
      })
    ;
  }

  onChangeParameter() {
    this.panelCtrl.refresh();
  }

  toggleEditorMode() {
    // noop
  }
}

GenericDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
