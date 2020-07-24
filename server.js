const Router = require('@koa/router')
const R = require('ramda')
const router = new Router()

const maze = [
  ['-', '-', '-', 'O', '-', '-', '-', '-', '-', 'O'],
  ['-', 'O', '-', '-', '-', 'O', '-', 'D', '-', '-'],
  ['-', '-', '-', '-', 'O', '-', '-', 'O', '-', '-'],
  ['-', 'O', '-', 'O', '-', '-', '-', '-', '-', '-'],
  ['-', '-', '-', '-', '-', 'O', '-', 'O', '-', '-'],
  ['F', '-', '-', 'O', '-', '-', '-', '-', '-', 'O'],
  ['-', '-', 'O', '-', '-', '-', '-', '-', '-', '-'],
  ['-', '-', '-', '-', '-', '-', '-', 'O', '-', '-'],
  ['-', 'O', '-', '-', 'O', 'O', '-', '-', '-', '-'],
  ['-', '-', '-', '-', '-', '-', '-', '-', 'O', '-']
]

const getMoves = moves => moves.split(',')

const getResultMessage = R.cond([
  [char => char === 'D', R.always('Ring is destroyed 🎊')],
  [char => char === 'O', R.always('Orc found, Frodo is dead ☠')],
  [char => char === '-', R.always('Nothing is found 🤷')],
  [R.isNil, R.always('Falls out of the map 😵')],
])

const getFrodosMovementResult = (maze, movesString) => {
  const moves = getMoves(movesString)
  const location = getFrodosLocation(maze)
  const frodosFinalDestination = whileNextLocation(maze, location, moves)
  return frodosFinalDestination
}

const getNextLocation = (currentLocation, direction) => {
  const nextLocationCond = R.cond([
    [isNorth, () => R.assoc('y', currentLocation.y - 1, currentLocation)],
    [isSouth, () => R.assoc('y', currentLocation.y + 1, currentLocation)],
    [isEast, () => R.assoc('x', currentLocation.x + 1, currentLocation)],
    [isWest, () => R.assoc('x', currentLocation.x - 1, currentLocation)],
    [R.T, R.always(currentLocation)],
  ])
  return nextLocationCond(direction)
}

const currentLocationContent = (maze, location) => maze[location.y][location.x]

const whileNextLocation = (maze, currentLocation, moves) => {
  if (isFrodoOut(maze, currentLocation, moves[0])) {
    return getResultMessage()
  }
  const frodosNextLocation = getNextLocation(currentLocation, moves[0])
  const currentEntity = currentLocationContent(maze, frodosNextLocation)
  const shouldGoFurther = currentEntity === '-' && moves.length > 1
  if (shouldGoFurther) {
    return whileNextLocation(maze, frodosNextLocation, R.tail(moves))
  } else {
    return getResultMessage(currentEntity)
  }
}

const getFrodosLocation = maze => maze.reduce((acc, cur, idx) => {
  if (R.hasPath['x'], acc) {
    return acc
  } else {
    const frodoFoundIndex = cur.findIndex(item => item === 'F')
    if (frodoFoundIndex > -1) {
      acc = { x: frodoFoundIndex, y: idx }
    }
    return acc
  }
}, null)

const isNorth = R.equals('n')
const isSouth = R.equals('s')
const isEast = R.equals('e')
const isWest = R.equals('w')

const isFrodoOut = (maze, currentLocation, direction) => {
  const row = maze[currentLocation.y]
  const isOut = R.cond([
    [isNorth, () => currentLocation.y === 0],
    [isSouth, () => currentLocation.y === maze.length - 1],
    [isEast, () => currentLocation.x === row.length - 1],
    [isWest, () => currentLocation.x === 0],
    [R.T, () => false],
  ])
  return isOut(direction)
}

const server = async ctx => {
  const movesString = R.path(['request', 'body', 'moves'])(ctx)
  const movementResult = getFrodosMovementResult(maze, movesString)
  ctx.body = movementResult
}

router.post('/server', server)

module.exports = {
  router,
  getFrodosLocation,
  getNextLocation,
  isFrodoOut,
  getFrodosMovementResult,
  getResultMessage,
}
