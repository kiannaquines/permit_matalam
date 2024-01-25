## Alternative PDF Generation

var dd = {
    pageSize: 'Letter',
	content: [
	    {
	        columns: [
    	        {
        	      image: '',
        	      fit: [760,82],     
        	    },
        	    {
        	        text: 'FSEC',
        	        style: 'header_text'
        	    }
    	    ],
    	 
	    },
	    {
    	    text: 'Application Number',
    	    style: 'application_number'
    	},
    	{
            canvas: [
                {
                    type: 'rect',
                    x: 440,
                    y: 5,
                    w: 20,
                    h: 30,
                    lineWidth: 1,
                    lineColor: '#000',
                    color: '#fff',
                },
                {
                    type: 'rect',
                    x: 460,
                    y: 5,
                    w: 20,
                    h: 30,
                    lineWidth: 1,
                    lineColor: '#000',
                    color: '#fff'
                },
                {
                    type: 'rect',
                    x: 480,
                    y: 5,
                    w: 20,
                    h: 30,
                    lineWidth: 1,
                    lineColor: '#000',
                    color: '#fff'
                },
                {
                    type: 'rect',
                    x: 500,
                    y: 5,
                    w: 20,
                    h: 30,
                    lineWidth: 1,
                    lineColor: '#000',
                    color: '#fff'
                },
                {
                    type: 'rect',
                    x: 520,
                    y: 5,
                    w: 20,
                    h: 30,
                    lineWidth: 1,
                    lineColor: '#000',
                    color: '#fff'
                },
                {
                    type: 'rect',
                    x: 540,
                    y: 5,
                    w: 20,
                    h: 30,
                    lineWidth: 1,
                    lineColor: '#000',
                    color: '#fff'
                },
                {
                    type: 'rect',
                    x: 560,
                    y: 5,
                    w: 20,
                    h: 30,
                    lineWidth: 1,
                    lineColor: '#000',
                    color: '#fff'
                },
                {
                    type: 'rect',
                    x: 580,
                    y: 5,
                    w: 20,
                    h: 30,
                    lineWidth: 1,
                    lineColor: '#000',
                    color: '#fff'
                }
            ]
        },
        {
            table: {
               widths: [ '*', 'auto', 100, '*' ],
               body: [
                  [ 'PROJECT OWNER', 'Kian Jearard G. Naquines' ],
                  [ 'PROJECT TITLE', 'KJ Sari Sari Store Ave.' ],
                  [ 'PROJECT LOCATION', 'New Israel Makilala, North Cotabato, 9401' ],
                  [ 'OWNER ADDRESS', 'New Israel Makilala, North Cotabato, 9401' ],
               ]
            }
        },
	],
	pageMargins: [ 0, 5, 10, 10 ],
	styles: {
		header_text: {
			fontSize: 69,
			bold: true,
			color: '#800000',
			margin: [0,0,10,0],
			alignment: 'left'
		},
		application_number: {
		    alignment: 'right',
		    bold: true,
		    fontSize: 14,
		    margin: [ 5, 0, 14, 0 ],
		},
	},
	
	
}