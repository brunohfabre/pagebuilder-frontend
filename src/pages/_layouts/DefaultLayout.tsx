import { Outlet } from 'react-router-dom'

import { Flex } from '@siakit/layout'

import { Sidebar } from '../../components/Sidebar'

export function DefaultLayout() {
  return (
    <Flex flex>
      <Sidebar />

      <Outlet />
    </Flex>
  )
}
