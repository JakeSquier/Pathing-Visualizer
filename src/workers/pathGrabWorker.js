// eslint-disable-next-line import/no-anonymous-default-export
var self = this;
export default () => {
    // eslint-disable-line no-restricted-globals
    self.addEventListener("message", message => {

        if (!message) return;

        var stopNode=false, finishNode=false, startNode=false

        const stop = message.data[1]
        const nodes = stop ? [...message.data[0][0], ...message.data[0][1]] : message.data[0]

        nodes.map((node) => {

            if(node.isStop === true) stopNode = node

            if(node.isFinish === true) finishNode = node

            if(node.isStart === true) startNode = node

            return node
        })

        var nodesInShortestPathOrder = [];

        if(!stop) {

            if(finishNode === false) postMessage(false)

            let currentNode = finishNode

            while (currentNode !== null) {

                if(currentNode.isStart===true) break

                nodesInShortestPathOrder.unshift(currentNode)

                currentNode = currentNode.previousNode
            }

            if(!nodesInShortestPathOrder[0].isStart) nodesInShortestPathOrder.unshift(startNode)

            postMessage(nodesInShortestPathOrder)

        } else if(stop) {

            var startToStop=[], stopToFinish=[]
            let currentNodeFin = finishNode
            let currentNodeStop = stopNode

            if (message.data[0][1].filter(node => node.isFinish === true).length > 0) {
                while (currentNodeFin !== null) {

                    if(currentNodeFin.isStop===true) break;
    
                    stopToFinish.unshift(currentNodeFin);
    
                    currentNodeFin = currentNodeFin.previousNodeSecond;
                }
                if(!stopToFinish[0].isStop) stopToFinish.unshift(stopNode)
            } else {
                stopToFinish.unshift(false)
            }

            if (message.data[0][0].filter(node => node.isStop === true).length > 0) {
                while (currentNodeStop !== null) {

                    if(currentNodeStop.isStart===true) break;

                    startToStop.unshift(currentNodeStop);

                    currentNodeStop = currentNodeStop.previousNode;
                }
                if(!startToStop[0].isStart) startToStop.unshift(startNode)

            } else {
                startToStop.unshift(false)
            }

            postMessage([startToStop, stopToFinish])
        }
    })
}