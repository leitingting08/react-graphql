export interface Prop {
  children: React.ReactNode
}

export interface ResponseProp {
  success?: boolean
  desc?: string
  data?: never
}

export interface RouteProp {
  path: string
  breadcrumbName?: string
  component: React.LazyExoticComponent<() => JSX.Element>
  children?: RouteProp[]
}

export interface DataType {
  id: string
  mission_name: string
  details?: string
  __typename: string
  launch_date_local: string
  launch_site: {
    site_name_long: string
    __typename: string
  }
  launch_success: boolean
  rocket: {
    rocket_name: string
    rocket_type: string
    __typename: string
  }
  links: {
    article_link?: string
    video_link?: string
    __typename: string
  }
}
