import React from 'react'
import PropTypes from 'prop-types'
import { compose, setDisplayName, setPropTypes, lifecycle, defaultProps, withProps } from 'recompose'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getPriceChartData, isPriceChartLoading } from 'Common/selectors/priceChart'
import { fetchPriceChartData } from 'Common/actions/priceChart'
import ReactHighstock from 'react-highcharts/ReactHighstock.src'
import { themeColor } from 'Utilities/style'
import { i18nTranslate as t } from 'Utilities/translate'

import { withTranslation } from 'react-i18next'

const priceSeriesName = 'Price (USD)'

ReactHighstock.Highcharts.setOptions({
  lang: {
    loading: t('app.priceChart.loading', 'Loading...'),
    months: t('app.priceChart.months', 'January February March April May June July August September October November December').split(' '),
    weekdays: t('app.priceChart.weekdays', 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday').split(' '),
    shortMonths: t('app.priceChart.shortMonths', 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec').split(' '),
    exportButtonTitle: t('app.priceChart.exportButtonTitle', 'Export'),
    printButtonTitle: t('app.priceChart.printButtonTitle', 'Import'),
    rangeSelectorFrom: t('app.priceChart.rangeSelectorFrom', 'From'),
    rangeSelectorTo: t('app.priceChart.rangeSelectorTo', 'To'),
    rangeSelectorZoom: t('app.priceChart.rangeSelectorZoom', 'Zoom'),
    downloadPNG: t('app.priceChart.downloadPNG', 'Download PNG Image'),
    downloadJPEG: t('app.priceChart.downloadJPEG', 'Download JPEG Image'),
    downloadPDF: t('app.priceChart.downloadPDF', 'Download PDF Image'),
    downloadSVG: t('app.priceChart.downloadSVG', 'Download SVG Image'),
    printChart: t('app.priceChart.printChart', 'Print'),
    resetZoom: t('app.priceChart.resetZoom', 'Reset zoom'),
    resetZoomTitle: t('app.priceChart.resetZoomTitle', 'Reset zoom'),
    thousandsSep: t('app.priceChart.thousandsSep', ','),
    decimalPoint: t('app.priceChart.decimalPoint', '.')
  },
})

const PriceChart = ({ config, isPriceChartLoading }) => {
  return isPriceChartLoading ? 
    <i className='fa fa-spinner fa-pulse'/> : <ReactHighstock config={config}/>
}

const initialConfig = {
  chart: {
    height: 350,
  },
  colors: [themeColor.primary],
  navigator: {
    enabled: false
  },
  credits: {
    enabled: false
  },
  tooltip: {
    followPointer: true
  },
  plotOptions: {
    area: {
      dataLabels: {
        color: '#B0B0B3'
      },
      fillOpacity: 0.75,
      marker: {
        radius: 2,
        fillColor: themeColor.ultraDark,
      },
      lineWidth: 2,
      states: {
        hover: {
          lineWidth: 2
        }
      },
      threshold: null
    }
  },
  rangeSelector: {
    buttonTheme: {
      fill: '#505053',
      stroke: '#000000',
      style: {
        color: '#CCC'
      },
      states: {
        hover: {
          fill: '#707073',
          stroke: '#000000',
          style: {
            color: 'white'
          }
        },
        select: {
          fill: '#000003',
          stroke: '#000000',
          style: {
            color: 'white'
          }
        }
      }
    },
    inputBoxBorderColor: '#505053',
    inputStyle: {
      backgroundColor: '#333',
      color: 'silver'
    },
    labelStyle: {
      color: 'silver'
    }
  },
  scrollbar: {
    enabled: false
  },
  title: {
    align: 'left',
    useHTML: true,
    text: '',
    style: {
      color: '#E0E0E3',
      fontSize: '20px'
    }
  },
  xAxis: {
    gridLineColor: '#707073',
    labels: {
      style: {
        color: '#E0E0E3'
      }
    },
    lineColor: '#707073',
    minorGridLineColor: '#505053',
    tickColor: '#707073'
  },
  series: [{
    name: priceSeriesName,
    data: [],
    type: 'area',
    tooltip: {
      valuePrefix: '$',
      pointFormat: '<b>{point.y}</b> USD',
    },
    threshold: null
  }],
  yAxis: {
    min: 0,
    opposite: false,
    gridLineColor: '#707073',
    title: {
      text: priceSeriesName,
      style: {
        color: themeColor.primary
      }
    },
    labels: {
      y: null, // Center vertically
      format: '${value}',
      align: 'right',
      style: {
        color: themeColor.primary,
        fontSize: '12px'
      }
    },
    lineColor: '#707073',
    minorGridLineColor: '#505053',
    tickColor: '#707073',
    tickWidth: 1,
    plotLines: [{
      value: 0,
      width: 1,
      color: '#808080'
    }]
  },
}

export default compose(
  setDisplayName('PriceChart'),
  withTranslation(),
  connect(createStructuredSelector({
    data: (state, { cmcIDno }) => getPriceChartData(state, cmcIDno),
    isPriceChartLoading: (state, { cmcIDno }) => isPriceChartLoading(state, cmcIDno)
  }), {
    fetchPriceChart: fetchPriceChartData
  }),
  setPropTypes({
    cmcIDno: PropTypes.number.isRequired,
    chartOpen: PropTypes.bool,
    toggle: PropTypes.bool
  }),
  defaultProps({
    chartOpen: false,
    toggle: false
  }),
  withProps(({ data, t }) => {
    const translatedName = t('app.priceChart.yAxisLabel', 'Price (USD)')
    initialConfig.yAxis.title.text = translatedName
    const config = (data 
      ? {
        ...initialConfig,
        series: [{
          ...initialConfig.series[0],
          data: data
        }]
      } 
      : initialConfig)
    return { config }
  }),
  lifecycle({
    componentDidUpdate (prevProps) {
      const { cmcIDno, chartOpen, fetchPriceChart, toggle } = this.props
      if (!prevProps.chartOpen && chartOpen || !toggle && chartOpen) {
        fetchPriceChart(cmcIDno)
      }
    },
    componentWillMount() {
      const { cmcIDno, chartOpen, fetchPriceChart, toggle } = this.props
      if (!toggle && chartOpen) {
        fetchPriceChart(cmcIDno)
      }
    }
  }),
)(PriceChart)
