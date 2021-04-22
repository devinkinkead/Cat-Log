
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
    var validCookie = false
    bam = await test
    bam = JSON.parse(bam)
    
    try {
        let t = bam[0]['Pet']
        validCookie = true
    }
    catch {
        // window.alert('Session Expired. Logging Out.')
        // // window.location = "/"
        
    }
    if (validCookie) {
        if (bam.length == undefined) {
            window.alert('Issue connecting to Database. Try again later.')
        }
        
        else {
            for (let i=0; i<bam.length;i++) {
                var select = document.getElementById('petName')
                var opt = document.createElement('option')
                opt.value = bam[i]['ID']
                opt.innerHTML = bam[i]['Pet']
                select.appendChild(opt)
            }
        }
    }
    
    
    
 
   


}




function bodyFunction() {
    loginCheck()
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

async function loginCheck() {
let test = await fetch('/loginCheck')
let result = await test.json()

let resultParse = JSON.parse(JSON.stringify(result))

if (resultParse.valid == 0) {
    window.alert('Session Expired. Logging out.')
    window.location = '/' 
}
else {
}
}