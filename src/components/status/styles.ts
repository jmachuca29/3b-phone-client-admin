import styled from "@emotion/styled";
import { Box } from "@mui/material";

export enum SaleState {
    Pending = 'PENDING',
    Approved = 'APPROVED',
    Rejected = 'REJECTED',
    Reajusted = 'REAJUSTED'
}

type ECStatusProps = {
    state: SaleState
}

const handleStateType = (state: SaleState) => {
    switch (state) {
        case SaleState.Pending:
            return `
            color: rgb(183, 110, 0);
            background-color: rgba(255, 171, 0, 0.16);;
            `
        case SaleState.Approved:
            return `
            color: rgb(17, 141, 87);
            background-color: rgba(34, 197, 94, 0.16);;
            `
        case SaleState.Rejected:
            return `
            color: rgb(183, 29, 24);
            background-color: rgba(255, 86, 48, 0.16);
            `
        case SaleState.Reajusted:
            return `
            color: rgb(99, 115, 129);
            background-color: rgba(145, 158, 171, 0.16);;
            `
    }
}

const ECStatus = styled(Box) <ECStatusProps>`
  height: 24px;
  min-width: 24px;
  line-height: 0;
  border-radius: 6px;
  cursor: default;
  -webkit-box-align: center;
  align-items: center;
  white-space: nowrap;
  display: inline-flex;
  -webkit-box-pack: center;
  justify-content: center;
  text-transform: capitalize;
  padding: 0px 6px;
  font-size: 0.75rem;
  font-weight: 700;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  ${({ state }) => handleStateType(state)}
`

export default ECStatus
