self.onmessage = function (event) {
  const {tasks, query} = event.data

  self.postMessage(
    query ? tasks.filter(t => t.name.toLowerCase().includes(query.toLowerCase())) : tasks,
  )
}
