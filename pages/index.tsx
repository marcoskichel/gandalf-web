import { Box } from '@mui/material'
import { NextPage } from 'next'
import SiteNav from '@containers/site/SiteNav'
import SiteMain from '@containers/site/SiteMain'
import Themed from '@containers/Themed'
import Head from 'next/head'

const Site: NextPage = () => {
  return (
    <Themed>
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          backgroundColor: '#485461',
          backgroundImage: 'linear-gradient(315deg, #485461 0%, #28313b 74%)',
        }}
      >
        <Head>
          <title>BlueDome</title>
          <meta
            name="description"
            content="BlueDome is a tool for protecting your online community with tokenized access."
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <SiteNav />
        <SiteMain />
      </Box>
    </Themed>
  )
}

export default Site
