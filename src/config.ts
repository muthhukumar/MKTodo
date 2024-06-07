interface Config {
  url: {
    SERVER_URL: string
  }
}

type Env = {
  prod: Config
  dev: Config
}

const config: Env = {
  dev: {
    url: {
      SERVER_URL: "http://192.168.1.2:3000",
    },
  },
  prod: {
    url: {
      SERVER_URL: "https://todo-server-zbor.onrender.com",
    },
  },
}

function getConfig() {
  return config["dev"]
}

export default getConfig()
