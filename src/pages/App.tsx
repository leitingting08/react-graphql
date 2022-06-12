import React, { Suspense } from 'react'
import BaseLayout from 'src/components/layout/index'
import 'src/styles/variable.less'
import { Prop } from 'src/interface/index'

const App = (props: Prop) => {
  const { children } = props
  return (
    <Suspense fallback={<div>Loading</div>}>
      <BaseLayout>{children}</BaseLayout>
    </Suspense>
  )
}

export default App
