import TokenGateList from '@components/TokenGateList'
import Routes from '@constants/routes'
import { useAuth } from '@contexts/AuthContext'
import { useTokenGates } from '@contexts/TokenGatesContext'
import { TokenGate } from '@models/TokenGate'
import { Container, Typography } from '@mui/material'
import { limit, QueryDocumentSnapshot } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface Props {
  preview?: boolean
}

const PREVIEW_LIMIT = 2

const UserTokenGates = (props: Props) => {
  const { preview = false } = props
  const { fetchTokenGates } = useTokenGates()
  const { user } = useAuth()
  const { push } = useRouter()

  const [loading, setLoading] = useState(true)
  const [tokenGates, setTokenGates] = useState<
    QueryDocumentSnapshot<TokenGate>[]
  >([])

  const onNewTokenGate = () => {
    push(Routes.tokenGateForm)
  }

  const onItemClick = (item: QueryDocumentSnapshot<TokenGate>) => {
    console.log(item)
  }

  useEffect(() => {
    const loadTokenGates = async () => {
      if (user) {
        const extraConstraints = preview ? [limit(PREVIEW_LIMIT)] : []
        const snapshot = await fetchTokenGates(...extraConstraints)
        setTokenGates(snapshot.docs)
        setLoading(false)
      }
    }

    loadTokenGates()
  }, [fetchTokenGates, preview, user])

  return (
    <Container sx={{ position: 'relative' }}>
      <Typography variant="h4">Token Gates</Typography>
      <TokenGateList
        loading={loading}
        tokenGates={tokenGates}
        showAddButton
        onAddClick={onNewTokenGate}
        onItemClick={onItemClick}
      />
    </Container>
  )
}

export default UserTokenGates
