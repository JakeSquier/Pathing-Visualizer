
// eslint-disable-next-line import/no-anonymous-default-export
var self = this;
export default () => {
    // eslint-disable-line no-restricted-globals
    self.addEventListener("message", message => {
      if (!message) return;
        function dijkstra(grid, startNode, finishNode, stopNode=false){
            //setting up stop var to determine what to do
            var isStop;
            if(stopNode===false){
              isStop = false
            } else {
              isStop = true
            }
            console.log(stopNode)
            if(!isStop){
            const visitedNodesInOrder = []
            //grabbing all nodes
            var unvisitedNodes = getAllNodes(grid)
            //setting node distances
            unvisitedNodes.forEach((node) => {
                if(node === startNode){
                node.distance = 0
                } else {
                node.distance = Infinity
                }
            })
        
            //starting algorithim
            while(!!unvisitedNodes){     
                sortNodesByDistance(unvisitedNodes, false)
                
                const closestNode = unvisitedNodes.shift()
        
                //checking if current node is a wall
                if(closestNode.isWall) continue
        
                //checking if node has no where to venture to
                if(closestNode.distance === Infinity) return visitedNodesInOrder
                //update current node as visited then pushing it to visitednodes array
                closestNode.isVisited = true
                visitedNodesInOrder.push(closestNode)

                //checking to see is closest node is the finishnode
                if(closestNode === finishNode) return visitedNodesInOrder
        
                //get current nodes neighbors
                updateUnvisitedNeighbors(closestNode, grid, false)
            }
            } else if(isStop){
            //going to repeat normal function yet twice for stop
            const visitedNodesInOrder = [[],[]]
            //grabbing all nodes
            var unvisitedNodes = getAllNodes(grid)
        
            var unvisitedNodesSecond = getAllNodes(grid)
              
            unvisitedNodes.forEach((node) => {
                if(node === startNode){
                node.distance = 0
                } else if(node === stopNode) {
                node.distanceSecond = 0
                } else {
                node.distance = Infinity
                node.distanceSecond = Infinity
                }
            })
        
            //getting path from start to stop
            while(!!unvisitedNodes) {
                sortNodesByDistance(unvisitedNodes, false)
                const closestNode = unvisitedNodes.shift()
        
                //checking if current node is a wall
                if(closestNode.isWall) continue
        
                //checking if node has no where to venture to
                if(closestNode.distance === Infinity) break
        
                //update current node as visited then pushing it to visitednodes array
                closestNode.isVisited = true
                visitedNodesInOrder[0].push(closestNode)
        
                //checking to see is closest node is the finishnode
                if(closestNode === stopNode) break
        
                //get current nodes neighbors
                updateUnvisitedNeighbors(closestNode, grid, false)
            }
            
            //getting path from stop to finish
            while(!!unvisitedNodesSecond) {
                
                sortNodesByDistance(unvisitedNodesSecond, true)

                const closestNode = unvisitedNodesSecond.shift()
        
                if(closestNode.isWall) continue
        
                if(closestNode.distanceSecond === Infinity) break

                closestNode.isVisitedSecond = true
                visitedNodesInOrder[1].push(closestNode)
        
                if(closestNode === finishNode) break
        
                updateUnvisitedNeighbors(closestNode, grid, true)
            }
            return visitedNodesInOrder
        }
    }

        function sortNodesByDistance(unvisitedNodes, isStop) {
            //it is not calculating second distace correctly stays at infinity
            unvisitedNodes.sort((nodeA, nodeB) => {
              if(isStop===true) {

                return nodeA.distanceSecond - nodeB.distanceSecond
              } else {
                
                return nodeA.distance - nodeB.distance
              }
            });
            var distanceCheck = []
            if(isStop){
              unvisitedNodes.forEach((node) => {
                if(node.distanceSecond !== Infinity) distanceCheck.push(node)
              })
            }
        }
        
        function updateUnvisitedNeighbors(node, grid, isStop) {
            const unvisitedNeighbors = getUnvisitedNeighbors(node, grid, isStop)
            for (const neighbor of unvisitedNeighbors) {
              isStop ? neighbor.distanceSecond = node.distanceSecond + 1 : neighbor.distance = node.distance + 1
        
              isStop ? neighbor.previousNodeSecond = node : neighbor.previousNode = node
            }
        }
          
        function getUnvisitedNeighbors(node, grid, isStop) {
            const neighbors = [];
            const {col, row} = node
            if (row > 0) neighbors.push(grid[row - 1][col])
            if (row < grid.length - 1) neighbors.push(grid[row + 1][col])
            if (col > 0) neighbors.push(grid[row][col - 1])
            if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1])
            return neighbors.filter((neighbor) => {
              //isStop ? !neighbor.isVisitedSecond : !neighbor.isVisited
              if(isStop===true){
                return !neighbor.isVisitedSecond
              } else {
                return !neighbor.isVisited
              }
            });
        }
        
        function getAllNodes(grid) {
            const nodes = []
            for (const row of grid) {
              for (const node of row) {
                nodes.push(node)
              }
            }
            return nodes
        }



        const grid = message.data[0]
        const startNode = message.data[1]
        const finishNode = message.data[2]
        const stopNode = message.data[3]
        const visitedNodesInorder = dijkstra(grid, startNode, finishNode, stopNode)
  
        postMessage(visitedNodesInorder)
    });
};
  
  // Backtracks from the finishNode to find the shortest path.
  // Only works when called *after* the dijkstra method above.
  export function getNodesInShortestPathOrder(finishNode, stop=false) {
      const nodesInShortestPathOrder = []
      let currentNode = finishNode
      while (currentNode !== null) {

        if(currentNode.isStart===true && stop===false || typeof currentNode.previousNode !== 'object') break

        if(currentNode.isStop===true && stop===true) break

        nodesInShortestPathOrder.unshift(currentNode)
        currentNode = currentNode.previousNode
      }
      return nodesInShortestPathOrder
  }