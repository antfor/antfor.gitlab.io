import { Settings } from './Settings.jsx';
import styles from './settings.module.css';
import { useState } from 'react';



export function OffCanvas(fractalKey, setFractalKey, iteration, setIteration) {
    
    const [show, setShow] = useState(true);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div className={"d-flex align-items-center "+ styles.container}>
             {Settings(fractalKey, setFractalKey, iteration, setIteration)}
        </div>
    );
}