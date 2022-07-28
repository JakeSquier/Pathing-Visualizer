
// eslint-disable-next-line import/no-anonymous-default-export
var self = this;
export default () => {
    // eslint-disable-line no-restricted-globals
    self.addEventListener("message", message => {
      if (!message) return;
        function bfs(grid, startNode, finishNode, stopNode=false) {
            
            var isStop;
            if(stopNode===false){
                isStop = false
            } else {
                isStop = true
            }
            let visitedNodesInOrder = [];

            if(isStop) {
                // queue to keep track of the visited nodes
                let queue = [];
                let queueSecond = [];
                visitedNodesInOrder = [[],[]]
                queue.push(startNode);
                queueSecond.push(stopNode)
                while (queue.length) {
                    const currNode = queue.shift();
                    // if the finsih node is reached then we return the visitedNodes array
                    if (currNode === stopNode) {
                        visitedNodesInOrder[0].push(currNode);
                        break
                    }
                    
                    // we skip the nodes which are walls, start node or finish node
                    if (!currNode.isWall && (currNode.isStart || !currNode.isVisited)) {
                        currNode.isVisited = true;
                        visitedNodesInOrder[0].push(currNode);
                        const { row, col } = currNode;
                        updateUnvisitedNeighbours(row, col, queue, grid,currNode, false);
                    }
                }
                while (queueSecond.length) {
                    const currNode = queueSecond.shift();
                    // if the finsih node is reached then we return the visitedNodes array
                    if (currNode === finishNode) {
                        visitedNodesInOrder[1].push(currNode);
                        break
                    }
                    
                    // we skip the nodes which are walls, start node or finish node
                    if (!currNode.isWall && (currNode.isStart || !currNode.isVisitedSecond)) {
                        currNode.isVisitedSecond = true;
                        visitedNodesInOrder[1].push(currNode);
                        const { row, col } = currNode;
                        updateUnvisitedNeighbours(row, col, queueSecond, grid, currNode, true);
                    }
                }
                return visitedNodesInOrder

            } else if(!isStop) {
                // queue to keep track of the visited nodes
                let queue = [];
                queue.push(startNode);
                while (queue.length) {
                    const currNode = queue.shift();
                    // if the finsih node is reached then we return the visitedNodes array
                    if (currNode === finishNode) {
                        visitedNodesInOrder.push(currNode);
                        return visitedNodesInOrder;
                    }
                    
                    // we skip the nodes which are walls, start node or finish node
                    if (!currNode.isWall && (currNode.isStart || !currNode.isVisited)) {
                        currNode.isVisited = true;
                        visitedNodesInOrder.push(currNode);
                        const { row, col } = currNode;
                        updateUnvisitedNeighbours(row, col, queue, grid,currNode, false);
                    }
                }
                return visitedNodesInOrder
            }
  
        }
        
        // updates the neighbours,
        // in correspondance to the algorithm 
        function updateUnvisitedNeighbours(row, col, queue, grid, currNode, isStop=false) {

            if(isStop) {
                let next;
                if (row > 0) {
                  next = grid[row - 1][col];
                  if (!next.isVisitedSecond) {
                    queue.push(next);
                    next.previousNodeSecond = currNode;
                  }
                }
                if (row < grid.length - 1) {
                  next = grid[row + 1][col];
                  if (!next.isVisitedSecond) {
                    queue.push(next);
                    next.previousNodeSecond = currNode;
                  }
                }
                if (col > 0) {
                  next = grid[row][col - 1];
                  if (!next.isVisitedSecond) {
                    queue.push(next);
                    next.previousNodeSecond = currNode;
                  }
                }
                if (col < grid[0].length - 1) {
                  next = grid[row][col + 1];
                  if (!next.isVisitedSecond) {
                    queue.push(next);
                    next.previousNodeSecond = currNode;
                  }
                }
            } else if(!isStop) {
                let next;
                if (row > 0) {
                  next = grid[row - 1][col];
                  if (!next.isVisited) {
                    queue.push(next);
                    next.previousNode = currNode;
                  }
                }
                if (row < grid.length - 1) {
                  next = grid[row + 1][col];
                  if (!next.isVisited) {
                    queue.push(next);
                    next.previousNode = currNode;
                  }
                }
                if (col > 0) {
                  next = grid[row][col - 1];
                  if (!next.isVisited) {
                    queue.push(next);
                    next.previousNode = currNode;
                  }
                }
                if (col < grid[0].length - 1) {
                  next = grid[row][col + 1];
                  if (!next.isVisited) {
                    queue.push(next);
                    next.previousNode = currNode;
                  }
                }
            }
      }

        const grid = message.data[0]
        const startNode = message.data[1]
        const finishNode = message.data[2]
        const stopNode = message.data[3]

        const visitedNodesInOrder = bfs(grid, startNode, finishNode, stopNode)

        postMessage(visitedNodesInOrder)
    })
}