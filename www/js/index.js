
var dataOutput = {}
let request = async () => {
    const test = fetch('/petNames')
    .then (
        function(value) {
            data = value.json()
            return data  
        }
    
    )

    var bam = []
    bam = await test
    bam = JSON.parse(bam)

    if (bam.length == undefined) {
        window.alert('Issue connecting to Database. Try again later.')
    }
    
    else {
        for (let i=0; i<bam.length;i++) {
            var select = document.getElementById('petName')
            var opt = document.createElement('option')
            opt.value = bam[i]['Pet']
            opt.innerHTML = bam[i]['Pet']
            select.appendChild(opt)
        }
    }
    
    
 
   


}


function bodyFunction() {
    display_ct()
    request()
}

function display_clock(){
    var refresh=1000; // Refresh rate in milli seconds
    mytime=setTimeout('display_ct()',refresh)
    }
    
    function display_ct() {
    var x = new Date().toLocaleString()
    document.getElementById('clock').innerHTML = x;
    display_clock();
     }

