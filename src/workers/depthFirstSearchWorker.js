// eslint-disable-next-line import/no-anonymous-default-export
var self = this;
export default () => {
    // eslint-disable-line no-restricted-globals
    self.addEventListener("message", message => {
        if (!message) return;

        function depthFirstSearch(grid, startNode, finishNode, stopNode=false) {

            var isStop;
            if(stopNode===false){
                isStop = false
            } else {
                isStop = true
            }

            if(!isStop) {

                const visitedNodesInOrder = []
                // queue to keep track of the visited nodes
                const queue = []
                queue.push(startNode)
                while (queue.length) {
                    const currNode = queue.pop()
                    // if the finsih node is reached then we return the visitedNodes array
                    if (currNode === finishNode) {
                        visitedNodesInOrder.push(currNode)
                        return visitedNodesInOrder
                    }
        
                    // we skip the nodes which are walls, start node or finish node
                    if (!currNode.isWall && (currNode.isStart || !currNode.isVisited)) {
                        currNode.isVisited = true
                        visitedNodesInOrder.push(currNode)
                        const { row, col } = currNode
                        updateUnvisitedNeighbours(row, col, queue, grid, currNode, false)
                    }
                }
                return visitedNodesInOrder
      
            } else if(isStop) {

                const firstSearch = []
                const secondSearch = []
                let queue = []
                let queueSecond = []
                queue.push(startNode)
                queueSecond.push(stopNode)
                
                while (queue.length) {
                    const currNode = queue.pop()
                    // if the finsih node is reached then we return the visitedNodes array
                    if (currNode === stopNode) {
                        firstSearch.push(currNode)
                        break
                    }
        
                    // we skip the nodes which are walls, start node or finish node
                    if (!currNode.isWall && (currNode.isStart || !currNode.isVisited)) {
                        currNode.isVisited = true
                        firstSearch.push(currNode)
                        const { row, col } = currNode;
                        updateUnvisitedNeighbours(row, col, queue, grid, currNode, false)
                    }
                }

                while (queueSecond.length) {
                    const currNode = queueSecond.pop()
                    // if the finish node is reached then we return the visitedNodes array
                    if (currNode === finishNode) {
                        secondSearch.push(currNode)
                        break
                    }
        
                    // we skip the nodes which are walls, start node or finish node
                    if (!currNode.isWall && (currNode.isStart || !currNode.isVisitedSecond)) {
                        currNode.isVisitedSecond = true
                        secondSearch.push(currNode)
                        const { row, col } = currNode
                        updateUnvisitedNeighbours(row, col, queueSecond, grid, currNode, true)
                    }
                }
                
                return [firstSearch, secondSearch]
            }
        }

        function  updateUnvisitedNeighbours(row, col, queue, grid, currNode, isStop) {
            let next;

            if(isStop) {
                if (row > 0) {
                    next = grid[row - 1][col]
                    if (!next.isVisitedSecond) {
                      next.previousNodeSecond = currNode
                      queue.push(next)
                    }
                  }
                  if (row < grid.length - 1) {
                    next = grid[row + 1][col]
                    if (!next.isVisitedSecond) {
                      next.previousNodeSecond = currNode
                      queue.push(next)
                    }
                  }
                  if (col < grid[0].length - 1) {
                    next = grid[row][col + 1]
                    if (!next.isVisitedSecond) {
                      next.previousNodeSecond = currNode
                      queue.push(next)
                    }
                  }
                  if (col > 0) {
                    next = grid[row][col - 1]
                    if (!next.isVisitedSecond) {
                      next.previousNodeSecond = currNode
                      queue.push(next)
                    }
                  }
                  return

            } else if(!isStop) {
                if (row > 0) {
                    next = grid[row - 1][col]
                    if (!next.isVisited) {
                      next.previousNode = currNode
                      queue.push(next)
                    }
                  }
                  if (row < grid.length - 1) {
                    next = grid[row + 1][col]
                    if (!next.isVisited) {
                      next.previousNode = currNode
                      queue.push(next)
                    }
                  }
                  if (col < grid[0].length - 1) {
                    next = grid[row][col + 1]
                    if (!next.isVisited) {
                      next.previousNode = currNode
                      queue.push(next)
                    }
                  }
                  if (col > 0) {
                    next = grid[row][col - 1]
                    if (!next.isVisited) {
                      next.previousNode = currNode
                      queue.push(next)
                    }
                  }
                  return
            }
        }

        const grid = message.data[0]
        const startNode = message.data[1]
        const finishNode = message.data[2]
        const stopNode = message.data[3]
        const visitedNodesInOrder = depthFirstSearch(grid, startNode, finishNode, stopNode)

        postMessage(visitedNodesInOrder)
    })
}