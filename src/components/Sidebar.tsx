import { Link } from 'react-router-dom'

import { Flex } from '@siakit/layout'

export function Sidebar() {
  return (
    <Flex direction="column" width={240} padding gap>
      <Link to="layouts">Layouts</Link>
      <Link to="routes">Routes</Link>
    </Flex>
  )
}
