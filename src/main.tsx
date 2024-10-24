import React from "react"
import ReactDOM from "react-dom/client"
import App, {router} from "./App"
import {Feature, FeatureSetting} from "./feature-context"

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

class FeatureManager {
  constructor(private features: Array<FeatureSetting>) {}

  isEnabled(featureId: Feature): boolean {
    return Boolean(this.features.find(f => f.id === featureId)?.enable)
  }

  set(features: Array<FeatureSetting>) {
    this.features = features
  }

  get(featureId: Feature) {
    return this.features.find(f => f.id === featureId) || null
  }

  init() {
    this.features = []
  }
}

declare global {
  interface Window {
    featureManager: FeatureManager
  }
}

const featureManager = new FeatureManager([])

featureManager.init()

window.featureManager = featureManager

const rootElement = document.getElementById("root")!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
