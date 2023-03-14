import { Box } from '@mui/material'
import { NextPage } from 'next'
import Themed from '../../containers/Themed'
import SiteNav from './containers/SiteNav'

const SiteHome: NextPage = () => {
  return (
    <Themed>
      <Box>
        <SiteNav />
      </Box>
    </Themed>
  )
}

export default SiteHome
