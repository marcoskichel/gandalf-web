import { TokenGate } from '@models/TokenGate'
import AddIcon from '@mui/icons-material/Add'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  styled,
  Typography,
} from '@mui/material'
import { QueryDocumentSnapshot } from 'firebase/firestore'

type GateDoc = QueryDocumentSnapshot<TokenGate>

const CustomCardActionArea = styled(CardActionArea)(() => ({
  display: 'flex',
  padding: '1rem',
  minHeight: '208px',
  width: '100%',
}))

interface ItemProps {
  tokenGate: TokenGate
  onClick?: () => void
}

const TokenGateListItem = (props: ItemProps) => {
  const { tokenGate, onClick } = props

  return (
    <Grid item xs={12} sm={6} md={4} sx={{ mt: 2, mb: 2 }}>
      <Card onClick={onClick}>
        <CustomCardActionArea
          sx={{ justifyContent: 'normal', alignItems: 'normal' }}
        >
          <CardContent>
            <Typography variant="subtitle1">{tokenGate.name}</Typography>
            <Typography variant="body2">{tokenGate.description}</Typography>
          </CardContent>
        </CustomCardActionArea>
      </Card>
    </Grid>
  )
}

interface AddButtonProps {
  onClick?: () => void
}

const AddButton = (props: AddButtonProps) => {
  const { onClick } = props

  return (
    <Grid item xs={12} sm={6} md={4} sx={{ mt: 2, mb: 2 }}>
      <Card onClick={onClick}>
        <CustomCardActionArea
          sx={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CardContent>
            <Box sx={{ textAlign: 'center' }}>
              <AddIcon />
              <Typography>Add token gate</Typography>
            </Box>
          </CardContent>
        </CustomCardActionArea>
      </Card>
    </Grid>
  )
}

interface Props {
  tokenGates: GateDoc[]
  loading?: boolean
  showAddButton?: boolean
  onAddClick?: () => void
  onItemClick?: (doc: GateDoc) => void
}

const TokenGateList = (props: Props) => {
  const {
    tokenGates,
    loading = false,
    showAddButton = false,
    onAddClick = () => {},
    onItemClick = () => {},
  } = props

  if (loading) {
    return <span>Loading...</span>
  }

  return (
    <Grid container spacing={2}>
      {showAddButton && <AddButton onClick={onAddClick} />}
      {tokenGates.map((gate) => (
        <TokenGateListItem
          key={gate.id}
          tokenGate={gate.data()}
          onClick={() => onItemClick(gate)}
        />
      ))}
    </Grid>
  )
}

export default TokenGateList
