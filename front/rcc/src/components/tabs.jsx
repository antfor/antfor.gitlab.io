import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import DiagnosForm from './diagnos.jsx';
import TillståndForm from './tillstånd.jsx';
import BehandlingForm from './behandling.jsx';
import Canceranmälan from './canceranmälan.jsx';




function FormTabs(patient, patienter, setPatienter){
    return(

      <Tabs
        defaultActiveKey="diagnos"
        id="tab-example"
        className="mb-3">

        <Tab eventKey="diagnos" title="Diagnoser">
          {DiagnosForm(patient, setPatienter)}
        </Tab>
        <Tab eventKey="behandling" title="Behandlingar">
          {BehandlingForm(patient, setPatienter)}
        </Tab>
        <Tab eventKey="tillstånd" title="Tillstånd">
          {TillståndForm(patient, setPatienter)}
        </Tab>
        <Tab eventKey="canceranmälan" title="Canceranmälan">
          {Canceranmälan(patient, patienter)}
        </Tab>
      </Tabs>
    );
}

export default FormTabs;