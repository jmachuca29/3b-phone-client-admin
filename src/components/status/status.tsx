import React from 'react'
import ECStatus from './styles'
import { SaleState } from 'src/constant/sales'

interface IStatus {
    state: SaleState
}

const Status: React.FC<IStatus> = ({state}) => {
    return (
        <ECStatus component={'span'} state={state}>{state}</ECStatus>
    )
}

export default Status