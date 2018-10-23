import React, {
    Component
} from 'react';
import './Selector.css';
import Plot from 'react-plotly.js';
import * as math from 'mathjs';
import CytoscapeDagreGraph from '../components/CytoscapeDagreGraph';


class ComplexityPlot extends Component {

    constructor(props) {

        super(props)
        this.state = {
            org: 'Achromobacter_xylosoxidans',
            stamm: 'GCF_000165835.1_ASM16583v1_genomic',
            contig: 'NC_014640.1',
            organisms: [],
            stamms: [],
            contigs: [],
            complexity: [],
            max_complexity: 0,
            OGs: [],
            og_start: 'OG0001707',
            og_end: 'OG0001707',
            coord_start: 0,
            coord_end: 0,
            coord_list: [],
            length_list: [],
            window: '5',
            tails: '5',
            depth: '30',
            freq_min: '2',
            pars: false,
            operons: true,
            methods: ['window complexity (w20)', 'probabilistic window complexity (w20)', 'IO complexity', 'probabilistic IO complexity'],
            method: 'window complexity (w20)',
            user_coordinates_str: '',
            user_coordinates: [],
            user_values: [],
            draw_types: ['line', 'markers'],
            draw_type: 'line plot',
            data: '',
            src: '',
        };
    }

    prev_state = {}


    componentDidUpdate(prev_state) {

        if (this.prev_state.org !== this.state.org) {
            let link = 'http://10.210.29.150:5000/org/' + this.state.org + '/stamms/'
            fetch(link)
                .then(response => response.json())
                .then(data => { this.setState({ 
                    stamms: data,
                    stamm: data[0] 
                }); });
                

                       
        }

        if (this.prev_state.stamm !== this.state.stamm) {
            let link = 'http://10.210.29.150:5000/org/' + this.state.org + '/stamms/' + this.state.stamm + '/contigs/'
            fetch(link)
                .then(response => response.json())
                .then(data => { this.setState({ 
                    contigs: data,
                    contig: data[0]
                }); });

                

        }

        if (this.prev_state.contig !== this.state.contig){
            
            let pars_int = 0
            if (this.state.pars === true) {
                pars_int = 1
            }

            let link = 'http://10.210.29.150:5000/org/' + this.state.org + '/stamms/' + this.state.stamm + '/contigs/' + this.state.contig + '/methods/' + this.state.method + '/pars/' + pars_int + '/complexity/'
            fetch(link)
                .then(response => response.json())
                .then(data => { this.setState({ 
                    complexity: data[0]
                });
                this.setState({
                    max_complexity: 1,
                    length_list: data[3],
                    OGs: data[1],
                    coord_list: data[2]
                }) });
                
        }

        if (this.prev_state.method !== this.state.method) {
            let pars_int = 0
            if (this.state.pars === true) {
                pars_int = 1
            }

            let link = 'http://10.210.29.150:5000/org/' + this.state.org + '/stamms/' + this.state.stamm + '/contigs/' + this.state.contig + '/methods/' + this.state.method + '/pars/' + pars_int + '/complexity/'
            fetch(link)
                .then(response => response.json())
                .then(data => { this.setState({ 
                    complexity: data[0]
                });
                this.setState({
                    max_complexity: 1,
                    length_list: data[3],
                    OGs: data[1],
                    coord_list: data[2]
                }) });

        }

        if (this.prev_state.pars !== this.state.pars) {
            let pars_int = 0
            if (this.state.pars === true) {
                pars_int = 1
            }
            

            let link = 'http://10.210.29.150:5000/org/' + this.state.org + '/stamms/' + this.state.stamm + '/contigs/' + this.state.contig + '/methods/' + this.state.method + '/pars/' + pars_int + '/complexity/'
            fetch(link)
                .then(response => response.json())
                .then(data => { this.setState({ 
                    complexity: data[0]
                });
                this.setState({
                    max_complexity: 1,
                    length_list: data[3],
                    OGs: data[1],
                    coord_list: data[2]
                }) });

        }


        if (this.prev_state.coord_start !== this.state.coord_start || this.prev_state.coord_end !== this.state.coord_end) {

            let close_st_gene = 0
            let close_end_gene = 0
            let close_st_len = Math.abs(this.state.coord_list[0] - this.state.coord_start)
            let close_end_len = Math.abs(this.state.coord_list[0] - this.state.coord_start)

            for (let i = 0; i < this.state.coord_list.length; i++) {
                let len = Math.abs(this.state.coord_list[i] - this.state.coord_start);
                if (len < close_st_len) {
                    close_st_gene = i;
                    close_st_len = len
                }
                len = Math.abs(this.state.coord_list[i] - this.state.coord_end);
                if (len < close_end_len) {
                    close_end_gene = i;
                    close_end_len = len
                }

            }


            if (this.state.OGs[close_st_gene] !== undefined && this.state.OGs[close_end_gene] !== undefined){
                this.setState({
                    og_end: this.state.OGs[close_end_gene],
                    og_start: this.state.OGs[close_st_gene]
                })
            }
        }
        

        this.prev_state = this.state



    }

    
    componentDidMount() {
        fetch('http://10.210.29.150:5000/org/')
            .then(response => response.json())
            .then(data => { this.setState({ 
                organisms: data.sort(),
                org: data[0]
             }) });
        
        let link = 'http://10.210.29.150:5000/org/' + this.state.org + '/stamms/'
        fetch(link)
            .then(response => response.json())
            .then(data => { this.setState({ 
                stamms: data,
                stamm: data[0]
            }) });

        link = link + this.state.stamm + '/contigs/'
        fetch(link)
            .then(response => response.json())
            .then(data => { this.setState({ 
                contigs: data,
                contig: data[0]
             }) });
        
        link = link + this.state.contig + '/methods/' + this.state.method + '/pars/0/complexity/'
        fetch(link)
            .then(response => response.json())
            .then(data => { this.setState({ complexity: data[0] }); this.setState({ OGs: data[1] });});

    
    }

