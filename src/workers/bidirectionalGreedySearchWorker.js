// eslint-disable-next-line import/no-anonymous-default-export
var self = this;
export default () => {
    // eslint-disable-line no-restricted-globals
    self.addEventListener("message", message => {
        if (!message) return;
        function bidirectionalGreedySearch(grid, startNode, finishNode) {
            if (!startNode || !finishNode || startNode === finishNode) {
            return false;
            }

            let unvisitedNodesStart = []
            let visitedNodesInOrderStart = []
            let unvisitedNodesFinish = []
            let visitedNodesInOrderFinish = []
            startNode.distance = 0
            finishNode.distance = 0
            unvisitedNodesStart.push(startNode)
            unvisitedNodesFinish.push(finishNode)
        
            while (
                unvisitedNodesStart.length !== 0 &&
                unvisitedNodesFinish.length !== 0
            ) {
                unvisitedNodesStart.sort((a, b) => a.totalDistance - b.totalDistance)
                unvisitedNodesFinish.sort((a, b) => a.totalDistance - b.totalDistance)
                let closestNodeStart = unvisitedNodesStart.shift()
                let closestNodeFinish = unvisitedNodesFinish.shift()
        
                closestNodeStart.isVisited = true;
                closestNodeFinish.isVisited = true;
                visitedNodesInOrderStart.push(closestNodeStart);
                visitedNodesInOrderFinish.push(closestNodeFinish);
                if (isNeighbour(closestNodeStart, closestNodeFinish)) {
                    return [visitedNodesInOrderStart, visitedNodesInOrderFinish, true];
                }
            
                //Start side search
                let neighbours = getNeighbours(closestNodeStart, grid);
                for (let neighbour of neighbours) {
                    if (!neighbourNotInUnvisitedNodes(neighbour, unvisitedNodesFinish)) {
                        visitedNodesInOrderStart.push(closestNodeStart);
                        visitedNodesInOrderFinish.push(neighbour);
                        return [visitedNodesInOrderStart, visitedNodesInOrderFinish, true];
                    }
                    let distance = closestNodeStart.distance + 1;
                    //f(n) = h(n)
                    if (neighbourNotInUnvisitedNodes(neighbour, unvisitedNodesStart)) {
                        unvisitedNodesStart.unshift(neighbour);
                        neighbour.distance = distance;
                        neighbour.totalDistance = manhattenDistance(neighbour, finishNode);
                        neighbour.previousNode = closestNodeStart;
                    } else if (distance < neighbour.distance) {
                        neighbour.distance = distance;
                        neighbour.totalDistance = manhattenDistance(neighbour, finishNode);
                        neighbour.previousNode = closestNodeStart;
                    }
                }
            
                //Finish side search
                neighbours = getNeighbours(closestNodeFinish, grid);
                for (let neighbour of neighbours) {
                    if (!neighbourNotInUnvisitedNodes(neighbour, unvisitedNodesStart)) {
                        visitedNodesInOrderFinish.push(closestNodeFinish);
                        visitedNodesInOrderStart.push(neighbour);
                        return [visitedNodesInOrderStart, visitedNodesInOrderFinish, true];
                    }
                    let distance = closestNodeFinish.distance + 1;
                    //f(n) = h(n)
                    if (neighbourNotInUnvisitedNodes(neighbour, unvisitedNodesFinish)) {
                        unvisitedNodesFinish.unshift(neighbour);
                        neighbour.distance = distance;
                        neighbour.totalDistance = manhattenDistance(neighbour, startNode);
                    neighbour.previousNode = closestNodeFinish;
                    } else if (distance < neighbour.distance) {
                        neighbour.distance = distance;
                        neighbour.totalDistance = manhattenDistance(neighbour, startNode);
                        neighbour.previousNode = closestNodeFinish;
                    }
                }
            }
            return [visitedNodesInOrderStart, visitedNodesInOrderFinish, false]
                      
        }

        function bidirectionalGreedySearchSecond(grid, stopNode, finishNode) {

            let unvisitedNodesStop = [];
            let visitedNodesInOrderStop = [];
            let unvisitedNodesFinish = [];
            let visitedNodesInOrderFinish = [];
            stopNode.distanceSecond = 0
            finishNode.distanceSecond = 0
            unvisitedNodesStop.push(stopNode)
            unvisitedNodesFinish.push(finishNode)

            while (
                unvisitedNodesStop.length !== 0 &&
                unvisitedNodesFinish.length !== 0
            ) {
                unvisitedNodesStop.sort((a, b) => a.totalDistanceSecond - b.totalDistanceSecond)
                unvisitedNodesFinish.sort((a, b) => a.totalDistanceSecond - b.totalDistanceSecond)
                let closestNodeStop = unvisitedNodesStop.shift()
                let closestNodeFinish = unvisitedNodesFinish.shift()

                closestNodeStop.isVisitedSecond = true
                closestNodeFinish.isVisitedSecond = true
                visitedNodesInOrderStop.push(closestNodeStop)
                visitedNodesInOrderFinish.push(closestNodeFinish)
                if (isNeighbour(closestNodeStop, closestNodeFinish)) {
                    return [visitedNodesInOrderStop, visitedNodesInOrderFinish, true, '1']
                }

                let neighbours = getNeighbours(closestNodeStop, grid, true)
                for(let neighbour of neighbours) {
                    if (!neighbourNotInUnvisitedNodes(neighbour, unvisitedNodesFinish)) {
                        visitedNodesInOrderStop.push(closestNodeStop);
                        visitedNodesInOrderFinish.push(neighbour);
                        return [visitedNodesInOrderStop, visitedNodesInOrderFinish, true]
                    }
                    let distance = closestNodeStop.distanceSecond + 1
                    
                    if (neighbourNotInUnvisitedNodes(neighbour, unvisitedNodesStop)) {
                        unvisitedNodesStop.unshift(neighbour)
                        neighbour.distanceSecond = distance
                        neighbour.totalDistanceSecond = manhattenDistance(neighbour, finishNode)
                        neighbour.previousNodeSecond = closestNodeStop
                    } else if (distance < neighbour.distanceSecond) {
                        neighbour.distanceSecond = distance;
                        neighbour.totalDistanceSecond = manhattenDistance(neighbour, finishNode);
                        neighbour.previousNodeSecond = closestNodeStop;
                    }
                }

                neighbours = getNeighbours(closestNodeFinish, grid, true);
                for (let neighbour of neighbours) {
                    if (!neighbourNotInUnvisitedNodes(neighbour, unvisitedNodesStop)) {
                        visitedNodesInOrderFinish.push(closestNodeFinish);
                        visitedNodesInOrderStop.push(neighbour);
                        return [visitedNodesInOrderStop, visitedNodesInOrderFinish, true];
                    }
                    let distance = closestNodeFinish.distanceSecond + 1;
                    //f(n) = h(n)
                    if (neighbourNotInUnvisitedNodes(neighbour, unvisitedNodesFinish)) {
                        unvisitedNodesFinish.unshift(neighbour);
                        neighbour.distanceSecond = distance;
                        neighbour.totalDistanceSecond = manhattenDistance(neighbour, stopNode);
                        neighbour.previousNodeSecond = closestNodeFinish;
                    } else if (distance < neighbour.distanceSecond) {
                        neighbour.distanceSecond = distance;
                        neighbour.totalDistanceSecond = manhattenDistance(neighbour, stopNode);
                        neighbour.previousNodeSecond = closestNodeFinish;
                    }
                }
            }
        }
        
        function isNeighbour(closestNodeStart, closestNodeFinish) {
            let rowStart = closestNodeStart.row;
            let colStart = closestNodeStart.col;
            let rowFinish = closestNodeFinish.row;
            let colFinish = closestNodeFinish.col;
            if (rowFinish === rowStart - 1 && colFinish === colStart) return true;
            if (rowFinish === rowStart && colFinish === colStart + 1) return true;
            if (rowFinish === rowStart + 1 && colFinish === colStart) return true;
            if (rowFinish === rowStart && colFinish === colStart - 1) return true;
            return false;
        }
        
        function getNeighbours(node, grid, isStop=false) {
            let neighbours = [];
            let { row, col } = node;
            if (row !== 0) neighbours.push(grid[row - 1][col]);
            if (col !== grid[0].length - 1) neighbours.push(grid[row][col + 1]);
            if (row !== grid.length - 1) neighbours.push(grid[row + 1][col]);
            if (col !== 0) neighbours.push(grid[row][col - 1]);
            
            if(isStop) {
                return neighbours.filter(
                    (neighbour) => !neighbour.isWall && !neighbour.isVisitedSecond
                );
            } else {
                return neighbours.filter(
                    (neighbour) => !neighbour.isWall && !neighbour.isVisited
                );
            }
        }
        
        function manhattenDistance(nodeA, nodeB) {
            let x = Math.abs(nodeA.row - nodeB.row);
            let y = Math.abs(nodeA.col - nodeB.col);
            return x + y;
        }
        
        function neighbourNotInUnvisitedNodes(neighbour, unvisitedNodes) {
            for (let node of unvisitedNodes) {
                if (node.row === neighbour.row && node.col === neighbour.col) {
                    return false;
                }
            }
            return true;
        }

        const grid = message.data[0]
        const startNode = message.data[1]
        const finishNode = message.data[2]
        const stopNode = message.data[3]
        const isStop = message.data[4]
        var visitedNodesInorder = []

        if (isStop) {

            visitedNodesInorder = [bidirectionalGreedySearch(grid, startNode, stopNode), bidirectionalGreedySearchSecond(grid, stopNode, finishNode)]
            postMessage(visitedNodesInorder)
        } else {

            visitedNodesInorder = bidirectionalGreedySearch(grid, startNode, finishNode)
            postMessage(visitedNodesInorder);
        }
    })
}

export function getNodesInShortestPathOrderBidirectionalGreedySearch(
    nodeA,
    nodeB
  ) {
    let nodesInShortestPathOrder = [];
    let currentNode = nodeB;
    while (currentNode !== null) {
      nodesInShortestPathOrder.push(currentNode);
      currentNode = currentNode.previousNode;
    }
    currentNode = nodeA;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}