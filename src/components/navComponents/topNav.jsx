import React, {Component} from "react";
import IconButton from '@material-ui/core/IconButton';
import ReplayIcon from '@material-ui/icons/Replay';
import CloseIcon from '@mui/icons-material/Close';

class NavTop extends Component {

    render(){

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
}

export default NavTop