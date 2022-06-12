/**
 * permission tools
 */
let permissionCodes: string[] = []

const Permissions = {
  getPermissions() {
    return permissionCodes
  },
  setPermissions(permissions: string[]) {
    if (permissions && permissions.length) {
      permissionCodes = permissions
    }
  },
  authRender(item: string, code: string) {
    if (this.ifRender(code)) {
      return item
    } else {
      return null
    }
  },
  // 判断是否需要渲染权限组件
  ifRender(code: string[] | string) {
    // 用于判断是否需要渲染
    let shouldRender = false
    // 如果传入的是个权限数组，那么需要所有权限都有的情况下才能渲染
    if (typeof code !== 'string') {
      let existNums = 0
      code.map((el: string) => {
        let exist = false
        permissionCodes.map((item) => {
          if (item.indexOf(el) !== -1) {
            exist = true
          }
          return item
        })
        if (exist) {
          existNums++
        }
        return el
      })
      if (code.length === existNums) {
        shouldRender = true
      }
    } else {
      // 传入的是字符串则匹配是否有该权限
      permissionCodes.map((item) => {
        return item.indexOf(code) !== -1 && (shouldRender = true)
      })
    }
    return shouldRender
  }
}

export default Permissions
