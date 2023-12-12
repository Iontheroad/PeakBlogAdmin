/**
 * 权限 permission
 *     通过用户的角色信息拿到最终的 异步路由菜单
 */
import { defineStore } from "pinia";
import mockMenuList from "@/mock/menu-list.json";
const modules = import.meta.glob("@/views/**/*.vue");
export const usePermissionStore = defineStore({
  id: "peak-permission",
  state: () => ({
    menuList: [] as Menu.MenuOptions[] // 动态路由
  }),
  actions: {
    /**
     * 获取异步路由
     * @param roles 用户的角色信息
     * @returns
     */
    async getListRoutes_action() {
      try {
        this.menuList = mockMenuList;

        return Promise.resolve(this.menuList);
      } catch (error) {
        return Promise.reject(error);
      }
    }
  },
  getters: {
    /**
     * 用于渲染需要显示在菜单栏的路由
     */
    menubarList_getters: (state): Menu.MenuOptions[] => getShowMenuList(state.menuList),

    /**
     * 用于添加动态路由=>树形插入动态路由
     * @param state
     * @returns
     */
    treeMenuList_getters: (state): Menu.MenuOptions[] =>
      getMenuComponents(state.menuList),
    /**
     * 用于添加动态路由=>扁平化添加动态路由
     */
    flatMenubarList_getters: (state): Menu.MenuOptions[] =>
      getFlatMenuList(state.menuList)
  }
});

/**
 * 过滤需要显示在菜单栏的路由
 * @param menuList
 * @returns
 */
function getShowMenuList(menuList: Menu.MenuOptions[]): Menu.MenuOptions[] {
  const copyMenuList = JSON.parse(JSON.stringify(menuList)) as Menu.MenuOptions[];
  return copyMenuList.filter((item) => {
    if (item?.meta?.isHidden) return false;
    item?.children?.length && (item.children = getShowMenuList(item.children));
    return true;
  });
}

/**
 * 匹配菜单对应的组件
 */
function getMenuComponents(menuList: Menu.MenuOptions[]) {
  const copyArr = JSON.parse(JSON.stringify(menuList)) as Menu.MenuOptions[];
  return copyArr.map((item) => {
    if (item.component && typeof item.component == "string") {
      item.component = modules["/src/views" + item.component + ".vue"];
    }
    if (item.children?.length) item.children = getMenuComponents(item.children);
    return item;
  });
}

/**
 * 扁平化路由 tabs
 * @param menuList
 * @returns
 */
function getFlatMenuList(menuList: Menu.MenuOptions[]): Menu.MenuOptions[] {
  let copyArr = JSON.parse(JSON.stringify(menuList)) as Menu.MenuOptions[];
  // return copyArr.reduce((pre: Menu.MenuOptions[], current: Menu.MenuOptions) => {
  //   let flatArr = [...pre, current];
  //   if (current?.children) flatArr = [...flatArr, ...getFlatMenuList(current.children)];
  //   return flatArr;
  // }, []);
  return copyArr.flatMap((item) => [
    item,
    ...(item.children?.length ? getFlatMenuList(item.children) : [])
  ]);
}

export default usePermissionStore;
