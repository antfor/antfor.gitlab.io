import FormSelect from 'react-bootstrap/FormSelect';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import InputGroup from 'react-bootstrap/InputGroup';
import Card from 'react-bootstrap/Card';
import { getFractals, getIteration, getOptions } from "../LsystemModule/FractalOptions.mjs";
import styles from './settings.module.css';

const fractals = getFractals();

function DropDown(fractal, setFractal, setIterations){

    const onChange = (e) =>{
        const newFractal = e.target.value;
        setFractal(newFractal);
        setIterations(getIteration(newFractal));
    }; 

    return (
        <FormSelect onChange={onChange} value={fractal}>
            {fractals.map((f) => {
                return <option key={f} value={f}>{f}</option>
            })}
        </FormSelect>
    );
}

function IteraionDropDown(options, iteration, setIterations){

    const onChange = (e) => setIterations(e.target.value);

    const length = {length: options.maxIterations - options.minIterations + 1};
    const iterations = Array.from(length, (_, i) => i + options.minIterations);
    return (
        <FormSelect className={styles.m2} onChange={onChange} value={iteration}>
            {iterations.map((i) => {
                return <option key={i} value={i}>{i}</option>
            })}
        </FormSelect>
    );
}

function Buttons(options, iteraion, setIterations){

    const disableMin = iteraion <= options.minIterations;
    const disableMax = iteraion >= options.maxIterations;

    return (
        <Stack direction="horizontal" gap="3">
            {IteraionDropDown(options, iteraion, setIterations)}
            <InputGroup className="btn-group">
                <Button disabled={disableMin} variant="outline-danger" className={styles.button} onClick={() => setIterations(iteraion-1)}>-</Button>
                <Button disabled={disableMax} variant="outline-primary" className={styles.button} onClick={() => setIterations(iteraion+1)}>+</Button>
            </InputGroup>
        </Stack>
    );
}

export function Settings(fractal, setFractal, iteraion, setIterations) {

    const options = getOptions(fractal);

    return (
        <Card className={styles.opacity50}>
            <Card.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Fractal</Form.Label>
                        {DropDown(fractal, setFractal, setIterations)}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Iterations</Form.Label>
                        {Buttons(options, iteraion, setIterations)}
                    </Form.Group>
                </Form>
            </Card.Body>
        </Card>
    )
}