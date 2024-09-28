import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { zoom, setZoomListener } from '../manelbrot.ts';
import styles from './foreground.module.css';



export default function ZoomButton(){

    const [disabled, setDisabled] = useState<boolean>(false);
    const handleZoomDone = () => {if(disabled) setDisabled(false);};
    
    const onClick = () => {
        const zoomed = zoom();
        if(zoomed){
            setDisabled(true);
        }
    };

    setZoomListener(handleZoomDone);

    return (
        <Button id="zoom-button" aria-label="Zoom button" disabled={disabled} onClick={onClick} variant="light" className={`${styles.zoomButton} ${styles.jump}`} >
           <FontAwesomeIcon icon={faMagnifyingGlass} bounce/>
        </Button>
    );
}