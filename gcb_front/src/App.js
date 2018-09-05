import React, {
  Component
} from 'react';
import logo from './logo.svg';
import './App.css';

import CytoscapeDagreGraph from './components/CytoscapeDagreGraph'
import CytoscapeKlayGraph from './components/CytoscapeKlayGraph'
import IGV from './components/IGV'
import Selector from './components/Selector'

class App extends Component {

  state = {
    org: 'coli',
    organisms: [],
    og_start: 'OG0000052',
    og_end: 'OG0000410',
    reference: 'GCF_000007365.1_ASM736v1_genomic',
    window: '5',
    data: ''
  };

  getDataFromSelector = (data_from_selector) => {
    console.log(data_from_selector)
    let link = 'http://127.0.0.1:5000/org/' + data_from_selector.org + '/strain/' + data_from_selector.reference + '/start/';
    link = link + data_from_selector.og_start + '/end/' + data_from_selector.og_end
    fetch(link)
      .then(response => response.json())
      .then(data => this.setState({ ['data']: data }))
      .catch(error => console.log('ERROR'));
  }

  render() {
    return (
      < div className="App" >
        < header className="App-header" >
          < h1 className="App-title" > Genome Complexity Browser </h1>
        </header>
        <p className="App-intro" >
          <code > Complexity Graph </code>
        </p>

        <CytoscapeDagreGraph data={this.state.data} />

        <Selector getDataFromSelector={this.getDataFromSelector} />

        {/* <IGV / > */}

      </div>
    );
  }
}

export default App;