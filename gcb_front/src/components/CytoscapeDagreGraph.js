import React, {
    Component
} from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import '../App.css';

// dagre(cytoscape);
cytoscape.use(dagre);

let conf = {
    boxSelectionEnabled: false,
    autounselectify: true,
    zoomingEnabled: true,
    style: [{
            selector: 'node',
            style: {
                'label': 'data(id)',
                'text-opacity': 0.7,
                'font-size': "10pt",
                'text-valign': 'center',
                'text-halign': 'center',
                'background-color': 'data(color)',
            }
        },
        {
            selector: 'edge',
            style: {
                'width': 'data(penwidth)',
                'weight': 'data(penwidth)',
                "curve-style": "unbundled-bezier",
                'target-arrow-shape': 'triangle',
                'line-color': 'data(color)',
                'target-arrow-color': 'data(color)'
            }
        }
    ],
    elements: {},
    layout: {
        name: 'dagre',
        rankDir: "LR",
        ranker: 'network-simplex',
        nodeSep: 4, // the separation between adjacent nodes in the same rank
        edgeSep: 4, // the separation between adjacent edges in the same rank
        rankSep: 60, // the separation between adjacent nodes in the same rank
        edgeWeight: function (edge) {
            let w = edge.data().penwidth;
            let ww = 1;
            if (w > 6) {
                console.log(w);
                // 2ww = 1000;
            }
            return 1;
        }
    }
};

let cyStyle = {
    heigth: '100%',
    width: '100%',
    display: 'block'
};

class CytoscapeDagreGraph extends Component {


    constructor(props) {
        super(props);
        this.state = {
            cy: {}
        }
    }

    componentDidMount() {
        conf.container = this.cyRef;
        console.log(this.props.data);
        conf.elements = this.props.data;
        const cy = cytoscape(conf);

        this.state = {
            cy
        };
        // cy.json();

    }

    shouldComponentUpdate() {
        return false;
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.cy) {
            this.state.cy.destroy();
        }
        conf.container = this.cyRef;

        conf.elements = nextProps.data;

        const cy = cytoscape(conf);

        this.state = {
            cy
        };
    }

    componentWillUnmount() {
        if (this.state.cy) {
            this.state.cy.destroy();
        }
    }



    render() {
        return ( 
            <div className = "Container" >
                <div style = { cyStyle } ref = { (cyRef) => { this.cyRef = cyRef; } } /> 
            </div >
        )
    }
}

export default CytoscapeDagreGraph;