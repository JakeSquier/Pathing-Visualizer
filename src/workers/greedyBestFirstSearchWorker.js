var self = this;
export default () => {
    // eslint-disable-line no-restricted-globals
    self.addEventListener("message", message => {
        if (!message) return;

        function greedyBFS(grid, startNode, finishNode, stopNode=false) {

            if (!startNode || !finishNode || startNode === finishNode) {
                return false;
            }

            var isStop;
            if(stopNode===false){
                isStop = false
            } else {
                isStop = true
            }
            if(!isStop){
                let unvisitedNodes = [];
                let visitedNodesInOrder = [];
                startNode.distance = 0;
                unvisitedNodes.push(startNode);
              
                while (unvisitedNodes.length !== 0) {
                  unvisitedNodes.sort((a, b) => a.totalDistance - b.totalDistance);
                  let closestNode = unvisitedNodes.shift();
                  if (closestNode === finishNode) {
                    visitedNodesInOrder.push(closestNode)
                    return visitedNodesInOrder;
                  }
              
                  closestNode.isVisited = true;
                  visitedNodesInOrder.push(closestNode);
              
                  let neighbours = getNeighbours(closestNode, grid);
                  for (let neighbour of neighbours) {
                    let distance = closestNode.distance + 1;
                    //f(n) = h(n)
                    if (neighbourNotInUnvisitedNodes(neighbour, unvisitedNodes)) {
                      unvisitedNodes.unshift(neighbour);
                      neighbour.distance = distance;
                      neighbour.totalDistance = manhattenDistance(neighbour, finishNode);
                      neighbour.previousNode = closestNode;
                    } else if (distance < neighbour.distance) {
                      neighbour.distance = distance;
                      neighbour.totalDistance = manhattenDistance(neighbour, finishNode);
                      neighbour.previousNode = closestNode;
                    }
                  }
                }
                
                return visitedNodesInOrder;

            } else if(isStop){

                let unvisitedNodes = []
                let unvisitedNodesSecond = []
                let firstSearch = []
                let secondSearch = []
                startNode.distance = 0
                unvisitedNodes.push(startNode)
                unvisitedNodesSecond.push(stopNode)
              
                while (unvisitedNodes.length !== 0) {
                  unvisitedNodes.sort((a, b) => a.totalDistance - b.totalDistance)
                  let closestNode = unvisitedNodes.shift()
                  if (closestNode === stopNode) {
                    firstSearch.push(closestNode)
                    break
                  }
              
                  closestNode.isVisited = true;
                  firstSearch.push(closestNode);
              
                  let neighbours = getNeighbours(closestNode, grid, false)
                  for (let neighbour of neighbours) {
                    let distance = closestNode.distance + 1
                    //f(n) = h(n)
                    if (neighbourNotInUnvisitedNodes(neighbour, unvisitedNodes)) {
                      unvisitedNodes.unshift(neighbour)
                      neighbour.distance = distance
                      neighbour.totalDistance = manhattenDistance(neighbour, stopNode);
                      neighbour.previousNode = closestNode
                    } else if (distance < neighbour.distance) {
                      neighbour.distance = distance
                      neighbour.totalDistance = manhattenDistance(neighbour, stopNode);
                      neighbour.previousNode = closestNode
                    }
                  }
                }

                while (unvisitedNodesSecond.length !== 0) {
                  unvisitedNodesSecond.sort((a, b) => a.totalDistanceSecond - b.totalDistanceSecond)
                  let closestNode = unvisitedNodesSecond.shift()
                  if (closestNode === finishNode) {
                    secondSearch.push(closestNode)
                    break
                  }
              
                  closestNode.isVisitedSecond = true
                  secondSearch.push(closestNode)
              
                  let neighbours = getNeighbours(closestNode, grid, true)
                  for (let neighbour of neighbours) {
                    let distance = closestNode.distanceSecond + 1;
                    //f(n) = h(n)
                    if (neighbourNotInUnvisitedNodes(neighbour, unvisitedNodesSecond)) {
                      unvisitedNodesSecond.unshift(neighbour)
                      neighbour.distanceSecond = distance
                      neighbour.totalDistanceSecond = manhattenDistance(neighbour, finishNode)
                      neighbour.previousNodeSecond = closestNode
                    } else if (distance < neighbour.distanceSecond) {
                      neighbour.distanceSecond = distance
                      neighbour.totalDistanceSecond = manhattenDistance(neighbour, finishNode)
                      neighbour.previousNodeSecond = closestNode
                    }
                  }
                }

                return [firstSearch, secondSearch]
            }
        }

        function getNeighbours(node, grid, isStop) {
            let neighbour = [];
            let { row, col } = node;
            
            if(isStop) {
                if (row !== 0) neighbour.push(grid[row - 1][col])
                if (col !== grid[0].length - 1) neighbour.push(grid[row][col + 1])
                if (row !== grid.length - 1) neighbour.push(grid[row + 1][col])
                if (col !== 0) neighbour.push(grid[row][col - 1])
            } else {
                if (row !== 0) neighbour.push(grid[row - 1][col])
                if (col !== grid[0].length - 1) neighbour.push(grid[row][col + 1])
                if (row !== grid.length - 1) neighbour.push(grid[row + 1][col])
                if (col !== 0) neighbour.push(grid[row][col - 1])
            }
            return neighbour.filter(
              (node) => {
                  if(isStop){
                    return !node.isWall && !node.isVisitedSecond
                  } else {
                    return !node.isWall && !node.isVisited
                  }
                }
            );
        }

        function manhattenDistance(node, finishNode) {
            let x = Math.abs(node.row - finishNode.row)
            let y = Math.abs(node.col - finishNode.col)
            return x + y;
        }

        function neighbourNotInUnvisitedNodes(neighbour, unvisitedNodes) {
            for (let node of unvisitedNodes) {
              if (node.row === neighbour.row && node.col === neighbour.col) {
                return false
              }
            }
            return true
        }

        const grid = message.data[0]
        const startNode = message.data[1]
        const finishNode = message.data[2]
        const stopNode = message.data[3]
        const visitedNodesInOrder = greedyBFS(grid, startNode, finishNode, stopNode)

        postMessage(visitedNodesInOrder)
    })
}

export function getNodesInShortestPathOrderGreedyBFS(finishNode) {
    let nodesInShortestPathOrder = []
    let currentNode = finishNode
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode)
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder
}