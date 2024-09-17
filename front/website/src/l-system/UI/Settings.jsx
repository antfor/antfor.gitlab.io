import FormSelect from 'react-bootstrap/FormSelect';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import InputGroup from 'react-bootstrap/InputGroup';
import Card from 'react-bootstrap/Card';
import { getFractals, getIteration, getOptions } from "../Fractal/FractalOptions.mjs";
import styles from './CSS/settings.module.css';

const fractals = getFractals();

function DropDown(fractal, setFractal, setIterations, disabled){

    const onChange = (e) =>{
        const newFractal = e.target.value;
        setFractal(newFractal);
        setIterations(getIteration(newFractal));
    }; 

    return (
        <FormSelect disabled={disabled} onChange={onChange} value={fractal}>
            {fractals.map((f) => {
                return <option key={f} value={f}>{f}</option>
            })}
        </FormSelect>
    );
}

function IteraionDropDown(options, iteration, setIterations, disabled){

    const onChange = (e) => setIterations(Number(e.target.value));

    const length = {length: options.maxIterations - options.minIterations + 1};
    const iterations = Array.from(length, (_, i) => i + options.minIterations);
    return (
        <FormSelect disabled={disabled} className={styles.m2} onChange={onChange} value={iteration}>
            {iterations.map((i) => {
                return <option key={i} value={i}>{i}</option>
            })}
        </FormSelect>
    );
}

function Buttons(options, iteraion, setIterations, disabled){

    const disableMin = disabled || iteraion <= options.minIterations;
    const disableMax = disabled || iteraion >= options.maxIterations;

    return (
        <Stack direction="horizontal" gap="3">
            {IteraionDropDown(options, iteraion, setIterations, disabled)}
            <InputGroup className="btn-group">
                <Button disabled={disableMin} variant="outline-danger" className={styles.button} onClick={() => setIterations(iteraion-1)}>-</Button>
                <Button disabled={disableMax} variant="outline-primary" className={styles.button} onClick={() => setIterations(iteraion+1)}>+</Button>
            </InputGroup>
        </Stack>
    );
}

export function Settings(fractal, setFractal, iteraion, setIterations, disabled) {

    const options = getOptions(fractal);

    return (
        <Card data-bs-theme="dark" className={styles.opacity50}>
            <Card.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Fractal</Form.Label>
                        {DropDown(fractal, setFractal, setIterations, disabled)}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Iterations</Form.Label>
                        {Buttons(options, iteraion, setIterations, disabled)}
                    </Form.Group>
                </Form>
            </Card.Body>
        </Card>
    )
}