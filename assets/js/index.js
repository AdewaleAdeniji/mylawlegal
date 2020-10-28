var data;
    window.addEventListener('load',fetchcases);
    $("#months").change(function(){
        document.querySelector("#s-line").innerHTML='Loading...'; //we insert a loading text in anticipation for graph
        var month = $("#months").val(); //get the chosen month
        if(month!=""){
        loadcase(data,month); //load the chart
        }
    })
    function intro(){
        if(localStorage.getItem('newuser')==undefined){
        document.querySelector("#btnmodal").click();
        localStorage.setItem('newuser','newuser');
        }
    }
    function fetchcases(){
        intro();
        //we fetch the cases and month list from a json server/backend
        document.querySelector("#s-line").innerHTML='Loading...'; 
        fetch('data.json',{
            method:'GET'
        })
        .then(response=>response.json())
        .then((resource)=>{

            data = resource;
            //access data for dashboard 
            let newcases = data.newcases;
            let lawyers = data.lawyersavailable;
            let inprogress = data.inprogress;

            document.querySelector("#inprogress").innerHTML=inprogress;//send the value of cases in progress to html
            document.querySelector("#lawyers").innerHTML=lawyers;//send the value of lawyers available
            document.querySelector("#newcases").innerHTML=newcases;//send the value of new cases
            

            loadcase(data); //call the function to load case and draw chart

            let months = data.months; //get the list of months and map into select input
             data.months.forEach((monthselect)=>{
                $("#months").append('<option value='+monthselect+'>'+monthselect+'</option>');

            })

        })
        .catch((err)=>{
            console.log(err);
             document.querySelector("#s-line").innerHTML='Error Occured While trying to fetch data,Refresh your browser and try again';
        })
        
    }   
    function loadcase(data,month){
        if(month==undefined){
            month = 'october';
        }
         //now we need to load the data for graph for the current month
        let monthdata = data[month];
        let activecase = monthdata.active;
        let closedcase = monthdata.closed;
        let newcases = monthdata.new;
        let monthdates = monthdata.date;
        //then we can call the function to load chart based on the data gotten
        loadchart(monthdates,activecase,closedcase,newcases);


    }

    function loadchart(date,active,closed,newcases){
        document.querySelector("#s-line").innerHTML='';
        var sLineArea = {
            chart: {
                height: 350,
                type: 'area',
                toolbar: {
                  show: true,
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            series: [{
                name: 'Active Cases',
                data:  active
            }, {
                name: 'Closed Cases',
                data: closed
            }, {
                name: 'New Cases',
                data: newcases
            }],

            xaxis: {
                type:'string',
                categories:date,                
            },

        }

        var chart = new ApexCharts(
            document.querySelector("#s-line"),
            sLineArea
        );

        chart.render();
            }

if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js')
    .then(()=>{
        //console.log("serviceworker registered"); 
    })
    .catch((err)=>{
        //console.log("serviceworker not registered"+err);
    })
}