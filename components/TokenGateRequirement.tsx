import { TokenGateRequirement } from "@models/TokenGate"

interface Props {
  requiredAmount: number
  currentAmount: number
}

const TokenGateRequirement = (props: Props) => {
  const {requiredAmount, currentAmount} = props

  return <div>
    <p>Required: {requiredAmount}</p>
    <p>Current: {currentAmount}</p>
  </div>

}

export default TokenGateRequirement