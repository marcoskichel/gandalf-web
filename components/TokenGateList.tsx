import { useThemes } from '@contexts/ThemesContext'
import { useToaster } from '@contexts/ToasterContext'
import { copyTextToClipboard } from '@helpers/clipboard'
import { TokenGate } from '@models/TokenGate'
import AddIcon from '@mui/icons-material/Add'
import CopyIcon from '@mui/icons-material/ContentCopy'
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  InputBase,
  Paper,
  styled,
  Typography,
} from '@mui/material'
import { QueryDocumentSnapshot } from 'firebase/firestore'
import { useCallback } from 'react'

type GateDoc = QueryDocumentSnapshot<TokenGate>

const CustomCardActionArea = styled(CardActionArea)(() => ({
  display: 'flex',
  padding: '1rem',
  height: '100%',
  width: '100%',
}))

interface ItemProps {
  tokenGate: TokenGate
  tokenGateId: string
  onClick?: () => void
}

const CopyToClipboard = ({
  tokenGateId,
  redirectUrl,
}: {
  tokenGateId: string
  redirectUrl?: string | null
}) => {
  const url = redirectUrl?.length
    ? `${window.location.origin}/admin/token-gates/${tokenGateId}?redirectUrl=${redirectUrl}`
    : `${window.location.origin}/admin/token-gates/${tokenGateId}`

  const { currentTheme: theme } = useThemes()
  const { setToast } = useToaster()

  const copy = useCallback(() => {
    copyTextToClipboard(url)
    setToast({ severity: 'success', message: 'Gate URL copied to clipboard' })
  }, [setToast, url])

  return (
    <Paper
      sx={{
        paddingY: '2px',
        paddingLeft: '1rem',
        paddingRight: '2px',
        mt: 3,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: theme.palette.default.main,
      }}
    >
      <InputBase
        sx={{ flex: 1 }}
        value={url}
        inputProps={{ 'aria-label': 'Copy to clipboard' }}
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton
        onClick={copy}
        color="primary"
        sx={{ p: '10px' }}
        aria-label="copy url to clipboard"
      >
        <CopyIcon />
      </IconButton>
    </Paper>
  )
}

const TokenGateListItem = (props: ItemProps) => {
  const { tokenGate, tokenGateId, onClick } = props

  return (
    <Grid item xs={12} sm={6} md={4} sx={{ mt: 2, mb: 2 }}>
      <Card sx={{ height: '100%' }}>
        <CardContent
          sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}
        >
          <Typography variant="subtitle1">{tokenGate.name}</Typography>
          <Typography variant="body2">{tokenGate.description}</Typography>
          <CopyToClipboard
            tokenGateId={tokenGateId}
            redirectUrl={tokenGate.redirectUrl}
          />
        </CardContent>
        <CardActions>
          <Button onClick={onClick} sx={{ marginLeft: 'auto' }}>
            Edit Gate
          </Button>
        </CardActions>
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
      <Card onClick={onClick} sx={{ height: '100%' }}>
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
    <Grid container spacing={2} lineHeight={210}>
      {showAddButton && <AddButton onClick={onAddClick} />}
      {tokenGates.map((gate) => (
        <TokenGateListItem
          key={gate.id}
          tokenGateId={gate.id}
          tokenGate={gate.data()}
          onClick={() => onItemClick(gate)}
        />
      ))}
    </Grid>
  )
}

export default TokenGateList
