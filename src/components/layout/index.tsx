import { useState, useEffect } from 'react'
import ProLayout, { BasicLayoutProps, PageContainer } from '@ant-design/pro-layout'
import MENU from './menu'
import { Layout } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { Prop } from 'src/interface/index'
const { Content } = Layout

const BaseLayout = (props: Prop) => {
  const { children } = props
  const [ready, setReady] = useState(false)
  const [pathname, setPathname] = useState('/')

  const location = useLocation()
  useEffect(() => {
    setReady(true)
    setPathname(location.pathname)
  }, [location.pathname, pathname])

  const settings: BasicLayoutProps = {
    layout: 'mix',
    contentWidth: 'Fluid',
    fixedHeader: false,
    fixSiderbar: false,
    collapsedButtonRender: false,
    menu: {
      locale: true
    },
    headerHeight: 64,
    siderWidth: 150,
    title: '',
    location: {
      pathname
    },
    primaryColor: '#1890ff',
    breakpoint: false,
    splitMenus: false,
    openKeys: false,
    selectedKeys: [pathname.split('/')[2]],
    rightContentRender: () => (
      <div>
        <span style={{ color: '#fff' }}>admin</span>
      </div>
    )
  }

  return ready ? (
    <div
      style={{
        height: '100vh'
      }}
    >
      <ProLayout
        {...settings}
        menuDataRender={() => MENU}
        menuItemRender={(item, dom) => (
          <Link key={item.key} to={item.path || ''}>
            {dom}
          </Link>
        )}
      >
        <PageContainer />
        <Content style={{ padding: '20px 0' }}>{children}</Content>
      </ProLayout>
    </div>
  ) : null
}

export default BaseLayout
