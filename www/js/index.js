
var dataOutput = {}
let request = async () => {
    const test = fetch('/petData')
    .then (
        function(value) {
            data = value.json()
            return data  
        }
    
    )

    
    var bam = await test
    
    // Can do the html shit here
    console.log(bam)
    var select = document.getElementById('petName')
    var opt = document.createElement('option')
    opt.value = bam[0]['Pet']
    opt.innerHTML = bam[0]['Pet']
    select.appendChild(opt)

 
    // var opt = document.createElement('option');
    // opt.value = i;
    // opt.innerHTML = i;
    // select.appendChild(opt);
    
        
    


}

var response = request()

console.log(response)