export function addSubscription(subscriptions, callback) {
  subscriptions.push(callback)
  const removeSubcription = () => {
    const idx = subscriptions.indexOf(callback)
    if (idx > -1) {
      subscriptions.splice(idx, 1)
    }
  }
  return removeSubcription
}

export function triggerSubscriptions(subscriptions, ...args) {
  subscriptions.slice().forEach((cb) => {
    cb(...args)
  })
}
