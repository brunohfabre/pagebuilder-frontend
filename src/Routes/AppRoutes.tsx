import { Routes as RRDRoutes, Route } from 'react-router-dom'

import { DefaultLayout } from '../pages/_layouts/DefaultLayout'
import { Home } from '../pages/Home'
import { Layouts } from '../pages/Layouts'
import { Layout } from '../pages/Layouts/Layout'
import { Routes } from '../pages/Routes'
import { Route as RoutePage } from '../pages/Routes/Route'
import { Test } from '../pages/Test'

export function AppRoutes() {
  return (
    <RRDRoutes>
      <Route element={<DefaultLayout />}>
        <Route path="" element={<Home />} />

        <Route path="layouts" element={<Layouts />} />
        <Route path="routes" element={<Routes />} />
      </Route>

      <Route path="layouts/:id" element={<Layout />} />
      <Route path="routes/:id" element={<RoutePage />} />

      <Route path="test" element={<Test />} />
    </RRDRoutes>
  )
}
