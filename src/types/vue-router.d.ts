import "vue-router";

declare module "vue-router" {
  interface RouteRecordRaw {
    children?: RouteRecordRaw[];
    meta: RouteMeta;
  }
  interface RouteMeta extends Menu.MenuMeta {}
}
