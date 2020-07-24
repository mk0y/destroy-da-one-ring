var assert = require('assert')
const mazes = require('./maze.mocks')
const server = require('../server')

describe('Unit: server.js', () => {
  describe('#getFrodosLocation()', () => {
    it('should find Frodo location', () => {
      const frodosLocation = server.getFrodosLocation(mazes.mazeWithFrodo)
      assert.deepStrictEqual(frodosLocation, { x: 0, y: 5 })
    })
    it('should not find Frodo location', () => {
      const frodosLocation = server.getFrodosLocation(mazes.mazeWithoutFrodo)
      assert(!frodosLocation)
    })
  })

  describe('#isFrodoOut()', () => {
    it('Frodo fell out - north', () => {
      const isOut = server.isFrodoOut(mazes.mazeWithFrodo, { x: 3, y: 0 }, 'n')
      assert(isOut)
    })
    it('Frodo fell out - south', () => {
      const isOut = server.isFrodoOut(mazes.mazeWithFrodo, { x: 3, y: 9 }, 's')
      assert(isOut)
    })
    it('Frodo fell out - east', () => {
      const isOut = server.isFrodoOut(mazes.mazeWithFrodo, { x: 9, y: 2 }, 'e')
      assert(isOut)
    })
    it('Frodo fell out - west', () => {
      const isOut = server.isFrodoOut(mazes.mazeWithFrodo, { x: 0, y: 5 }, 'w')
      assert(isOut)
    })
  })

  describe('#getNextLocation()', () => {
    it('goes north (n)', () => {
      const nextLocation = server.getNextLocation({ x: 0, y: 1 }, 'n')
      assert.deepStrictEqual(nextLocation, { x: 0, y: 0 })
    })

    it('goes south (s)', () => {
      const nextLocation = server.getNextLocation({ x: 0, y: 1 }, 's')
      assert.deepStrictEqual(nextLocation, { x: 0, y: 2 })
    })

    it('goes east (e)', () => {
      const nextLocation = server.getNextLocation({ x: 1, y: 1 }, 'e')
      assert.deepStrictEqual(nextLocation, { x: 2, y: 1 })
    })

    it('goes west (w)', () => {
      const nextLocation = server.getNextLocation({ x: 1, y: 1 }, 'w')
      assert.deepStrictEqual(nextLocation, { x: 0, y: 1 })
    })
  })

  describe('#getFrodosMovementResult()', () => {
    it('should go out of map', () => {
      let movementMessage = server.getFrodosMovementResult(mazes.mazeWithFrodo, 'w,w,w')
      assert.strictEqual(movementMessage, server.getResultMessage())
      movementMessage = server.getFrodosMovementResult(mazes.mazeWithFrodo, 's,s,s,s,s,s,s')
      assert.strictEqual(movementMessage, server.getResultMessage())
    })

    it('should meet Orc', () => {
      const movementMessage = server.getFrodosMovementResult(mazes.mazeWithFrodo, 'e,n,n')
      assert.strictEqual(movementMessage, server.getResultMessage('O'))
    })

    it('should find nothing', () => {
      const movementMessage = server.getFrodosMovementResult(mazes.mazeWithFrodo, 'e,e,n,e')
      assert.strictEqual(movementMessage, server.getResultMessage('-'))
    })

    it('ring is destroyed, Mount Doom is found', () => {
      const movementMessage = server.getFrodosMovementResult(mazes.mazeWithFrodo, 'e,e,n,e,e,n,e,e,n,n,e')
      assert.strictEqual(movementMessage, server.getResultMessage('D'))
    })
  })
})
