import React, {Component} from 'react';
import './visualizer.css'
import Node from './Node/Node.jsx'

export default class PathfindingVisualizer extends Component{

    render() {

        return (
            <div className="grid">
                {this.props.state.grid.map((row, rowIdx) => {
                    return(
                        <div key={rowIdx} className='grid-row'>
                            {row.map((node, nodeIdx) => {
                                const {row, col, isFinish, isStart, isWall, isWeight=false, isStop=false} = node;
                                return (
                                    <Node
                                        key={nodeIdx}
                                        col={col}
                                        isFinish={isFinish}
                                        isStart={isStart}
                                        isWall={isWall}
                                        isWeight={isWeight}
                                        isStop={isStop}
                                        mouseIsPressed={this.props.state.mouseIsPressed}
                                        onMouseDown={(row, col) => this.props.handleMouseDown(row, col)}
                                        onMouseEnter={(row, col) =>
                                            this.props.handleMouseEnter(row, col)
                                        }
                                        onMouseUp={(row, col) => this.props.handleMouseUp(row, col)}
                                        on
                                        row={row}
                                    />
                                );
                            })}
                        </div>
                    )
                })}
            </div>
        )
    }
}

