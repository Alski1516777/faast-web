import React, { Fragment } from 'react'
import { createStructuredSelector } from 'reselect'
import { toBigNumber } from 'Utilities/numbers'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { compose, setDisplayName, setPropTypes, defaultProps } from 'recompose'
import { Table, Card, CardHeader, CardBody, CardFooter } from 'reactstrap'
import PropTypes from 'prop-types'
import classNames from 'class-names'
import Units from 'Components/Units'
import Loading from 'Components/Loading'
import CoinIcon from 'Components/CoinIcon'


import { getMakerBalances } from 'Selectors/maker'

import { text, affilateTable, card, cardHeader, cardFooter, smallCard } from './style'

const BalanceTableRow = ({
  asset: { asset: symbol, exchange, wallet, walletUsd, exchangeUsd },
  ...props
}) => {
  return (
    <tr {...props}>
      <td>
        <span style={{ left: 8 }} className='position-relative'>
          <CoinIcon symbol={symbol} size='sm' />
          <span style={{ fontWeight: 500 }} className='ml-2'>{symbol}</span>
        </span>
      </td>
      <td>
        <Units value={toBigNumber(exchange).plus(toBigNumber(wallet))} symbol={symbol} precision={6} showSymbol showIcon iconProps={{ className: 'd-sm-none' }}/>
      </td>
      <td>
        <Units value={toBigNumber(exchangeUsd).plus(toBigNumber(walletUsd))} symbol={'$'} precision={6} showSymbol showIcon iconProps={{ className: 'd-sm-none' }} prefixSymbol />
      </td>
    </tr>
  )
}

const AffiliateBalanceTable = ({ balances, size, areWithdrawalsLoading }) => {
  balances = size === 'small' ? balances.slice(0,6) : balances
  return (
    <Fragment>
      <Card className={classNames(card, size === 'small' && smallCard, size != 'small' && 'mx-auto')}>
        <CardHeader className={cardHeader}>Current Balances</CardHeader>
        <CardBody className={classNames(balances.length > 0 && 'p-0', 'text-center')}>
          {areWithdrawalsLoading ? (<Loading className='py-4' />) : balances.length > 0 ? (
            <Fragment>
              <Table className={classNames('text-left', text, affilateTable)} striped responsive>
                <thead>
                  <tr>
                    <th style={{ left: 8 }}>Coin</th>
                    <th>Amount</th>
                    <th>Balance (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {balances.map((asset, i) => {
                    return (
                      <BalanceTableRow key={i} size={size} asset={asset}/>
                    )
                  })}
                </tbody>
              </Table>
              {size === 'small' && balances.length > 0 && (
                <CardFooter 
                  tag={Link} 
                  to='/makers/balances'
                  className={classNames(cardFooter, text, balances.length < 6 && 'position-absolute', 'p-2 text-center cursor-pointer d-block w-100')}
                  style={{ bottom: 0 }}
                >
                  <span className='font-weight-bold'>View All Balances</span>
                </CardFooter>)}
            </Fragment>
          ) :
            <div className='d-flex align-items-center justify-content-center'>
              <p className={text}>No Balances yet.</p>
            </div>
          }
          
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default compose(
  setDisplayName('AffiliateWithdrawalTable'),
  connect(createStructuredSelector({
    balances: getMakerBalances,
  }), {
  }),
  setPropTypes({
    size: PropTypes.string
  }),
  defaultProps({
    size: 'large'
  }),
  withRouter,
)(AffiliateBalanceTable)
