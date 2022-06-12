import { InMemoryCache } from '@apollo/client'

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        launchesPast: {
          keyArgs: false,
          merge(existing, incoming) {
            return [...(existing ? existing : []), ...(incoming ? incoming : [])]
          }
        }
      }
    }
  }
})
