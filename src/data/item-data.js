const itemData = [
    {
        id: 'Start',
        title: 'Start Node',
        description: 'The Start node represents where we will start. You can click and drag the start node around anywhere on the grid to create a new starting point.'
    },
    {
        id: 'Target',
        title: 'Target Node',
        description: 'The target node represents the desired destination. You can click and drag the target node around anywhere on the grid to create a new destination.'
    },
    {
        id: 'Wall',
        title: 'Wall',
        description: 'Walls represent obstructions that stand in the way of you and your destination. Click and drag anywhere on the grid to create walls.'
    },
    // {
    //     id: 'Weight',
    //     title: 'Wheight',
    //     description: 'Wheights represent a node that will take longer to travel through than a regular node. Click and drag to drop wheights on the grid.'
    // },
    {
        id: 'Stop',
        title: 'Stop',
        description: 'A stop node represents a sub destination. This means that we must find the shortest route that includes a stop at the stop node.'
    }
]

export default itemData