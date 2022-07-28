const algData = [
    {
        name: "Dijkstra's algorithim",
        description: "Dijkstra's Algorithm starts at the chosen source node and continues to expand outwards calculating distance up until the target node has been reached.",
        id: 0
    },
    {
        name: "A* search",
        description: "A* search is identical to Dijkstra's but, it has brains. A* search calculates the theoretical distance from source to target using the pythagorean theorem.",
        id: 1
    },
    {
        name: "Greedy Best-first Search",
        description: "Greedy Best-first Search is an algorithim which takes after depth-first search and breadth-first search, it uses the heuristic function and search.",
        id: 2
    },
    {
        name: "Bidirectional Greedy Search",
        description: "Bidirectional Greedy Search is Greedy Best-first Search but rather than it searching from just the source it searches from the target as well.",
        id: 3
    },
    {
        name: "Breadth-first search",
        description: "Breadth-first search searches every node in an organized manner until target has been reached but it does not calculate distance like Dijkstra's algorithim.",
        id: 4
    },
    {
        name: "Depth-first search",
        description: "Depth-first search begins at the source node then explores along each branch before backtracking and starting on the next branch.",
        id: 5
    }
]

export default algData