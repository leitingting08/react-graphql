import { Button, Table, Spin } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/lib/table'
import { DataType } from 'src/interface'
import { useQuery, ApolloConsumer, ApolloClient } from '@apollo/react-hooks'
import { launchesPast, launcheNext } from '../config/query'
import dayjs from 'dayjs'
import { useState } from 'react'
import './index.less'
import { Player } from 'video-react'
import 'video-react/dist/video-react.css'

export default () => {
  const [offset, setOffset] = useState<number>(10)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [pagination, setPagination] = useState<Record<string, number>>({
    current: 1,
    pageSize: 10
  })

  const {
    data: launchesPastData,
    loading: pastLoad,
    error: paseError,
    fetchMore
  } = useQuery(launchesPast, {
    variables: {
      offset: 0
    }
  })
  const { data: launcheNextData, loading: nextLoad, error: nextError } = useQuery(launcheNext)
  const [isLoadMore, setIsLoadMore] = useState(false)
  if (paseError || nextError) return <p>ERROR</p>
  if (pastLoad || nextLoad) return <Spin tip="Loading..." />

  const columns: ColumnsType<DataType> = [
    {
      title: 'mission_name',
      dataIndex: 'mission_name'
    },
    {
      title: 'rocket',
      dataIndex: 'rocket',
      render: (record) => {
        return (
          <>
            <>{record.rocket_name}</>
            <>{record.rocket_type}</>
          </>
        )
      }
    },
    {
      title: 'launch_site',
      dataIndex: 'launch_site',
      render: (record) => {
        return <>{record.site_name_long}</>
      }
    },
    {
      title: 'launch_date_local',
      dataIndex: 'launch_date_local',
      render: (record) => {
        return <>{dayjs(record).format('YYYY-MM-DD HH:mm:ss')}</>
      }
    },
    {
      title: 'launch_success',
      dataIndex: 'launch_success',
      render: (record) => {
        return <>{record ? 'YES' : 'NO'}</>
      }
    },
    {
      title: 'links',
      dataIndex: 'links',
      width: 200,
      render: (record) => {
        return (
          <>
            {record.article_link ? (
              <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
                article:{' '}
                <a target="_blank" href={record.article_link}>
                  {record.article_link}
                </a>
              </div>
            ) : null}
            {record.video_link ? (
              <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
                video:{' '}
                <a target="_blank" href={record.video_link}>
                  open a new window to watch
                </a>
                <Player playsInline src={record.video_link} />
              </div>
            ) : null}
          </>
        )
      }
    },
    {
      title: 'details',
      dataIndex: 'details'
    }
  ]

  const loadMore = async (client: ApolloClient<Record<string, number>>) => {
    setIsLoadMore(true)
    setOffset(offset + 10)
    const { data: res } = await fetchMore({
      variables: {
        offset
      }
    })
    const data = [...launchesPastData.launchesPast, ...res.launchesPast]
    if (data && data.length) client.writeQuery({ query: launchesPast, data })
    setIsLoadMore(false)
    if (res.launchesPast.length < 10) {
      setHasMore(false)
    } else {
      changePage({
        pageSize: pagination.pageSize || 10,
        current: pagination.current + 1
      })
    }
  }

  const changePage = (pagination: TablePaginationConfig) => {
    setPagination({
      pageSize: pagination.pageSize || 10,
      current: pagination.current || 1
    })
  }

  return (
    <ApolloConsumer>
      {(client) => (
        <>
          {launcheNextData ? (
            <>
              <h2>launcheNext</h2>
              <div className="launcheNext">
                <div>
                  <label>mission_name:</label> {launcheNextData.launchNext.mission_name}
                </div>
                <div>
                  <label>rocket:</label> {launcheNextData.launchNext.rocket.rocket_name}(
                  {launcheNextData.launchNext.rocket.rocket_type})
                </div>
                <div>
                  <label>launch_date_local: </label>
                  {dayjs(launcheNextData.launchNext.launch_date_local).format('YYYY-MM-DD HH:mm:ss')}
                </div>
                <div>
                  <label>launch_site: </label>
                  {launcheNextData.launchNext.launch_site.site_name_long}
                </div>
                <div>
                  <label>details: </label>
                  {launcheNextData.launchNext.details}
                </div>
              </div>
            </>
          ) : null}
          {launchesPastData ? (
            <>
              <h2>launchesPast</h2>
              <Table
                columns={columns}
                dataSource={launchesPastData.launchesPast}
                rowKey={(record) => record.id}
                bordered
                onChange={(pagination) => changePage(pagination)}
                pagination={pagination}
              />
              <div style={{ textAlign: 'right' }}>
                {isLoadMore ? (
                  <Spin tip="Loading..." />
                ) : hasMore ? (
                  <Button type="primary" onClick={() => loadMore(client)}>
                    Load more
                  </Button>
                ) : (
                  <span>NO MORE DATA</span>
                )}
              </div>
            </>
          ) : null}
        </>
      )}
    </ApolloConsumer>
  )
}
