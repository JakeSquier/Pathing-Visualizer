import React, {Component} from "react";
import algData from '../../data/alg-data'
import './navmini.css'
import IconButton from '@material-ui/core/IconButton';
import ReplayIcon from '@material-ui/icons/Replay';
import CloseIcon from '@mui/icons-material/Close';
import Start from '../../media/right-arrow.png'
import Finish from '../../media/dart-board.png'
import Stop from '../../media/stop.png'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import { FaAngleDoubleRight } from 'react-icons/fa'

class NavTop extends Component {

    getWaves = () => {
        var wave, currItemPic, currBtnColor;
        var currItem = this.props.state.currItemDesc
        if(currItem === 'Start'){
            wave = 'start-item-back'
            currItemPic = <img className='item-picture-mini start-picture' style={{height: '40px', width: '40px'}} src={Start}/>
            currBtnColor = 'active-start'
            return [wave, currItemPic, currBtnColor]
        } else if(currItem === 'Target'){
            wave = 'target-item-back'
            currItemPic = <img className='item-picture-mini target-picture' style={{height: '40px', width: '40px'}} src={Finish} />
            currBtnColor = 'active-target'
            return [wave, currItemPic, currBtnColor]
        } else if(currItem === 'Wall'){
            wave = 'wall-item-back'
            currItemPic = <div className='wall-picture-mini'></div>
            currBtnColor = 'active-wall'
            return [wave, currItemPic, currBtnColor]
        } else if(currItem === 'Stop'){
            wave = 'stop-item-back'
            currItemPic = <img className='item-picture-mini stop-picture' style={{height: '45px', width: '45px'}} src={Stop} />
            currBtnColor = 'active-stop'
            return [wave, currItemPic, currBtnColor]
        }
    }

    algChange = (e) => {
        var val = e.target.dataset.val
        console.log(val)
    }

    render(){
        const info = this.getWaves()
        const wave = info[0]
        const currItemPic = info[1]
        const currBtnColor = info[2]
        const showNav = this.props.state.showNav
        const items = ['Start', 'Target', 'Wall', 'Stop']
        const mazeAlgs = ['Recursive Division Maze', 'Vertical Division Maze', 'Horizontal Divsion Maze', 'Random Maze']
        const currItem = this.props.state.currItemObj
        const currAlg = this.props.state.currAlgObj
        const screenHeight = window.innerHeight

        if(window.innerWidth > 1000) {
            return(
                <div className='side-nav-container'>
                    <div className='reset-options-container'>
                        <div className='reset-container'>
                            <IconButton onClick={this.props.clearGrid} color="primary">
                                    <CloseIcon className="erase-btn" />
                            </IconButton>
                        </div>
                        <div className='erase-container'>
                            <IconButton onClick={this.props.resetGrid} color="primary">
                                    <ReplayIcon className="reset-btn" />
                            </IconButton>
                        </div>
                    </div>
                </div>
            )
        }

        return(
            <div className={`nav-bar-mini nav-mini-${showNav ? 'active' : 'inactive'}`}>
                <div className='nav-toggle-container-mini'>
                    <IconButton className="nav-btn-mini" onClick={this.props.toggleNav}>
                        {this.props.state.showNav ? <ArrowCircleDownIcon /> : <ArrowCircleUpIcon />}
                    </IconButton>
                </div>
                <div className="top-container-mini">
                    <div className="alg-selector-mini">
                        <div className="alg-select-wrapper-mini">
                            {
                                algData.map((alg, val) => {
                                    if(alg.id === currAlg.id) return ( <h4 className='title-mini'>{alg.name}</h4> )
                                })
                            }
                            <IconButton onClick={this.props.handleMiniTabs}>
                                <ArrowForwardIosIcon className="next-btn" fontSize="inherit"/>
                            </IconButton>
                        </div>
                    </div>
                    <div className="alg-card-mini">
                        <div className="alg-text-mini">
                            <h2>{currAlg.name}</h2>
                            <p>{currAlg.description}</p>
                        </div>
                        <div className="alg-play-mini">
                            <IconButton onClick={this.props.play}>
                                <PlayCircleFilledIcon className="play-mini" size="10em" fontSize="inherit"/>
                            </IconButton>
                            <IconButton onClick={this.props.clearGrid} color="primary">
                                <CloseIcon className="erase-mini" />
                            </IconButton>
                            <IconButton onClick={this.props.resetGrid} color="primary">
                                <ReplayIcon className="reset-mini" />
                            </IconButton>
                        </div>
                    </div>
                </div>
                <div className="middle-container-mini">
                    <button className='generate-btn-mini' onClick={this.props.genMaze}>Generate Maze</button>
                    <div className="card-container-mini">
                        <div className="maze-alg-selector-mini">
                            <IconButton onClick={() => this.props.handleMiniMazeTabs(true)}>
                                <KeyboardArrowUpIcon className='arrow-btn-up'/>
                            </IconButton>
                            {
                                mazeAlgs.map((alg, val) => {
                                    if(val === this.props.state.currMazeTab) return (
                                        <div className="maze-title-mini"><h4 className='title-mini'>{alg}</h4></div>
                                    )
                                })
                            }
                            <IconButton onClick={() => this.props.handleMiniMazeTabs(false)}>
                                <KeyboardArrowDownIcon className='arrow-btn-down'/>
                            </IconButton>
                        </div>
                        <div className="speed-controls-container-mini">
                            <IconButton onClick={(e) => {this.props.handleSpeedChange(e, true)}}>
                                <RemoveIcon className='subtract-btn'/>
                            </IconButton>
                            <p className='speed-text-mini'>{this.props.state.animationSpeed}</p>
                            <IconButton onClick={(e) => {this.props.handleSpeedChange(e, false)}}>
                                <AddIcon className='add-btn'/>
                            </IconButton>
                        </div>
                    </div>
                </div>
                <div className="bottom-container-mini">
                    <div className={`item-card-mini ${wave}`}>
                        <div className="items-selector">
                            {items.map((item, i) => {
                                const isCurrItem = this.props.state.currItemDesc === item
                                return (
                                    <a className={`item-btn item-btn-${isCurrItem ? `${currBtnColor}` : 'inactive'} ${i===0 ? 'first-btn' : ''} ${i===(items.length-1) ? 'last-btn' : ''}`} id={`${item}-btn`}
                                    onClick={(e) => {this.props.handleItemChange(e, item)}}>
                                        <p className="item-btn-text">{item}</p>
                                    </a>
                                );
                            })}
                        </div>
                        <div className='item-info-mini'>
                            <h2>{currItem.title}</h2>
                            <div className="item-text-mini">
                                <p>{currItem.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NavTop