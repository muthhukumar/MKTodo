/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LoginImport } from './routes/login'
import { Route as AuthImport } from './routes/_auth'
import { Route as AuthIndexImport } from './routes/_auth.index'
import { Route as AuthPlannedImport } from './routes/_auth.planned'
import { Route as AuthMyDayImport } from './routes/_auth.my-day'
import { Route as AuthImportantImport } from './routes/_auth.important'

// Create/Update Routes

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const AuthRoute = AuthImport.update({
  id: '/_auth',
  getParentRoute: () => rootRoute,
} as any)

const AuthIndexRoute = AuthIndexImport.update({
  path: '/',
  getParentRoute: () => AuthRoute,
} as any)

const AuthPlannedRoute = AuthPlannedImport.update({
  path: '/planned',
  getParentRoute: () => AuthRoute,
} as any)

const AuthMyDayRoute = AuthMyDayImport.update({
  path: '/my-day',
  getParentRoute: () => AuthRoute,
} as any)

const AuthImportantRoute = AuthImportantImport.update({
  path: '/important',
  getParentRoute: () => AuthRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_auth': {
      id: '/_auth'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/_auth/important': {
      id: '/_auth/important'
      path: '/important'
      fullPath: '/important'
      preLoaderRoute: typeof AuthImportantImport
      parentRoute: typeof AuthImport
    }
    '/_auth/my-day': {
      id: '/_auth/my-day'
      path: '/my-day'
      fullPath: '/my-day'
      preLoaderRoute: typeof AuthMyDayImport
      parentRoute: typeof AuthImport
    }
    '/_auth/planned': {
      id: '/_auth/planned'
      path: '/planned'
      fullPath: '/planned'
      preLoaderRoute: typeof AuthPlannedImport
      parentRoute: typeof AuthImport
    }
    '/_auth/': {
      id: '/_auth/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AuthIndexImport
      parentRoute: typeof AuthImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  AuthRoute: AuthRoute.addChildren({
    AuthImportantRoute,
    AuthMyDayRoute,
    AuthPlannedRoute,
    AuthIndexRoute,
  }),
  LoginRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_auth",
        "/login"
      ]
    },
    "/_auth": {
      "filePath": "_auth.tsx",
      "children": [
        "/_auth/important",
        "/_auth/my-day",
        "/_auth/planned",
        "/_auth/"
      ]
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/_auth/important": {
      "filePath": "_auth.important.tsx",
      "parent": "/_auth"
    },
    "/_auth/my-day": {
      "filePath": "_auth.my-day.tsx",
      "parent": "/_auth"
    },
    "/_auth/planned": {
      "filePath": "_auth.planned.tsx",
      "parent": "/_auth"
    },
    "/_auth/": {
      "filePath": "_auth.index.tsx",
      "parent": "/_auth"
    }
  }
}
ROUTE_MANIFEST_END */