    handleSubmit = (event) => {
        
        this.props.getDataFromSelector(this.state)
        event.preventDefault();
    }
    
    
    drawUserCoordinates = (e) =>{
        if (this.state.user_coordinates_str.length !== 0) {
            
            let string = this.state.user_coordinates_str.replace(' ', '').replace('\t', '').replace('\n', '')

            let lines;
            lines = string.split(',');
            this.setState({user_coordinates: []})
            let coord = []
            let values = []
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i].split(':');
                coord.push(parseInt(line[0], 10));
                values.push(parseFloat(line[1]))
            }
            this.setState({
                user_coordinates: coord,
                user_values: values
            })

        }
        e.preventDefault()
    }
    

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value})
    }

    checkPars = (event) => {

        this.setState({ pars : event.target.checked });
    }

    checkOperons = (event) => {
        this.setState({ operons : event.target.checked });
    }

    inputFileChanged = (e) => {

        if(window.FileReader){
            let file = e.target.files[0], reader = new FileReader();
            reader.onload = function(r){
                this.setState({
                    user_coordinates_str: r.target.result
                });
            }.bind(this)
            reader.readAsText(file);
        }
        else {
            alert('Sorry, your browser does\'nt support for preview');
        }
    }

    render() {
        return (
            
            <Plot


                data={[
                {   
                    x: this.state.coord_list,
                    y: this.state.complexity,
                    text: this.state.OGs,
                    type: 'line',
                    name: 'complexity'
                },

                {   
                    x: [this.state.coord_start, this.state.coord_start],
                    y: [-this.state.max_complexity/2, this.state.max_complexity],
                    mode: 'lines',
                    name: 'left edge'
                },
                {   
                    x: [this.state.coord_end, this.state.coord_end],
                    y: [-this.state.max_complexity/2, this.state.max_complexity],
                    mode: 'lines',
                    name: 'rigth edge'
                },

                {
                    x: this.state.user_coordinates,
                    y: this.state.user_values,
                    mode: this.state.draw_type,
                    name: 'user values',
                    opacity: 0.5,
                    yaxis: 'y2',
                    marker: {
                        size: 5,
                      },
                }


                ]}
                layout={ 
                    {
                        width: window.innerWidth, 
                        height: 400, 
                        title: 'Genome complexity, ' + this.state.org + ', contig ' + this.state.contig + ', ' + this.state.method,
                        
                        xaxis: {
                            title: 'Chromosome position, bp',
                        },

                        yaxis: {
                            title: 'complexity',
                            overlaying: 'y2'
                        },
                        
                        yaxis2: {
                            title: 'user values',
                            side: 'right'
                        }
                    } 
                }
                onClick={(data) => {this.setState({ 
                    og_start: data.points[0].text,
                    og_end: data.points[0].text,
                    coord_start: data.points[0].x,
                    coord_end: data.points[0].x });
                }}
            />
            
        )
    }

}

export default Selector