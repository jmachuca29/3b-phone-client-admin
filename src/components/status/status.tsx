import React from 'react'
import ECStatus from './styles'

export enum SaleState {
    Pending = 'PENDING',
    Approved = 'APPROVED',
    Rejected = 'REJECTED',
    Reajusted = 'REAJUSTED'
}

interface IStatus {
    state: SaleState
}

const Status: React.FC<IStatus> = ({state}) => {
    return (
        <ECStatus component={'span'} state={state}>{state}</ECStatus>
    )
}

export default Status