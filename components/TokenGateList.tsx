import { TokenGate } from '@models/TokenGate'
import AddIcon from '@mui/icons-material/Add'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  PaletteColor,
  styled,
  Typography,
  useTheme,
} from '@mui/material'
import { isBefore, isAfter, formatDistance } from 'date-fns'
import { QueryDocumentSnapshot } from 'firebase/firestore'
import { useMemo } from 'react'

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

interface TokenGateStatusProps {
  tokenGate: TokenGate
}

const TokenGateStatus = (props: TokenGateStatusProps) => {
  const { tokenGate } = props

  const theme = useTheme()

  const data: { color: PaletteColor; text: string } = useMemo(() => {
    const now = new Date()
    if (tokenGate.startDateTime && isBefore(now, tokenGate.startDateTime)) {
      return {
        color: theme.palette.warning,
        text: `Start ${formatDistance(tokenGate.startDateTime, now, {
          addSuffix: true,
        })}`,
      }
    }
    if (tokenGate.endDateTime && isAfter(now, tokenGate.endDateTime)) {
      return {
        color: theme.palette.error,
        text: `Expired ${formatDistance(tokenGate.endDateTime, now, {
          addSuffix: true,
        })}`,
      }
    }
    return { color: theme.palette.primary, text: 'Active now' }
  }, [theme, tokenGate])

  return (
    <Typography
      sx={{
        mt: 'auto',
      }}
      variant="body1"
      color={data.color.main}
    >
      {data.text}
    </Typography>
  )
}

const TokenGateListItem = (props: ItemProps) => {
  const { tokenGate, onClick } = props
  tokenGate.startDateTime

  return (
    <Grid item xs={12} sm={6} md={4} sx={{ mt: 2, mb: 2 }}>
      <Card onClick={onClick}>
        <CustomCardActionArea
          sx={{ justifyContent: 'normal', alignItems: 'normal' }}
        >
          <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1">{tokenGate.name}</Typography>
            <Typography variant="body2">{tokenGate.description}</Typography>
            <TokenGateStatus tokenGate={tokenGate} />
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
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Container>
    )
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
