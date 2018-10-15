import React, {
    Component
} from 'react';
import 'JSON';
import tippy from 'tippy.js'

import cytoscape from 'cytoscape';
import popper from 'cytoscape-popper';
import dagre from 'cytoscape-dagre';
import EdgeDescription from '../components/EdgeDescription';
import '../App.css';

cytoscape.use(dagre);
cytoscape.use(popper);

let conf = {
    boxSelectionEnabled: true,
    autounselectify: false,
    zoomingEnabled: true,
    style: [{
        selector: 'node',
        style: {
            'label': 'data(id)',
            'font-size': "10pt",
            'text-valign': 'center',
            'text-halign': 'center',
            'background-color': 'data(color)',
            'border-width': 'data(bwidth)',
            'border-color': 'data(bcolor)',
            'border-opacity': 0.7
        }
    },
    {
        selector: 'edge',
        style: {
            'width': 'data(penwidth)',
            "curve-style": "unbundled-bezier",
            'target-arrow-shape': 'triangle',
            'line-color': 'data(color)',
            'target-arrow-color': 'data(color)',
            'opacity': 'data(opacity)'
        }
    },
    {
        selector: ':selected',
        style: {
            'background-color': 'green',
            'line-color': 'green',
            'target-arrow-color': 'green',
            'source-arrow-color': 'green',
            'opacity': 0.5
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
            cy: {},
            edge_description: ''
        }
    }

    componentDidMount() {
        conf.container = this.cyRef;
        conf.elements = this.props.data;
        const cy = cytoscape(conf);

        this.setState({
            cy: cy
        });

    }

    componentWillReceiveProps(nextProps) {
        if (this.state.cy) {
            this.state.cy.destroy();
        }
        

        
        conf.container = this.cyRef;

        conf.elements = nextProps.data;

        const cy = cytoscape(conf);

        let makeTippy = function (node, text) {
            return tippy(node.popperRef(), {
                html: (function () {
                    let div = document.createElement('div');
                    div.innerHTML = text;
                    return div;
                })(),
                trigger: 'manual',
                arrow: true,
                placement: 'bottom',
                hideOnClick: false,
                multiple: true,
                sticky: true
            }).tooltips[0];
        };

        let tips = []

        cy.nodes().forEach(function (ele) {
            tips.push({'node':ele.id(), 'tip': makeTippy(ele, ele.data().description)})
        });

        cy.edges().forEach(function (ele) {
            tips.push({'edge':ele.id(), 'tip': makeTippy(ele, ele.data().description)})
        });

        let clicked = []
        cy.on('click', 'node', function (evt) {
            let node_id = evt.target.id()
            let clickedTippy = tips.find(function(ele) {
                return ele.node === node_id;
            });

            if(clicked.includes(node_id)){
                clicked.splice( clicked.indexOf(node_id), 1 );
                clickedTippy.tip.hide();
            }
            else{
                clicked.push(evt.target.id());
                clickedTippy.tip.show();
            }
            
        });

        cy.on('click', 'edge', function (evt) {

            this.setState({
                edge_description: evt.target.data().description
            });
            
        }.bind(this));

        this.setState ({
            cy: cy
        });
        console.log('DRAW')
    }
    


    render() {
        return (
            <div>
                <div className="Container" >
                    <div style={cyStyle} ref={(cyRef) => { this.cyRef = cyRef; }} />  
                </div >
                <EdgeDescription edge_description={this.state.edge_description}/>
            </div>
        )
    }
}

export default CytoscapeDagreGraph;